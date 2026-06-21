import { query, queryOne } from "../lib/db";
import type { ResourceGenerationRow, ResourceType, ResourceFormat } from "../types/db";

export async function saveResourceGeneration(
  studentId: string,
  topic: string,
  resourceType: ResourceType,
  contentJson: unknown,
  subjectId?: string | null,
  format: ResourceFormat = "INLINE",
): Promise<ResourceGenerationRow> {
  const row = await queryOne<ResourceGenerationRow>(
    `INSERT INTO "ResourceGeneration" ("studentId", topic, "resourceType", "contentJson", "subjectId", format)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [studentId, topic, resourceType, JSON.stringify(contentJson), subjectId ?? null, format],
  );
  if (!row) throw new Error("Failed to save resource generation");
  return row;
}

export async function listRecentResources(studentId: string, limit = 20): Promise<ResourceGenerationRow[]> {
  return query<ResourceGenerationRow>(
    `SELECT * FROM "ResourceGeneration" WHERE "studentId" = $1 ORDER BY "createdAt" DESC LIMIT $2`,
    [studentId, limit],
  );
}
