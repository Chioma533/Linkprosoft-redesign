# Public Professional Profiles and Custom URLs — Implementation Plan

## 1. Executive summary

Add a public, published-only profile page addressable at `https://linkprosoft.com/:slug`, with a generated name-based slug, owner-managed customization, visibility controls, and redirects from prior slugs. Keep profile content in the existing professional profile and related resources; expose it through a purpose-built, allowlisted public API response rather than composing several public user-ID endpoints in the browser.

The checked-out repository is the Vite/React frontend, not the backend. Existing project documentation describes a separate Express/TypeScript API using PostgreSQL and a modular routes/controllers/services/repositories layout, but neither backend source nor database migrations are available here. Treat backend file paths and schema details below as a plan to verify against that repository before implementation.

Recommended order: verify backend contract and data model; add the slug registry and safe backfill; implement atomic slug lifecycle and public DTO endpoints; wire the existing mock public-profile page and dashboard; then enable the root route, redirects, SEO, and end-to-end validation.

## 2. Current architecture findings

### Frontend (verified in this checkout)

- React 19, Vite, Tailwind CSS, React Router v7, Zustand, and Axios. The route table is in `src/App.jsx`; authenticated routes use `src/routes/PrivateRoutes.jsx`.
- Requests follow the established `API_PATHS` → service (`src/api/services/`) → shared `axiosInstance` pattern. The Axios instance sends cookies with `withCredentials: true`; auth is restored from an HttpOnly cookie. Do not design new frontend auth around localStorage bearer tokens.
- `src/api/services/profileService.js` already calls:
  - `POST /api/profiles` to create a professional profile.
  - `GET /api/profiles/me` and `PUT /api/profiles/me` for the owner’s profile.
  - Public-by-user-ID paths for detailed profiles, skills, certifications, portfolio, and reviews are in `src/utils/apiPaths.js`; their visibility filtering and exact payloads must be confirmed server-side.
- `src/pages/professionals/ProfileSubpage.jsx` loads the profile, skills, certifications, portfolio, and reviews and provides profile editing. `VerificationBadge` displays a badge only when `verification_status === "verified"`.
- `src/pages/professional/PublicProfessionalProfile.jsx`, `PublicProfileOverview.jsx`, and `PublicProfileTopbar.jsx` are a disconnected, static UI prototype from the prior frontend task. They contain fixture content and placeholder interactions, not a slug lookup or production profile data contract.
- `src/App.jsx` has explicit one-segment routes including `/`, `/waitlist`, `/signup`, `/login`, `/community`, `/professionals`, `/verification`, and `/home`; there is no catch-all route. Explicit React Router routes should remain authoritative over a one-segment profile route.
- Existing frontend tests are Node built-in tests (`npm test`, `tests/*.test.mjs`); the package does not declare React Testing Library or Vitest. Playwright is present as a dependency, but no dedicated test script/config was found.

### Backend, database, and deployment (documented, not directly inspected)

- The frontend root contains no API server, database model, ORM/query implementation, or migrations. The backend audit documents describe a separate **Express/TypeScript** API with modular route/controller/service/repository layers, `protect` / role authorization, and PostgreSQL. They refer to `professional_profiles` and SQL migrations, but the live backend schema and current branch cannot be verified from this repository.
- Backend profile routes documented in `CURRENT_PROFESSIONAL_API_OVERVIEW.md` and `CURRENT_EMPLOYER_API_OVERVIEW.md` include `POST /api/profiles`, protected `GET/PUT/DELETE /api/profiles/me`, and public `GET /api/profiles/:userId[/detailed]`, plus public-by-user-ID skills, certification, and portfolio reads. The audit warns that the public detailed profile is incomplete and does not establish a safe visibility/PII policy.
- `vercel.json` sends `/api/:path*` to `https://linkprosoft-backend-hxmc.onrender.com/api/:path*` and all other paths to `/index.html`. This supports SPA deep links; confirm the production domain, Render service, and current rewrite behavior before release.
- `docs/integrations/AI-SEARCH-NLP-INTEGRATION.md` documents Express, PostgreSQL, and a backend SQL migration path. `linkprosoft-supabase-storage-render-setup.md` describes optional Supabase S3-compatible media storage for a Render backend; it is not evidence that profile media is currently served from that bucket.
- The backend audit documents are dated August 2026 snapshots and contain some frontend/backend contract discrepancies. Verify every API and schema assumption against the deployed backend before coding.

