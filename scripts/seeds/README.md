# Seed Scripts Overview

This folder contains seeds and utilities used to populate the database for development and production environments.

Files and purpose:
- `scripts/auth/create-admin.ts` (TypeScript): Development script that can create admin and seed using TS data modules (`--dev` flag uses development data and images).
- `scripts/auth/create-admin.js` (JavaScript): Production-ready script that creates admin and optionally seeds production data found in `scripts/seeds/data/prod`.
- `scripts/seeds/tools/generateProdProgramDetails.js`: Generator that converts `scripts/data/programDetailsData.ts` into a production-safe CommonJS file with default images and no local paths.
- `scripts/seeds/data/prod/*`: Production JS seed data with `DEFAULT_IMAGE` placeholders to avoid local assets in production.

Recommended workflows:
- Development: Run `npm run seed:dev` to use TypeScript files and seed images locally.
- Production/staging: Run `npm run seed:all` (executes `create-admin.js --seed-all`) to seed using production data (uses default image placeholders).

Note: If you change TypeScript data files under `scripts/data/`, run the generator script to update the production equivalents.
