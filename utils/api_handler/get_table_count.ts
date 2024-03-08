import { databaseDrizzle } from "@/db/database";
import { sql } from "drizzle-orm";
import { parseInt } from "lodash";

export default async function getTableCount(
  tableName: string,
  condition?: string,
  valueCondition?: number | string,
): Promise<number> {
  const statement = sql.raw(`SELECT COUNT(*) AS tableCount FROM ${tableName}`);
  const statementWithCondition = sql.raw(
    `SELECT COUNT(*) AS tableCount FROM ${tableName} AS t WHERE t.${condition} = ${valueCondition}`,
  );

  const result = await databaseDrizzle
    .execute(condition ? statementWithCondition : statement)
    .then((res) => res[0]);
  return parseInt(`${result.tablecount}`);
}