### Existing profile fields evidenced in frontend

The owner profile UI uses `fullName` / `full_name`, `profession`, `bio`, `hourlyRate`, `availabilityStatus`, `location`, `avatarUrl`, `coverImageUrl`, `createdAt`, `totalHoursWorked`, `responseTimeHours`, `avgRating`, and `totalReviews`. It separately reads skills, certifications, portfolio items, and reviews. Verification is derived from `verification_status` and `role`.

Experience entries, education, social links, and explicit public contact fields are not evidenced in the checked-in profile UI/service. Do not add them to the public DTO unless backend models and product-approved data prove they exist and are intended to be public.

## 3. Recommended architecture and key decisions

1. **Keep the root URL, with an explicit one-segment route.** Add `/:slug` after all existing specific routes in `src/App.jsx`. React Router ranks static paths ahead of dynamic segments, but reserve existing and planned route names in the slug validator and add route-conflict tests. Keep API paths under `/api`; use explicit multi-segment paths for future product routes. Unknown one-segment URLs will be treated as candidate profile slugs and should render a deliberate not-found state.
2. **Resolve profiles by slug on the server.** Add one public, unauthenticated endpoint returning an allowlisted profile DTO. Do not expose a user-ID lookup as the new public contract or fetch the profile and related collections independently in the browser. Confirm and remediate existing public ID-based endpoints separately if they bypass visibility or disclose sensitive fields.
3. **Keep the existing professional profile as the source of profile content.** Add only the publication state and slug-indexing data required for public lookup. Use current profile-service endpoints and related skills/certification/portfolio/review data rather than duplicating those records.
4. **Use a slug registry for current and historical URLs.** Because all old slugs must remain reserved and redirect directly to the latest slug, a registry is the simplest reliable place for globally unique current and former slugs. Avoid storing a second independently mutable “current slug” in both the registry and profile row. Confirm whether an equivalent table or soft-delete mechanism already exists before adding one.
5. **Keep publication separate from profile completeness.** New and backfilled profiles default to `draft` or `private`; public resolution requires both an explicit public state and the product’s completeness rules. A private, incomplete, deleted, or nonexistent profile returns the same public not-found response.
6. **Use the documented API conventions.** Paths use `/api/profiles`; frontend DTO/request fields are camelCase, and existing responses generally use `{ success, message, data }`. Authentication is cookie-based in this frontend. Reuse protected owner routes and role checks; never accept an owner ID from the client for mutations.
7. **Redirect old slugs in the SPA initially.** The current Vercel deployment serves a static SPA shell, so an API `301` response does not itself change the visitor’s address bar. Return the canonical slug for aliases and use React Router `replace` for client-side canonicalization. If crawler-visible HTTP 301s are a release requirement, provide SSR or an edge/server redirect capable of resolving slug aliases; do not claim client navigation is a permanent HTTP redirect.
8. **SEO is limited by the current SPA architecture.** Set title, description, canonical URL, and social metadata after loading the public DTO. For reliable link-preview/social-crawler metadata, add prerendering or server-side rendering in a separately scoped deployment change.

## 4. Database changes and migration strategy

First inspect the backend’s actual profile table, user/profile relationship, migration runner, soft-delete behavior, and existing slug/alias columns. If there is already a globally unique slug/alias registry, extend it rather than creating a parallel structure.

If no equivalent exists, recommended minimal schema:

- Add a `profile_visibility` state to the existing professional profile (or reuse an equivalent verified field): `draft`, `private`, or `public`; default to `draft` for new profiles. Enforce that `public` is only possible when server-side readiness rules pass.
- Add `professional_profile_slugs` (name subject to backend conventions) with:
  - `slug` as the globally unique, normalized key.
  - `professional_profile_id` as a foreign key to the existing professional profile.
  - `status` (`current`, `redirect`, and optionally `reserved` for removed profiles).
  - `created_at` and optional `retired_at`.
  - A unique constraint/index on `slug` across *all* statuses, so historical names cannot be reclaimed.
  - A partial unique index allowing at most one `current` slug per profile, plus an index on profile ID/status for owner lookup.
