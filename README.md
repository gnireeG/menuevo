# MenuEvo Monorepo

pnpm-Workspace mit getrenntem Frontend/Backend + geteilten Types.

```
apps/
  web/            TanStack Start (React) - Frontend
  api/            NestJS - Backend, Business-Logik, Auth, POS, Translation-Jobs
packages/
  shared-types/   Handgepflegte geteilte Konstanten + generierter API-Client
docker/
  docker-compose.yml   Postgres + Redis für lokale Entwicklung
```

## Setup

```bash
cp .env.example .env
pnpm install
pnpm docker:up          # startet Postgres + Redis
pnpm dev                # startet web (:3000) + api (:3001) parallel
```

- Web: http://localhost:3000
- API: http://localhost:3001/api
- Swagger UI: http://localhost:3001/docs

## Typsicherer API-Client (Backend -> Frontend)

DTOs/Response-Typen werden **nicht von Hand** im Frontend nachgebaut. Stattdessen:

1. NestJS-Controller/DTOs mit `@nestjs/swagger`-Decorators annotieren (siehe
   `apps/api/src/modules/health` als Beispiel).
2. `pnpm dev:api` laufen lassen (Swagger-Spec liegt dann unter `/api-json`).
3. `pnpm generate:api-client` ausführen -> generiert TanStack-Query-Hooks
   + Typen nach `packages/shared-types/src/generated`.
4. In `apps/web` importieren: `import { useHealthControllerCheck } from "shared-types"`
   (Hook-Namen ergeben sich aus Controller-/Methodennamen, ggf. in
   `packages/shared-types/orval.config.ts` anpassen).

Der generierte Code wird committed (kein `.gitignore`-Eintrag), damit PRs
zeigen, wenn sich die API-Form ändert.

## Auth/Permissions

Echte Auth-/Permission-Checks laufen ausschließlich in `apps/api` (NestJS
Guards). `apps/web` macht nur UX-seitige Redirects/Conditional-Rendering,
nie sicherheitsrelevante Checks.

## Nächste Schritte (Architektur)

- `apps/api/src/modules/menu` - Menüs, Sections, Items
- `apps/api/src/modules/translation` - Diff-Erkennung pro Item/Sprache +
  BullMQ-Queue für OpenAI-Calls (Redis ist bereits in docker-compose)
- `apps/api/src/modules/pdf` - QR-Code + PDF-Generierung
- `apps/api/src/modules/pos` - POS-Adapter (späteres Feature)
