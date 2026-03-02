#!/bin/sh
set -e

# ============================================================
# Production entrypoint
# Runs Prisma migrations before starting the Next.js server.
# ============================================================

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy 2>/dev/null || {
    echo "⚠️  prisma migrate deploy failed (this is expected if using db push workflow)."
    echo "   Pushing schema instead..."
    npx prisma db push --skip-generate 2>/dev/null || {
        echo "⚠️  prisma db push also failed — starting without migration."
        echo "   Make sure your database schema is up to date."
    }
}
echo "✅ Database ready."

# Hand off to CMD (node server.js)
exec "$@"