- Keep historical aliases associated with the profile rather than storing slug-to-slug chains. Alias resolution loads the profile’s current slug, so every old URL points directly to the current canonical URL.
- On deletion, do not cascade-delete reserved slug values. Define a privacy/retention policy: detach or tombstone the slug after profile deletion and return not found, without retaining public profile data or permitting slug reuse.

### Slug rules and safe backfill

- Normalize the display name to Unicode NFKD, remove combining marks, lowercase, replace runs of unsupported characters/whitespace with `-`, collapse repeated hyphens, and trim hyphens. Persist only a canonical ASCII slug (recommend 3–50 characters; confirm UX limits).
- If normalization is empty or too short, use a deterministic safe fallback such as `professional-<short stable id>`; never create an empty slug.
- Reserve route names (at least existing first segments such as `waitlist`, `signup`, `login`, `community`, `professionals`, `verification`, `home`, `browse-professionals`, `notifications`, `payment-screen`, `admin`, `employer`, `professional`, `auth`, and `api`) and any future top-level application paths. Maintain the list centrally in backend validation and test it against `App.jsx`.
- Assign the base name, then `-2`, `-3`, etc. within a transaction. The database unique constraint is authoritative: on a unique-key conflict, retry the next suffix. A preflight lookup alone is not race-safe.
- Backfill existing professional profiles in deterministic order (e.g. creation timestamp then stable profile ID), using the same generator and collision strategy. Keep profiles `draft`/`private` after backfill; do not silently publish profiles or make incomplete content discoverable.
- Allocate a default slug when a professional profile is first created or initialized from the account’s display name. Later name changes must not silently overwrite a chosen slug; only explicit owner action changes the URL.

## 5. API specification

The routes below are proposed to fit the existing `/api/profiles` naming and response conventions. Confirm backend middleware, DTO/error formats, and whether the existing profile update endpoint can accept the new fields.

| Method and route | Auth / authorization | Request | Response and errors |
|---|---|---|---|
| `GET /api/profiles/public/:slug` | Public; no cookie required | Path slug, normalized/validated before lookup | `200 { success:true, data:{ profile:{ slug, canonicalUrl, fullName, avatarUrl, coverImageUrl, profession, bio, location, createdAt, hourlyRate?, availabilityStatus?, skills, certifications, portfolioItems, reviews?, verificationStatus } } }`. Include only approved public fields. `404` for missing, private, draft, incomplete, or deleted profiles. If alias: return current `canonicalUrl`/`canonicalSlug` so client can `replace` to it. `400` malformed slug; `429` rate limit. |
| `GET /api/profiles/slug-availability?slug=...` | Authenticated professional; self only (derive owner from session) | Query `slug`; no caller-supplied user/profile ID | `200 { success:true, data:{ normalizedSlug, available } }`. Exclude the caller’s current slug from conflicts. `400` invalid/reserved; `401/403`; `429`. Availability is advisory; the update must still handle a uniqueness conflict. |
| `PUT /api/profiles/me` (existing) | Authenticated professional; owner derived from session | Existing profile fields plus optional `{ slug, visibility }`. Visibility only `draft`, `private`, or `public`; do not accept user/profile ownership fields. | Existing success envelope extended with `{ slug, publicUrl, visibility }`. Slug change and history update are atomic. `400` invalid/reserved; `401/403`; `409` current or historical slug unavailable; `422` profile incomplete for publication; `429` slug-change policy. Preserve existing profile validation/errors. |
| `GET /api/profiles/me` (existing) | Authenticated professional; owner only | None | Extend existing profile response with `{ slug, publicUrl, visibility, isComplete }` (or equivalent established DTO fields). Dashboard share/copy/preview uses this rather than duplicating a URL endpoint. `401/403`; existing not-found/error semantics. |

