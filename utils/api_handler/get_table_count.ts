import { databaseDrizzle } from "@/db/database";
import { sql } from "drizzle-orm";

export default async function getTableCount(
  tableName: string,
): Promise<number> {
  const statement = sql.raw(
    `SELECT COUNT(*) AS projectsCount FROM ${tableName}`,
  );
  const result = await databaseDrizzle.execute(statement).then((res) => res[0]);
  return result.projectscount as number;
}
