import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.DB_HOST as string,
        port: parseInt(process.env.DB_PORT as string, 10),
        user: process.env.DB_USER as string,
        password: process.env.DB_PASS as string,
        database: process.env.DB_NAME as string
    },
    verbose: true,
    strict: true,
})
