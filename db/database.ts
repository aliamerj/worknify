import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as users from "./schemes/userSchema";
import * as allProfile from "./schemes/profileSchema";

const schema = {
  ...users,
  ...allProfile,
};
const connection = process.env.DATABASE_URL as string;

//export const migrationClient = postgres(connection, { max: 1 });
const queryClient = postgres(connection);
export const databaseDrizzle = drizzle(queryClient, { schema });
export const migrationClient = migrate(databaseDrizzle, {
  migrationsFolder: "drizzle",
});
