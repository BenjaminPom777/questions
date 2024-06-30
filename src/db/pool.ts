import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
});

const db = drizzle(pool, { schema, mode: 'default' });

export default db;

// (async () => {
//     const result = await db.query.questions.findMany()
//     console.log(result)
// })()

