---
description: Add a new DAL function — templated with guard, DTO, and server-only
---

# Add DAL Workflow

Use this when adding a new query or mutation function to an existing DAL file, or creating a new DAL file.

## If creating a NEW DAL file

1. Create `lib/dal/<entity>.ts` with this exact skeleton:

```typescript
import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import { createSystemLog } from "@/lib/dal/system-logs"

// ── DTO ──
export type EntityDTO = {
    id: string
    // ... fields
    createdAt: Date
}
```

## If adding to an EXISTING DAL file

2. Read **only** the target DAL file — do not read other DAL files.

## Write the function

3. Use the appropriate template from `_agent/context/patterns.md`:
   - **Read (list)**: DAL pattern #1 — use `cache()`, return `Promise<DTO[]>`
   - **Read (by ID)**: DAL pattern #2 — return `Promise<DTO | null>`
   - **Write (create)**: DAL pattern #3 — log with `createSystemLog`
   - **Write (update)**: Similar to create, call `createSystemLog` with "UPDATE"
   - **Write (delete)**: Call `createSystemLog` with "DELETE"

4. Checklist before finishing:
   - [ ] `import "server-only"` at top of file
   - [ ] `requireCurrentUser()` or `requireAdminUser()` called
   - [ ] Returns typed DTO (not raw Prisma model)
   - [ ] `Decimal` fields mapped with `.toNumber()`
   - [ ] Multi-table ops wrapped in `$transaction()`
   - [ ] System log created for write operations

// turbo
5. Build check:
```bash
npm run build
```
