import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "./lib/db";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    max: 10,
  }),
});

const db = new Kysely<DB>({ dialect });
export default db;
