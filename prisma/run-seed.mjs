// prisma/run-seed.mjs
// Wrapper to run seed with DIRECT_URL (bypasses pgbouncer for DML operations)
import { execSync } from "child_process"

const directUrl = process.env.DIRECT_URL
if (!directUrl) {
    console.warn("⚠️  DIRECT_URL not set — falling back to DATABASE_URL")
}

execSync("npx tsx prisma/seed.ts", {
    stdio: "inherit",
    env: {
        ...process.env,
        ...(directUrl ? { DATABASE_URL: directUrl } : {}),
    },
})
