# Phase 1 — Núcleo Lead-Gen (Professional / Job / Offer / Assignment / Review)

## Objective
Implementar el núcleo mínimo para el modelo lead-gen de obra-hub: que un cliente publique un pedido de trabajo por zona/categoría, que profesionales se auto-inscriban, que puedan hacer ofertas y que el contacto se revele solo tras una asignación.

## Product rules (locked)
- **Modelo**: Lead-gen / contacto (sin pagos, sin escrow, sin KYC)
- **Profesionales**: auto-inscripción abierta, perfil público limitado hasta completar datos
- **Cliente**: crea `Job` por zona + categoría + descripción
- **Oferta**: un profesional puede ofertar a un `Job` abierto; **máximo 1 oferta aceptada** por `Job`
- **Asignación**: al aceptar una `Offer`, se crea un `Assignment`. Ahí se revela el **teléfono** del profesional al cliente
- **Reseñas**: solo se permiten tras `Job` cerrado / con `Assignment` completado
- **Búsqueda**: solo mostrar profesionales verificados / con perfil completo
- **OTP**: fuera de v0 (email + rate-limits + suspensión manual). OTP irá en v1

## Scope
**In scope:**
- `Contexts/Professional` — registro, perfil, zona, categoría, estado, teléfono
- `Contexts/Job` — publicación, filtrado por zona/categoría, estados
- `Contexts/Offer` — crear/cancelar/aceptar/rechazar, invariantes
- `Contexts/Assignment` — vincula Job+Offer+Professional+Client, gestiona revelado de contacto
- `Contexts/Review` — reseñas post-asignación
- Endpoints mínimos en `apps/marketplace/backend`

**Out of scope:**
- Pagos / escrow / facturación
- KYC / verificación documental
- Notificaciones push/SMS
- Panel admin complejo
- Mapa / geolocalización precisa

## Bounded Contexts design

### Professional
**Aggregate**: `Professional`
**Value Objects**: `ProfessionalId`, `AuthUserId`, `Phone` (E.164 simple o AR-like), `Zone`, `Category`, `ProfessionalStatus` (PENDING/ACTIVE/SUSPENDED)
**Repo**: `ProfessionalRepository`
**Use cases**: `RegisterProfessional`, `CompleteProfile`, `GetPublicProfile`

### Job
**Aggregate**: `Job`
**VOs**: `JobId`, `ClientId`, `Title`, `Description`, `Zone`, `Category`, `BudgetRange?`, `JobStatus` (OPEN/ASSIGNED/CLOSED/CANCELLED)
**Rules**: solo puede tener 1 `Assignment`
**Use cases**: `CreateJob`, `ListOpenJobsByZoneAndCategory`, `GetJobDetail`

### Offer
**Aggregate**: `Offer`
**VOs**: `OfferId`, `JobId`, `ProfessionalId`, `Message`, `PriceEstimate?`, `OfferStatus` (PENDING/ACCEPTED/REJECTED/EXPIRED/WITHDRAWN)
**Rules**: 1 oferta activa por (JobId, ProfessionalId). No crear oferta si Job ya ASSIGNED
**Use cases**: `CreateOffer`, `WithdrawOffer`, `AcceptOffer` (orquesta con Job/Assignment)

### Assignment
**Aggregate**: `Assignment`
**VOs**: `AssignmentId`, `JobId`, `OfferId`, `ProfessionalId`, `ClientId`, `AssignmentStatus` (ACTIVE/COMPLETED/CANCELLED)
**Rules**: se crea al aceptar oferta. Marca Job como ASSIGNED. Revela teléfonos
**Use cases**: `CreateAssignment` (interno/transaccional), `CompleteAssignment`

### Review
**Aggregate**: `Review`
**VOs**: `ReviewId`, `AssignmentId`, `ClientId`, `ProfessionalId`, `Rating` (1-5), `Comment`
**Rules**: 1 review por Assignment. Solo si Assignment COMPLETED
**Use cases**: `CreateReview`, `GetReviewsByProfessional`

## Tasks
- [x] **F1-1** Crear estructura de carpetas para los 5 contexts siguiendo patrón Codely
- [x] **F1-2** Implementar `Professional` (domain + infra + application + DI) — DI wired in the F1-3 batch
- [x] **F1-3** Implementar `Job` (domain + infra + application + DI)
- [x] **F1-4** Implementar `Offer` (domain + infra + application + DI)
- [x] **F1-5** Implementar `Assignment` (transaccional: aceptar oferta crea assignment y cierra job)
- [ ] **F1-6** Implementar `Review` con validación contra Assignment completado
- [ ] **F1-7** Rutas/controladores mínimos en marketplace backend + wiring
- [ ] **F1-8** Verificar build + tests unitarios

## Acceptance criteria
1. `pnpm build:tsc` exit 0
2. `pnpm test:unit` exit 0
3. Se pueden crear Professional, Job, Offer
4. Al aceptar Offer se crea Assignment y Job pasa a ASSIGNED
5. Teléfono se expone solo vía endpoint de Assignment/Contact revelado
6. No se puede crear 2ª Offer aceptada para mismo Job
7. Review solo permitido con Assignment COMPLETED

