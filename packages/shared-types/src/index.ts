// Handgepflegte, wirklich geteilte Konstanten/Typen (keine DTOs!).
// DTOs/Request-Response-Typen kommen aus ./generated (via `pnpm generate:api-client`,
// siehe orval.config.ts) und werden NICHT von Hand gepflegt.

export const PERMISSIONS = {
  MENU_READ: "menu:read",
  MENU_WRITE: "menu:write",
  MENU_TRANSLATE: "menu:translate",
  RESTAURANT_ADMIN: "restaurant:admin",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Re-export des generierten Clients, sobald `generate:api-client` einmal gelaufen ist.
// Bis dahin existiert der Ordner nicht -> Zeile einkommentieren nach erstem Codegen-Lauf.
// export * from "./generated";
