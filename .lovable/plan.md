

## Fix Build Error and Rebuild

There is a TypeScript error in the edge function `supabase/functions/fetch-quran-pdf/index.ts` at line 72. The `error` variable in the catch block is of type `unknown`, so accessing `error.message` directly is not allowed.

### Change

**File:** `supabase/functions/fetch-quran-pdf/index.ts` (line 72)

Change:
```typescript
JSON.stringify({ error: error.message }),
```
To:
```typescript
JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
```

This is the only change needed to fix the build error.

