import { defineConfig } from "orval";

// Generiert einen typsicheren TanStack-Query-Client aus der laufenden
// NestJS-Swagger-Spec. Voraussetzung: `pnpm dev:api` läuft, damit
// http://localhost:3001/api-json erreichbar ist.
//
// Aufruf: pnpm generate:api-client   (im Root, oder hier im Package)
export default defineConfig({
  menuevo: {
    input: {
      target: "http://localhost:3001/api-json",
    },
    output: {
      mode: "tags-split",
      target: "./src/generated/endpoints",
      schemas: "./src/generated/models",
      client: "react-query",
      httpClient: "fetch",
      baseUrl: process.env.VITE_API_URL ?? "http://localhost:3001",
      override: {
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
