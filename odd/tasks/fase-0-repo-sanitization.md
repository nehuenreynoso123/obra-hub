# Phase 0 — Repository Sanitization

## Objective

Restore a green build and remove the dead Marketplace scaffolding that currently
prevents `tsc` from compiling, before any new feature work starts.

## Problem

- `src/Contexts/Marketplace/Auth/application/Register/RegisterAccount.ts` imports
  `Account` from `Users/domain/User.ts` (which exports `User`) and `AccountId` /
  `AccountName` / `AccountEmail` / `AccountZone` / `AccountPassword` from files that
  export `UserId` / `UserName` / `UserEmail` / `UserZone` / `UserPassword`.
- `tsconfig.json` includes `src/**/**.ts`, so `pnpm build:tsc` fails.
- `TypeOrmClientFactory` hardcodes `synchronize: true` and `logging: true` for every
  environment, which lets TypeORM mutate the production schema on boot.
- Postgres configuration for the Marketplace app is imported from
  `Contexts/Mooc/Shared/infrastructure/persistence/postgre` — cross-context coupling
  inherited from the template.

## Scope

In scope: deletion of dead Marketplace code, environment-aware TypeORM options,
and a verified green baseline. Out of scope: new domain code, migrations, CI
provider selection, and any change to the `Auth` bounded context behavior.

## Constraints

- 400 changed lines per PR unless a `size:exception` is recorded. F0-1 is a
  deletion-only PR and carries an approved `size:exception`.
- `Auth` must keep working unchanged: same routes, same DI keys, same behavior.
- No new runtime dependency.

## Tasks

- [ ] **F0-1** Remove dead Marketplace contexts and their app-level wiring.
- [ ] **F0-2** Make TypeORM `synchronize` / `logging` environment-aware (never enabled
      outside `dev`/`test`).
- [ ] **F0-3** Move Postgres config out of the Mooc context into Shared.
- [ ] **F0-4** Verify baseline green: `pnpm build:tsc`, `pnpm test:unit`,
      marketplace backend boots and `/status` responds.

## F0-1 deletion manifest

Delete:

```
src/Contexts/Marketplace/
src/apps/marketplace/backend/controllers/ProductPutController.ts
src/apps/marketplace/backend/controllers/ProductDeleteController.ts
src/apps/marketplace/backend/controllers/AccountPutController.ts
src/apps/marketplace/backend/routes/products.route.ts
src/apps/marketplace/backend/dependency-injection/Products/
tests/Contexts/Marketplace/Auth/__mocks__/CoursesCounterRepositoryMock.ts
tests/apps/marketplace/backend/features/account/create-account.feature
```

Edit:

```
src/apps/marketplace/backend/dependency-injection/application.yaml
src/apps/marketplace/backend/dependency-injection/apps/application.yaml
```

Keep: `controllers/Controller.ts`, `controllers/StatusGetController.ts`,
`controllers/Auth/*`, `routes/auth.route.ts`, `routes/status.route.ts`.

## Acceptance criteria

1. `pnpm build:tsc` exits 0.
2. `pnpm test:unit` exits 0.
3. `pnpm dev:marketplace:backend` boots; `GET /status` returns 200 without a token.
4. No file under `src/` references `Contexts/Marketplace`.
5. `TypeOrmClientFactory` never sets `synchronize: true` or `logging: true` when
   `NODE_ENV` is `production`.
6. `Auth` signup/signin/refresh routes still resolve through the DI container.

## Checks

```
pnpm build:tsc
pnpm test:unit
```

## Progress

- Created task document and feature branch `chore/remove-dead-marketplace`.

## Delivery

- PR label: `size:exception` (deletion-only, ~1400 removed lines).
