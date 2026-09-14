import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// apps/api/src/env.ts -> repo root .env (3 levels up, same depth after build to dist/)
config({ path: path.resolve(__dirname, '../../../.env') });