`POST /api/profiles` continues to create the profile and atomically assigns an initial slug; response includes its slug and visibility. Do not add an extra “generate slug” endpoint. A profile that is not ready remains unpublished. Map a database unique violation to stable HTTP `409`/`SLUG_UNAVAILABLE`, not `500`.

Public DTO rules:

- Build a strict allowlist at the server boundary; never serialize a database row or full `user` object. Exclude email, phone, auth/session identifiers, date of birth, addresses, payment/bank/KYC documents, internal IDs, moderation notes, and private media.
- Show contact/social data only if it exists in the verified model and the professional explicitly opted into publishing it.
- Return stable not-found semantics for private/draft profiles to avoid confirming their existence. Do not include an unpublished/private profile in search, sitemap, or public caches.
- If reviews are included, use existing review visibility/moderation rules and avoid exposing reviewer PII.

## 6. Frontend routing and UI requirements

- Convert `PublicProfessionalProfile.jsx` from fixture rendering to a slug-driven page: read `slug` with React Router, load through `profileService`, and show loading, not-found/private, unavailable, and retryable server-error states distinctly. Do not render sample data on API failure.
- `PublicProfileOverview.jsx` should receive the public DTO; omit unavailable/empty sections and render only confirmed fields. The current hardcoded stats, certifications, projects, review, identity, and header account controls are prototype content and must not be presented as real profile data.
- Add `/:slug` after fixed routes in `src/App.jsx`. Preserve all current routes; test that reserved/fixed routes are never interpreted as profile slugs. Keep the existing `/api` Vercel rewrite ahead of the SPA fallback.
- In authenticated `ProfileSubpage.jsx`, add a public URL card with the canonical URL, copy action, open-in-new-tab action (`noopener,noreferrer`), preview link, slug editor with availability feedback, and visibility control. Hide/disable publishing until server readiness checks pass.
- Use local page/form state; add methods to `profileService.js` and route constants to `src/utils/apiPaths.js`. Components must not call Axios directly.
- Slug input UX: show a normalized preview, debounced availability state, clear validation/409 messages, save/cancel states, and a warning that old links redirect and the prior URL remains reserved. The server remains the source of truth.
- Set page title, description, canonical URL, and available Open Graph/Twitter metadata from the DTO; clear/reset metadata on navigation and errors. Add SSR/prerender only if crawler metadata is required.
- Profile visibility is independent of authentication: anyone, including an employer or signed-out visitor, can request a public published profile; owner controls remain behind professional authorization.

## 7. Security, privacy, and performance

- **Ownership:** derive the profile owner from the cookie session. Restrict slug/visibility mutations to the professional role and own profile; reject mass-assignment of profile/user IDs.
- **Enumeration:** slug availability is authenticated, rate limited, and does not disclose who owns a reserved slug. Public profile lookup is intentionally enumerable by slug; return only published allowlisted data and consider request throttling.
- **Uniqueness/races:** enforce uniqueness in PostgreSQL for current and historical slugs; update current slug plus alias and profile state in one transaction. Retry only unique conflicts; return deterministic `409` after bounded retries.
- **Validation:** canonicalize server-side, cap length, enforce a strict `[a-z0-9-]` format after normalization, reject reserved paths, and reject URL fragments, encoded separators, dots, and path traversal forms. Encode URL segments in the client. Never trust a client-side availability result.
- **Abuse:** apply a configurable slug-change rate policy (proposed initial policy: one successful custom slug change per 30 days, subject to product approval), audit changes, and use rate limiting for checks/updates. Avoid allowing rapid slugsquat churn.
- **Sensitive data:** review each existing public-by-user-ID endpoint, including detailed profile, certifications, portfolio, skills, and reviews. The new slug route must enforce visibility and return an explicit DTO; do not assume an endpoint marked “public” is safe.
- **Visibility:** default all migrated/new records to unpublished/private. On visibility-off, invalidate caches and sitemap entries promptly; public reads should return the generic not-found state.
- **Caching:** public DTOs can use a short shared-cache TTL only after confirming visibility checks and response data are safe. Prefer cache key by canonical slug; purge/invalidate current and all alias keys after profile edits, slug changes, visibility changes, moderation, or deletion. Never cache authenticated owner responses in shared public caches.
- **Redirect safety:** resolve aliases by stored profile identity, not a user-provided destination URL. Return only same-origin canonical profile paths; do not implement arbitrary redirect targets. Alias lookups should terminate in one resolution.
- **SEO:** expose canonical URL and `noindex` for private/draft/errors; add published public profiles to sitemap only if an existing sitemap mechanism is confirmed. Client-set metadata alone is not crawler-complete in the current Vite SPA.
- **Operations:** monitor slug conflicts/retries, changes, 404/visibility outcomes, and public endpoint latency without logging PII or sensitive profile payloads.

