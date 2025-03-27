import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const typedDb = db as PostgresJsDatabase;
  const records = await typedDb.insert(advocates).values(advocateData).returning();

  return Response.json({ advocates: records });
}