## Delivery
- Commits atómicos por contexto
- Sin romper Auth existente
- Seguir convenciones del repo (value objects, AggregateRoot, use cases)
- TypeORM entities + repos mínimos

## Progress / evidence

**State as of F1-3 (branch `chore/remove-dead-marketplace`):**

| Task | State | Detail |
| --- | --- | --- |
| F1-1 | Done | Five context folder trees created (`Professional`, `Job`, `Offer`, `Assignment`, `Review`). |
| F1-2 | Done | `Professional` domain + `Phone`/`Zone`/`Category`/`ProfessionalStatus` + `ProfessionalRepository` + `TypeOrmProfessionalRepository` + `RegisterProfessional` + DI. No unit tests yet. |
| F1-3 | Done | `JobRepository` + `JobEntity` (`jobs` table) + `TypeOrmJobRepository` + `CreateJob` + `ListOpenJobsByZoneAndCategory` + `GetJobDetail` + DI, with unit tests. |
| F1-4 | Done | `OfferRepository` + `OfferEntity` (`offers` table) + `TypeOrmOfferRepository` + `CreateOffer` + `WithdrawOffer` + DI, with unit tests. |
| F1-5 | Done, with a known atomicity gap | `Assignment` aggregate + ids + `AssignmentRepository` + `AssignmentEntity` (`assignments`, unique `job_id` and `offer_id`) + `TypeOrmAssignmentRepository` + `CreateAssignment` + `CompleteAssignment` + `AcceptOffer` orchestration + DI, with unit tests. The three saves in `AcceptOffer` are NOT in a DB transaction. |
| F1-6 | Pending | `Review` has `ReviewId` + `Rating` + `AssignmentId` only. |
| F1-7 | Pending | No lead-gen controllers/routes yet. Blocked on the `AcceptOffer` unit of work below. |
| F1-8 | Partial | Build + unit suite green after F1-5; no end-to-end check of the new endpoints (none exist). |

**Verification evidence:**
- After F1-3: `pnpm build:tsc` -> exit 0; `pnpm test:unit` -> 21 suites / 103 tests passing.
- After F1-4: `pnpm build:tsc` -> exit 0; `pnpm test:unit` -> 23 suites / 111 tests passing.
- After F1-5: `pnpm build:tsc` -> exit 0; `pnpm test:unit` -> 26 suites / 124 tests passing.
- F1-5 followed a real RED: the three new suites first failed with `TS2307 Cannot find module` in the test files, then went green.
- Marketplace DI container smoke check: the six new service ids (`Job.*`, `Professional.*`) resolve; no DataSource instantiated (that check lives outside the suite, run ad hoc).

**Decisions worth remembering:**
- `JobEntity`, `ProfessionalEntity`, `OfferEntity` and `AssignmentEntity` are glob-loaded by `TypeOrmClientFactory`, so no central entity registry is needed.
- `Job`, `Professional`, `Offer` and `Assignment` DI reuse `@Auth.infrastructure.DataSource` (the marketplace app's Postgres connection). Renaming/consolidating that DataSource is the deferred F0-3 config move; do it in one pass, not per context.
- Every lead-gen context owns its own copy of the foreign ids (`JobId`, `ClientId`, `ProfessionalId`, `OfferId`); crossing contexts happens through `.value` only.
- "One pending offer per (job, professional)" is enforced in `CreateOffer`, not by a DB constraint: a professional must be able to offer again after withdrawing, and a partial unique index on `status = 'PENDING'` is not expressible through `EntitySchema`.
- "One assignment per job" and "one assignment per offer" ARE enforced by the DB through unique indices (`idx_assignments_job_id`, `idx_assignments_offer_id`), which is what makes the double-accept race survivable.
- `AcceptOffer` (`src/Contexts/Assignment/application/Accept/AcceptOffer.ts`) persists in this order: offer, then job, then assignment. The reveal is written last, so a partial failure never exposes contact without an accepted offer.
- `Nullable<T> = T | null | undefined`, so `=== null` checks do NOT narrow. Use falsy checks (`if (!x) throw`) instead of `!` non-null assertions.

**Known gap — atomicity of `AcceptOffer` (must be closed before F1-7):**
`AcceptOffer` performs three sequential saves with no DB transaction and no row lock. Two concurrent accepts for the same job can both pass the `job.canReceiveOffer()` check; the second one then fails at the unique `job_id` index instead of returning a clean domain error, and the first writes may already be committed. Before exposing this over HTTP:
1. Introduce a unit-of-work / transaction boundary (a `TransactionManager` port implemented by TypeORM, with repositories resolving the active `EntityManager`), or
2. lock the job row (`SELECT ... FOR UPDATE`) inside the transaction.
Until then the invariant holds at rest (unique indices) but failures surface as infrastructure errors, which is not acceptable for an endpoint.

**Next step:** F1-6 `Review` — aggregate (`Review`, `ReviewId`, `Rating`, `Comment`, ids), repository port + TypeORM entity/repository, `CreateReview` (refuses unless the referenced `Assignment` is COMPLETED, one review per assignment via a unique `assignment_id` index) and `GetReviewsByProfessional`.

