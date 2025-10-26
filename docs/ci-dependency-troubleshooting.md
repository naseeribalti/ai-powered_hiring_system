# CI dependency troubleshooting: Cloudinary peer-deps

When installing dependencies in CI, you may hit:

```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! While resolving: ai-hiring-system@0.1.0
npm ERR! Found: cloudinary@2.x
npm ERR! Could not resolve dependency:
npm ERR! peer cloudinary@^1.21.0 from multer-storage-cloudinary@4.x
```

## Root cause

- `multer-storage-cloudinary@^4.0.0` requires `cloudinary@^1.x`.
- Resolving `cloudinary@2.x` causes a peer-deps conflict.

## Fix implemented

- Pin Cloudinary to a compatible 1.x series using npm overrides:

```json
{
  "overrides": {
    "cloudinary": "^1.41.3"
  }
}
```

- This is committed in `package.json` and ensures all environments (local and CI) resolve Cloudinary 1.x.

## CI configuration

- The workflow uses `npm install` (not `npm ci`), which regenerates a lockfile on the runner and respects `overrides`.
- If you switch to `npm ci`, commit a `package-lock.json` and ensure it has Cloudinary 1.x resolved, or keep using `npm install` for flexibility.

## Local verification

- After updating, run:
  - `npm install` at repo root — should succeed.
  - `npm run backend:dev` — server should start, Mongo should connect (in dev).

## Notes

- Migrating to Cloudinary v2 would require replacing `multer-storage-cloudinary@4` with a v2-compatible approach (or direct SDK uploads) before upgrading.
