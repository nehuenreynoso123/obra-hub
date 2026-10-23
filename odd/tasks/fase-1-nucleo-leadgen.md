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
- [ ] **F1-1** Crear estructura de carpetas para los 5 contexts siguiendo patrón Codely
- [ ] **F1-2** Implementar `Professional` (domain + infra + application + DI)
- [ ] **F1-3** Implementar `Job` (domain + infra + application + DI)
- [ ] **F1-4** Implementar `Offer` (domain + infra + application + DI)
- [ ] **F1-5** Implementar `Assignment` (transaccional: aceptar oferta crea assignment y cierra job)
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