## 8. Ordered implementation phases

| Phase | Objective and changes | Dependencies | Tests / completion criteria |
|---|---|---|---|
| 0. Contract verification | In the backend repository, inspect actual Express mounts, profile/user models, profile create/update, auth/role/validation/error middleware, SQL migration runner, soft deletion, public endpoints, and deployment origin. Confirm profile-ready rules, privacy fields, and slug-change policy. | None | Record verified backend paths, response envelope, migration mechanism, and fields before schema/API work. Resolve discrepancies with the August 2026 audit docs. |
| 1. Schema and migration | Add `visibility` to the existing professional profile if needed; add the current/alias slug registry if no equivalent exists; constraints/indexes; deterministic backfill; keep all backfilled profiles unpublished. | Phase 0 | Migration applies and rolls back per backend standards; repeatable/staged backfill; duplicate names and removed profiles preserve unique slug ownership; no profile is unintentionally public. |
| 2. Slug domain logic | Add normalization, validation, reserved-name handling, deterministic fallback, atomic suffix allocation, alias updates, rate policy, and unique-conflict error mapping in backend service/repository. | Phase 1 | Unit tests cover normalization, Unicode, length, reserved names, empty names, duplicate suffixes, race conflicts, alias permanence, and name changes not resetting custom URLs. |
| 3. Public and owner API | Add public-by-slug DTO lookup; extend owner `GET/PUT /api/profiles/me` and `POST /api/profiles` for URL/visibility fields; add authenticated availability endpoint; apply validation/auth and publication guards. | Phases 0–2 | Integration tests prove safe allowlist, no auth needed for public profile, private/draft not-found behavior, ownership, database uniqueness, conflicts, and alias canonical target. |
| 4. Frontend service and public page | Add `API_PATHS` and `profileService` methods; replace fixture data in public profile page/components with API DTO rendering and loading/error/not-found states; add metadata handling. | Phase 3 API contract stable | Component/browser tests for public rendering, empty fields, error states, no fake fallback, and mobile/desktop layout. |
| 5. Dashboard URL controls | Add URL/visibility card and slug editor to `ProfileSubpage.jsx`; wire copy, preview, open-new-tab, availability, save errors, and visibility. | Phases 3–4 | Tests prove clipboard feedback, URL update/refresh, stale availability conflict handling, private/unpublished preview behavior, and owner-only controls. |
| 6. Root URL and redirects | Add `/:slug` after explicit routes in `App.jsx`; load by slug; use router `replace` for old-slug canonicalization; preserve Vercel SPA fallback and `/api` proxy. Decide whether crawler-grade SSR/edge redirects are required. | Phases 3–4 | Route regression tests for all existing fixed routes; direct deep-link reload works; alias redirects to current slug without chains; unknown/private profile has deliberate not-found. |
| 7. Release hardening | Review legacy public-ID endpoints, caching, metadata/sitemap, rate limits, telemetry, migration rollout/rollback, and deployment configuration. | Phases 1–6 | Security/privacy sign-off, full backend/frontend tests, production build, smoke tests on Render/Vercel staging, and no accidental public profiles after rollout. |

### File-by-file change breakdown

**Frontend files verified in this repository**

