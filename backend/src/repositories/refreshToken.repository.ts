import crypto from "crypto";
import { query, queryOne } from "../lib/db";
import type { RefreshTokenRow } from "../types/db";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
  await query(
    `INSERT INTO "RefreshToken" ("userId", "tokenHash", "expiresAt") VALUES ($1, $2, $3)`,
    [userId, hashToken(token), expiresAt],
  );
}

export async function findValidRefreshToken(token: string): Promise<RefreshTokenRow | null> {
  return queryOne<RefreshTokenRow>(
    `SELECT * FROM "RefreshToken"
     WHERE "tokenHash" = $1 AND "revokedAt" IS NULL AND "expiresAt" > now()`,
    [hashToken(token)],
  );
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await query(`UPDATE "RefreshToken" SET "revokedAt" = now() WHERE "tokenHash" = $1`, [hashToken(token)]);
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await query(`UPDATE "RefreshToken" SET "revokedAt" = now() WHERE "userId" = $1 AND "revokedAt" IS NULL`, [userId]);
}
