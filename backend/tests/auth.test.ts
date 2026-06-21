import { describe, it, expect, afterAll } from "vitest";
import * as authService from "../src/services/auth.service";
import { pool } from "../src/lib/db";
import { verifyRefreshToken } from "../src/lib/jwt";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.studypilot`;
}

describe("auth.service", () => {
  const createdUserIds: string[] = [];

  afterAll(async () => {
    for (const id of createdUserIds) {
      await pool.query('DELETE FROM "User" WHERE id = $1', [id]);
    }
  });

  it("registers a new student and returns valid tokens", async () => {
    const email = uniqueEmail("student");
    const { user, tokens, requiresParentConsent } = await authService.register({
      email,
      password: "StrongPass123",
      name: "Test Student",
      role: "STUDENT",
      gradeLevel: "SS1",
    });
    createdUserIds.push(user.id);

    expect(user.email).toBe(email);
    expect(user.role).toBe("STUDENT");
    expect(requiresParentConsent).toBe(false);
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();

    const decoded = verifyRefreshToken(tokens.refreshToken);
    expect(decoded.userId).toBe(user.id);
  });

  it("rejects registering the same email twice", async () => {
    const email = uniqueEmail("dupe");
    const { user } = await authService.register({
      email,
      password: "StrongPass123",
      name: "First",
      role: "STUDENT",
      gradeLevel: "SS1",
    });
    createdUserIds.push(user.id);

    await expect(
      authService.register({ email, password: "Another123", name: "Second", role: "STUDENT", gradeLevel: "SS1" }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("requires a parent email for students under 13", async () => {
    const email = uniqueEmail("minor");
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 11); // 11 years old

    await expect(
      authService.register({
        email,
        password: "StrongPass123",
        name: "Young Student",
        role: "STUDENT",
        gradeLevel: "JSS1",
        dateOfBirth: dob.toISOString(),
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("flags requiresParentConsent=true when a parent email is supplied for an under-13 student", async () => {
    const email = uniqueEmail("minor-with-parent");
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 10);

    const { user, requiresParentConsent } = await authService.register({
      email,
      password: "StrongPass123",
      name: "Young Student",
      role: "STUDENT",
      gradeLevel: "JSS1",
      dateOfBirth: dob.toISOString(),
      parentEmail: "parent-of-minor@test.studypilot",
    });
    createdUserIds.push(user.id);

    expect(requiresParentConsent).toBe(true);

    const consentRow = await pool.query('SELECT * FROM "ParentConsent" WHERE "studentId" = $1', [user.id]);
    expect(consentRow.rows.length).toBe(1);
    expect(consentRow.rows[0].status).toBe("PENDING");
  });

  it("logs in with correct credentials and rejects wrong password", async () => {
    const email = uniqueEmail("login");
    const { user } = await authService.register({
      email,
      password: "CorrectPass123",
      name: "Login Test",
      role: "STUDENT",
      gradeLevel: "SS1",
    });
    createdUserIds.push(user.id);

    const { tokens } = await authService.login(email, "CorrectPass123");
    expect(tokens.accessToken).toBeTruthy();

    await expect(authService.login(email, "WrongPassword")).rejects.toMatchObject({ statusCode: 401 });
  });

  it("rotates refresh tokens on use and rejects the old one afterward", async () => {
    const email = uniqueEmail("rotate");
    const { user, tokens } = await authService.register({
      email,
      password: "StrongPass123",
      name: "Rotate Test",
      role: "STUDENT",
      gradeLevel: "SS1",
    });
    createdUserIds.push(user.id);

    const newTokens = await authService.refresh(tokens.refreshToken);
    expect(newTokens.refreshToken).not.toBe(tokens.refreshToken);

    // The original refresh token should now be revoked (rotation).
    await expect(authService.refresh(tokens.refreshToken)).rejects.toMatchObject({ statusCode: 401 });

    // The new one should still work.
    const thirdRound = await authService.refresh(newTokens.refreshToken);
    expect(thirdRound.accessToken).toBeTruthy();
  });

  it("logout revokes the refresh token", async () => {
    const email = uniqueEmail("logout");
    const { user, tokens } = await authService.register({
      email,
      password: "StrongPass123",
      name: "Logout Test",
      role: "STUDENT",
      gradeLevel: "SS1",
    });
    createdUserIds.push(user.id);

    await authService.logout(tokens.refreshToken);
    await expect(authService.refresh(tokens.refreshToken)).rejects.toMatchObject({ statusCode: 401 });
  });
});
