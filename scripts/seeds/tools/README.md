# Seed Generator Tools

This folder contains utilities to generate production-ready seed files from development TypeScript data files.

Usage:
- To generate the production `programDetailsData.js` from `scripts/data/programDetailsData.ts`:

```powershell
node scripts/seeds/tools/generateProdProgramDetails.js
```

Notes:
- The generator replaces TypeScript `export const programDetails` with a CommonJS export and maps `profileImage` values to a default public image URL to avoid missing local images in production.
- You can add additional utilities to generate other prod files following the same pattern.