| File | Planned change |
|---|---|
| `src/utils/apiPaths.js` | Add public-by-slug and slug-availability path constants; reuse existing profile `me` paths for owner URL/visibility. |
| `src/api/services/profileService.js` | Add public profile retrieval, availability, and owner update helpers following Axios/service conventions and preserving meaningful API errors. |
| `src/pages/professional/PublicProfessionalProfile.jsx` | Replace static fixture view with route-param data loading, loading/error/not-found states, canonical metadata, and alias replace navigation. |
| `src/components/professional/PublicProfileOverview.jsx` | Accept public DTO props; render only available verified profile fields; remove mock stats, certifications, portfolio, and review content. |
| `src/components/professional/PublicProfileTopbar.jsx` | Make the header appropriate for signed-out visitors and remove hardcoded account identity/actions unless an authenticated context supplies them. |
| `src/pages/professionals/ProfileSubpage.jsx` | Add URL display/copy/open/preview, slug edit/availability, and visibility controls using existing profile data. |
| `src/App.jsx` | Add the `/:slug` route after explicit routes; retain all current routes and protected-route behavior. |
| `vercel.json` | No change expected: current catch-all already serves the SPA. Modify only if deployment verification shows deep-link or rewrite order problems. |
| `tests/` | Add service/route/interaction tests using the repository’s existing Node test setup or Playwright. Add frontend test tooling only if browser-level requirements cannot be met with current dependencies. |

**Backend files are in the separate API repository and must be verified before implementation.** The frontend’s backend audit docs name these likely paths; treat them as candidates, not checked-out files:

| Candidate backend path | Planned change |
|---|---|
| `src/app.ts` and `src/modules/profile/profileRoutes.ts` | Mount public slug lookup and authenticated availability using existing route conventions and middleware. |
| `src/modules/profile/profileController.ts` | Validate input, map domain outcomes to existing HTTP/envelope conventions, return only public DTOs. |
| `src/modules/profile/profileService.ts` | Coordinate profile publication, slug lifecycle, canonical alias resolution, and mutation policy. |
| `src/modules/profile/profileRepository.ts` (or actual repository/query module) | Transactional current/alias lookup, slug allocation, uniqueness conflict handling, and safe public data retrieval. |
| Existing profile validation schema and auth/role middleware | Add strict slug/visibility schemas; require authenticated professional ownership on mutations. Exact filenames to confirm. |
| `src/migrations/<next-number>_public_profile_slugs.sql` (or actual migration directory) | Add visibility/slug registry/indexes and deterministic private-by-default backfill. The backend migration number and rollback conventions must be checked. |
| Backend profile/route/service/repository test directories | Add unit and database integration tests alongside the backend’s existing harness. Exact test paths to confirm. |

## 9. Testing strategy

### Unit tests

- Normalization: mixed case, whitespace, punctuation, repeated/edge hyphens, diacritics and supported Unicode, emoji-only/empty names, non-Latin names, max length, truncation that does not leave a trailing hyphen.
- Reserved route names and case/encoding variants; reject slash, backslash, dot segments, percent-encoded separators, and invalid formats.
- Suffix behavior: base → `-2` → `-3`; suffix length cap; deterministic fallback; custom slug is stable after display-name changes.
- Concurrent generation/update: simulate a unique-key conflict between availability and write; retry and return conflict only after bounded attempts.
- Alias behavior: preserve old slug, block reuse, resolve any historical alias directly to the latest slug, never create redirect loops.

### Backend integration tests

- Anonymous public read for a published profile; no cookie is required.
- Draft/private/incomplete/deleted/non-professional profile returns the same generic 404 and no protected information.
- DTO allowlist excludes email, phone, account IDs, address, birth date, payment/KYC data, moderation data, and unapproved media.
- Skills/certifications/portfolio/reviews obey publication, moderation, and privacy rules.
- Profile creation assigns a slug atomically; profile name updates do not silently change a selected slug.
- Availability rejects reserved/current/historical names appropriately and cannot inspect/change another owner’s slug.
- Slug update plus old-slug reservation is atomic under concurrent requests; database uniqueness is exercised against PostgreSQL.
- Visibility changes immediately affect profile lookup, search/sitemap exposure, and cache invalidation.
- Rate limit and slug-change policy; stable `400`, `401`, `403`, `404`, `409`, `422`, and `429` error contracts.

