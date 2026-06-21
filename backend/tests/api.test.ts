import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { pool } from "../src/lib/db";

const app = createApp();

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.studypilot`;
}

describe("API routes (real HTTP via supertest, full middleware chain)", () => {
  const createdUserIds: string[] = [];

  afterAll(async () => {
    for (const id of createdUserIds) {
      await pool.query('DELETE FROM "User" WHERE id = $1', [id]);
    }
  });

  it("GET /api/health returns 200 with real DB and Redis status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.database).toBe(true);
    expect(res.body.data.redis).toBe(true);
  });

  it("GET /api/nonexistent returns a clean 404, not a crash", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });

  it("POST /api/auth/register rejects an invalid body with 400 VALIDATION_ERROR (zod middleware wired correctly)", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "not-an-email", password: "short" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("registers via real HTTP, logs in, and accesses a protected route with the returned token", async () => {
    const email = uniqueEmail("api-flow");

    const registerRes = await request(app).post("/api/auth/register").send({
      email,
      password: "StrongPass123",
      name: "API Flow Test",
      role: "STUDENT",
      gradeLevel: "SS1",
    });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data.user.email).toBe(email);
    createdUserIds.push(registerRes.body.data.user.id);

    const loginRes = await request(app).post("/api/auth/login").send({ email, password: "StrongPass123" });
    expect(loginRes.status).toBe(200);
    const { accessToken } = loginRes.body.data.tokens;
    expect(accessToken).toBeTruthy();

    const meRes = await request(app).get("/api/student/me").set("Authorization", `Bearer ${accessToken}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.gradeLevel).toBe("SS1");
  });

  it("rejects a protected route with no Authorization header (401)", async () => {
    const res = await request(app).get("/api/student/me");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects a protected route with a malformed token (401, not a 500 crash)", async () => {
    const res = await request(app).get("/api/student/me").set("Authorization", "Bearer not-a-real-jwt");
    expect(res.status).toBe(401);
  });

  it("enforces RBAC at the HTTP layer — a STUDENT token cannot access admin routes (403)", async () => {
    const email = uniqueEmail("rbac-test");
    const registerRes = await request(app).post("/api/auth/register").send({
      email,
      password: "StrongPass123",
      name: "RBAC Test Student",
      role: "STUDENT",
      gradeLevel: "SS1",
    });
    createdUserIds.push(registerRes.body.data.user.id);
    const { accessToken } = registerRes.body.data.tokens;

    const res = await request(app).get("/api/admin/analytics").set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("GET /api/library/subjects (public route) works without auth and respects category filter", async () => {
    const res = await request(app).get("/api/library/subjects").query({ category: "SCIENCES" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    for (const subject of res.body.data) {
      expect(subject.category).toBe("SCIENCES");
    }
  });

  it("rejects duplicate registration with 409 CONFLICT via real HTTP", async () => {
    const email = uniqueEmail("conflict-test");
    const body = { email, password: "StrongPass123", name: "Conflict Test", role: "STUDENT", gradeLevel: "SS1" };

    const first = await request(app).post("/api/auth/register").send(body);
    createdUserIds.push(first.body.data.user.id);

    const second = await request(app).post("/api/auth/register").send(body);
    expect(second.status).toBe(409);
    expect(second.body.error.code).toBe("CONFLICT");
  });
});
