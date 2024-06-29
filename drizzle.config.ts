import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: 'mysql',
    dbCredentials: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "admin1234",
        database: "questions"
    },
    verbose: true,
    strict: true,
})