### Frontend and regression tests

- Render a public DTO, conditional sections, verification state, and accessible loading/not-found/private/unavailable/error states.
- API failures never fall back to fixture profile content.
- Dashboard URL displays the server-canonical URL; copy action reports success/failure; open/preview uses safe new-tab attributes.
- Slug editor covers normalized preview, availability loading/unavailable/error, save success, `409` after stale availability, and visibility control.
- Existing routes (`/`, `/signup`, `/login`, `/community`, `/professionals`, `/notifications`, `/professional/dashboard`, etc.) remain unchanged and fixed paths do not call the slug endpoint.
- Direct load/reload of a root slug works through Vercel’s SPA rewrite; historical slug navigates to current slug with `replace`.
- Mobile/tablet/desktop browser checks for profile layout and metadata; confirm private/draft routes are `noindex`.
- Run frontend `npm test`, targeted lint, and `npm run build`; run backend migration, unit, integration, and API smoke tests in the backend repository.

## 10. Risks, dependencies, and edge cases

- **Backend unavailable in this checkout:** exact DB schema, migrations, route middleware, response envelope, and deployed behavior cannot be validated here. Phase 0 is a hard prerequisite, not optional discovery.
- **Potentially unsafe existing public endpoints:** the audit marks user-ID profile and related-resource routes public, but does not prove visibility enforcement or safe serialization. Review before relying on or leaving them exposed.
- **Root route conflicts:** any future single-segment path may collide with a user slug. Keep an authoritative reserved list and add route-level regression tests whenever top-level routes change.
- **Backfill and public exposure:** duplicate names are expected. Backfill deterministically, reserve aliases, keep all imported profiles private/draft, and have a deliberate publication rollout.
- **Incomplete or absent profiles:** signup includes a professional account role/type, while the profile is created separately. A registered account may not have a professional profile or a usable display name yet; assign a fallback slug only when a profile is initialized and keep it unpublished until complete.
- **Unicode and names:** transliteration does not exist for every writing system. Define product behavior for names that normalize to no ASCII characters and test it; do not silently produce a misleading slug.
- **Slug squatting and churn:** availability checks leak reservation information and are race-prone by design; authentication, throttling, change cooldown, unique DB constraints, and permanent history mitigate these risks.
- **Privacy/deletion:** permanent reservation of old slugs conflicts with deletion/erasure expectations. Retain a non-identifying tombstone only under an approved retention policy.
- **SEO and HTTP redirects:** Vite SPA metadata and React Router redirects are client-side. If search/social crawlers or external clients require server-generated metadata/301s, SSR/prerender/edge work is an additional architecture dependency.
- **Data quality and trust:** current public-profile prototype contains sample values not returned by the existing UI’s profile service. Replace every fixture with server data and render absent metrics as absent, not optimistic defaults.
- **Cache staleness:** visibility-off, moderation, profile deletion, slug change, and alias resolution require prompt invalidation across current and former keys.

## 11. Acceptance criteria

- A professional profile is assigned a normalized, unique slug during profile initialization; collisions receive deterministic suffixes under concurrent creation.
- A professional can view, copy, preview, and customize their current public URL; only their authenticated professional account can change it.
- Invalid, reserved, current, and historical slugs are rejected with predictable user-facing errors; database constraints prevent races and slug reuse.
- A profile is publicly resolvable without authentication only when explicitly published, complete, and visible.
- Public DTOs include only approved data already supported by verified models and omit sensitive/account fields.
- Root-level profile links and alias links work on direct load/reload without breaking any existing fixed route.
- Old URLs remain reserved and resolve directly to the current profile URL; redirects do not chain or accept external destinations.
- New and backfilled profiles are not made public by default; private/draft/incomplete/deleted states return a safe not-found response.
- Owner dashboard controls, API validation, route tests, migration/backfill, privacy tests, metadata, caching, and production deployment behavior meet the test strategy above.
- The feature passes the frontend and backend test/build/lint suites and is smoke-tested against Vercel and the deployed API in staging.
