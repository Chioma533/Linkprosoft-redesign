# LINKPROSOFT Audit Remediation Implementation Plan

**Source audit:** `LINKPROSOFT_PRE_LAUNCH_AUDIT.md` (28 November 2026)  
**Scope:** Frontend repository `C:\Users\HP\Linkprosoft-redesign` and backend repository `C:\Users\HP\umarks\Linprosoft-Backend`  
**Purpose:** A complete, traceable plan for every numbered finding and each supplemental dead-code/debt item in the audit. This document proposes work only; it does not authorize production migrations, key rotation, dependency upgrades, or deployment.

## Executive summary

The audit contains 25 numbered findings: 6 P0, 13 P1, and 6 P2. The safest delivery order is:

1. Establish a safe test/staging and configuration baseline.
2. Close financial and credential-exposure vulnerabilities.
3. Repair privacy/authorization boundaries and high-risk admin flows.
4. Make payment, webhook, assignment, migration, rate-limit, and deployment behavior deterministic.
5. Complete hardening, performance, and technical-debt work.

Several fixes intentionally share infrastructure:

| Shared workstream | Traceable findings resolved | Rationale |
|---|---|---|
| Safe test and deployment baseline | LP-DB-002, LP-BE-004, LP-OPS-003, LP-OPS-001 | No financial/auth change should be validated against an unknown database or unverified host configuration. |
| Cookie/session boundary | LP-SEC-002, LP-SEC-005, LP-SEC-006, LP-BE-006 | Token transport, CSRF, active-account checks, and impersonation must use one explicit session model. |
| Financial state machine | LP-SEC-001, LP-BE-002, LP-BE-003, LP-SEC-007 | Wallet balance, Paystack events, idempotency, refunds, disputes and release must never be independently mutable. |
| Privacy/relationship authorization | LP-SEC-003, LP-DB-003 | Reuse explicit relationship checks and minimum-response DTOs for chat/media/KYC data. |
| Operations controls | LP-SEC-004, LP-BE-005, LP-OPS-001, LP-OPS-002 | Proxy trust, distributed limits, WebSocket abuse control, lifecycle management, and dependency updates must be tested together. |
| Admin truthfulness | LP-FE-001, LP-FE-002, LP-BE-001 | Never show simulated data/actions or success for an operation that has not occurred. |

**Launch gate:** All P0 acceptance criteria, the dependent P1 financial/authorization checks, a clean migration rehearsal, and a staging end-to-end smoke run must pass before a public launch decision.

## Finding inventory

| ID | Severity / priority | Workstream | Planned disposition |
|---|---|---|---|
| LP-SEC-001 | CRITICAL / P0 | Financial state machine | Remove direct wallet mutation; replace with ledger-controlled credit. |
| LP-SEC-002 | HIGH / P0 | Cookie/session boundary | Remove tokens from browser JSON responses and rotate affected sessions. |
| LP-SEC-003 | HIGH / P0 | Privacy/relationship authorization | Remove email exposure and enforce relationship access. |
| LP-SEC-004 | HIGH / P1 | Operations controls | Trusted proxy plus Redis-backed, consistent limiters. |
| LP-SEC-005 | MEDIUM / P1 | Cookie/session boundary | Origin validation/CSRF protections for unsafe requests. |
| LP-SEC-006 | MEDIUM / P1 | Cookie/session boundary | Active-account and server-side session/version enforcement. |
| LP-SEC-007 | MEDIUM / P1 | Financial state machine | Durable webhook processing and correct retry responses. |
| LP-FE-001 | HIGH / P1 | Admin truthfulness | Replace KYC placeholders/simulated actions with real evidence states. |
| LP-FE-002 | HIGH / P1 | Admin truthfulness | Remove mock disputes; implement server pagination/filtering. |
| LP-FE-003 | MEDIUM / P1 | Performance | Route/dependency splitting and image budget. |
| LP-FE-004 | MEDIUM / P2 | Frontend quality | Fix stale hooks and race-prone async effects. |
| LP-FE-005 | LOW / P2 | Frontend quality | Replace imperative `innerHTML` fallback. |
| LP-FE-006 | LOW / P2 | Frontend quality | Remove/redact browser console diagnostics. |
| LP-BE-001 | HIGH / P1 | Admin truthfulness | Implement assignment endpoints or return 501 and remove UI access. |
| LP-BE-002 | HIGH / P1 | Financial state machine | Idempotent, locked payment initiation. |
| LP-BE-003 | HIGH / P1 | Financial state machine | Atomic dispute/payment transitions and outbox. |
| LP-BE-004 | HIGH / P0 | Safe baseline | Redis OAuth state and canonical host configuration. |
| LP-BE-005 | MEDIUM / P1 | Operations controls | Verified Socket.IO endpoint and event limiting. |
| LP-BE-006 | MEDIUM / P2 | Cookie/session boundary | Scoped, revocable admin impersonation. |
| LP-DB-001 | HIGH / P1 | Database delivery | Ordered migration ledger and reproducible runner. |
| LP-DB-002 | HIGH / P0 | Safe baseline | Dedicated, fail-closed test database. |
| LP-DB-003 | MEDIUM / P2 | Privacy/storage | Malware scanning, object cleanup, policy verification. |
| LP-OPS-001 | MEDIUM / P1 | Operations controls | Graceful shutdown and readiness lifecycle. |
| LP-OPS-002 | HIGH / P0 | Operations controls | Patch runtime dependency advisories and prove the lockfile. |
| LP-OPS-003 | HIGH / P0 | Safe baseline | Versioned non-secret production contract and preflight. |

## Implementation order and dependencies

### Phase 0 — Freeze unsafe actions and establish a safe baseline

1. Disable direct wallet mutation and prevent its frontend use (LP-SEC-001).
2. Make tests fail closed unless using a dedicated test database (LP-DB-002).
3. Create the non-secret production configuration contract and resolve canonical public hosts (LP-BE-004, LP-OPS-003).
4. Update runtime dependencies in an isolated branch and verify build/test/audit results (LP-OPS-002).

**Why first:** These items either permit financial compromise, disclose credentials, or make safe validation/deployment impossible.

### Phase 1 — Establish secure session and privacy boundaries

1. Stop token JSON exposure (LP-SEC-002).
2. Remove chat email exposure and add relationship authorization (LP-SEC-003).
3. Add account/session version enforcement (LP-SEC-006).
4. Add unsafe-method origin checks and CSRF token flow if cross-site cookies remain required (LP-SEC-005).

**Dependency:** Final cookie settings depend on the canonical frontend/API origin decision in Phase 0.

### Phase 2 — Financial correctness and truthful workflows

1. Introduce payment/ledger state constraints and idempotency (LP-BE-002).
2. Make payment/dispute transitions atomic, then add durable webhook/event processing (LP-BE-003, LP-SEC-007).
3. Replace assignment placeholders and admin mock data/evidence with explicit real-data states (LP-BE-001, LP-FE-001, LP-FE-002).

**Dependency:** Database migration framework/manifest from LP-DB-001 must be prepared before financial schema changes are deployed.

### Phase 3 — Reliability, abuse resistance, and launch verification

1. Implement trusted proxy configuration and distributed rate limits (LP-SEC-004).
2. Verify Socket.IO production routing and add event limits (LP-BE-005).
3. Add graceful shutdown/readiness (LP-OPS-001).
4. Rehearse migrations, run isolated integration tests, and perform staging E2E tests.

### Phase 4 — Post-launch hardening and quality

LP-FE-003 through LP-FE-006, LP-BE-006, LP-DB-003, and supplemental cleanup/debt items.

## Detailed finding plans

### LP-SEC-001 — CRITICAL / P0 — Arbitrary employer wallet credit/debit

**Root cause and components:** `walletRoutes.ts` exposes both `POST /` and `PUT /` to every employer; `walletController.ts` forwards arbitrary amounts/balances; `walletService.ts` mutates balances directly. There is no immutable accounting or verified source of funds.

**Files/functions to modify:**

- Backend: `src/modules/wallet/walletRoutes.ts`, `walletController.ts`, `walletService.ts`, `walletRepository.ts`, `walletValidation.ts`.
- Backend: payment/webhook integration in `src/modules/payments/paymentsService.ts`, `paymentsRepository.ts`, `paymentsController.ts`.
- Frontend: `src/utils/apiPaths.js`, `src/api/services/walletService.js`, and every caller found by `rg "INCREASE_BALANCE|UPDATE_BALANCE|walletService" src`.
- Database: new uniquely named migration following the new migration policy from LP-DB-001.

**Implementation:**

1. Immediately remove the public `POST /api/wallet` and `PUT /api/wallet` routes. If an old client may still call them, return `410 Gone`/a stable deprecation error without mutation for one release; do not silently retain the mutation.
2. Keep `GET /api/wallet` as a read model only. It must not become the source of truth for settlement.
3. Introduce `wallet_ledger_entries` with immutable rows: entry ID, account/user ID, amount in minor units, currency, direction, purpose, payment/provider reference, idempotency key, actor/admin ID where relevant, created timestamp, and reversal linkage. Add database uniqueness on provider event/reference + entry purpose.
4. Create a domain-level `recordVerifiedPaymentCredit(...)` callable only from verified payment processing. Calculate displayed wallet balance from a protected aggregate/materialized read model; never accept a balance from a browser.
5. If finance requires manual adjustment, create a separate admin-only endpoint requiring a reason, dual audit record, idempotency key, and explicit adjustment type. It must not reuse the employer wallet route.
6. Reconcile existing wallet balances before enabling any debit/credit behavior. The reconciliation source and treatment of unexplained balance must be signed off by finance/product.

**Security/performance:** Use integer minor units or `NUMERIC`, never JavaScript float. Ensure a ledger insert and balance projection update use one DB transaction. Enforce idempotency with database constraints, not only application checks.

**Prerequisites/decisions:** Product/finance must define whether the current wallet is real money, prepaid credit, or display-only, and provide authoritative opening balances. LP-BE-002/003 must use the same payment state model.

**Regression/edge cases:** Duplicate webhook, webhook retry, refund after credit, negative adjustment, concurrent payment events, currency mismatch, refund before projection, disabled user, and old frontend calls.

**Tests:** Unit tests for sign/direction and currency; integration tests proving employers receive 403/410 for direct mutation; concurrent duplicate provider events yield one ledger entry; reversal references original entry; API returns a correct read model.

**Acceptance criteria:** No authenticated non-finance caller can mutate wallet value. A verified provider event is recorded once only. Ledger audit trail reconciles displayed balance. All direct mutation endpoints are absent or non-mutating.

### LP-SEC-002 — HIGH / P0 — Access and refresh tokens exposed in JSON

**Root cause and components:** `authController.ts` sets cookies but includes both tokens in responses from email verification and login. Related flows need a complete token-response inventory.

**Files/functions to modify:**

- `src/modules/auth/authController.ts`: `verifyEmail`, `login`, `refreshToken`, Google callback response/redirect behavior, `logout` cookie clear options.
- `src/modules/auth/authService.ts` and auth response DTO/types if they expose tokens.
- Frontend: `src/api/services/authService.js`, `src/store/authStore.js`, `src/utils/cookieSession.js`, auth tests.
- Tests: backend auth integration/unit tests and frontend auth service tests.

**Implementation:**

1. Define a browser auth response DTO containing user/session metadata only; no access token or refresh token fields.
2. Centralize secure cookie options in one helper: `httpOnly: true`, `secure: production`, explicit `sameSite`, `path`, lifetime, and consistent clear options.
3. Update login, verify-email, refresh, password-reset completion, and Google callback to use the helper. Retain token values only within the server while setting cookies.
4. Confirm frontend obtains identity exclusively through cookie-backed `/api/auth/me`; remove code/test assumptions that parse tokens from body.
5. On release, revoke all refresh-token records and rotate JWT/refresh signing secrets using a planned, coordinated maintenance window. Force re-authentication.

**Security/performance:** Do not log cookies/tokens. Preserve the generic auth error behavior that prevents enumeration. Cookie settings must be decided together with LP-BE-004 and LP-SEC-005.

**Prerequisites/decisions:** Confirm canonical production origin and whether API is same-site or cross-site.

**Regression/edge cases:** OAuth redirect; old mobile/API consumers; expired access cookie plus valid refresh cookie; cookie clearing path/domain mismatch; third-party-cookie browser restrictions.

**Tests:** Assert JSON bodies from every browser auth endpoint contain no `accessToken`, `refreshToken`, or raw bearer token. Assert HttpOnly/Secure/SameSite attributes in production-mode tests. E2E verify login, refresh, logout, OTP and Google session restoration.

**Acceptance criteria:** Tokens cannot be read through browser JSON responses or client storage. The full auth journey remains functional using cookies only, including page refresh and expired-access-token recovery.

### LP-SEC-003 — HIGH / P0 — Arbitrary user email disclosure through chat

**Root cause and components:** `chatRoutes.ts` permits any authenticated caller; `chatService.getUser` returns email without relationship authorization. Public profile DTOs expose IDs, enabling lookup.

**Files/functions to modify:**

- `src/modules/chat/chatRoutes.ts`, `chatController.ts`, `chatService.ts`, `chatRepository.ts`, `chatValidation.ts`.
- Frontend callers in `src/api/services/messagingService.js`, `src/hooks/useMessaging.js`, and chat UI components.
- Tests under `src/modules/chat/__tests__` or backend integration tests.

**Implementation:**

1. Replace the current lookup DTO with a minimum public `ChatUserSummary` (`id`, display name, role, avatar/verification fields only if public). Remove email unconditionally from browser-facing chat DTOs, contacts, and search results unless a documented business requirement is approved.
2. For a detail lookup, require either thread participation, an approved business relationship, or an appropriate admin role. Add repository method `canViewChatUser(requesterId, targetId)` using a single indexed `EXISTS` query.
3. Apply the same rule to directory search. If discovery is intended, return public profile data rather than internal user fields.
4. Audit other chat/media/notification DTOs for email fields before release.

**Security/performance:** Authorization must happen before reading/serializing sensitive fields. Use minimal selected columns rather than `SELECT *`; cache only non-sensitive public summaries.

**Prerequisites/decisions:** Product must decide whether email is ever visible to counterparties. Default: no.

**Regression/edge cases:** Existing conversations, declined threads, self lookup, admin moderation, deleted/suspended profiles, profile without avatar.

**Tests:** Two unrelated authenticated users; one must receive 403/404 or a summary without email. Thread participants must see expected summary. Assert all chat list/search/detail responses lack `email` for ordinary users.

**Acceptance criteria:** No ordinary authenticated route exposes another user's email without an explicit, approved requirement and authorization test.

### LP-SEC-004 — HIGH / P1 — Bypassable/inconsistent rate limiting

**Root cause and components:** One limiter manually trusts `X-Forwarded-For`; auth limiter uses `req.ip`; app does not explicitly set trusted proxy topology; non-search limits are in-memory.

**Files/functions to modify:**

- `src/app.ts`, `src/middleware/rateLimitMiddleware.ts`, `src/middleware/rateLimiter.ts`, `src/middleware/redisRateLimitStore.ts`, `src/config/environment.ts`, `src/config/redis.ts`.
- Deployment environment documentation from LP-OPS-003.

**Implementation:**

1. Add a configuration value describing the exact trusted proxy count/network for each deployment. Apply `app.set("trust proxy", configuredValue)` before rate limiters.
2. Delete manual header parsing; use `req.ip` after Express has applied its trusted-proxy policy.
3. Standardize on a Redis-backed limiter for global, auth, heavy upload, search, and Socket.IO event limits. Define failure policy explicitly: for auth/payment endpoints, choose fail-closed or a small local emergency limit; log Redis degradation.
4. Generate keys using normalized IP plus, where appropriate, account/email identifiers without exposing them in response headers/logs.
5. Add separate limits for login, OTP verification/resend, password reset, upload intent/complete, payment initiate/verify, community write, and websocket messages/typing.

**Security/performance:** Avoid unbounded Redis keys; set TTLs. Do not trust an arbitrary forwarding header. Rate-limit error responses must be generic and consistent.

**Prerequisites/decisions:** Confirm Render/Vercel/load-balancer proxy chain. This cannot be safely finalized without infrastructure owner confirmation.

**Regression/edge cases:** Multiple users behind NAT, IPv4-mapped IPv6, health checks, CDN retries, OAuth callback, localhost development, Redis outage, horizontal scaling.

**Tests:** Header spoofing test; trusted/untrusted proxy tests; distributed counter test using two app instances; 429/headers; limit reset; Redis outage behavior.

**Acceptance criteria:** Caller-controlled headers cannot create new rate-limit identities; all production limits share a distributed store; proxy configuration is documented and staging-verified.

### LP-SEC-005 — MEDIUM / P1 — No CSRF defense for cross-site cookies

**Root cause and components:** Production cookies use `SameSite=None`; state-changing endpoints rely on cookies; CORS is incorrectly the only cross-origin defense.

**Files/functions to modify:**

- `src/modules/auth/authController.ts` cookie helper from LP-SEC-002.
- `src/app.ts`; add `src/middleware/csrfMiddleware.ts` or an origin-validation middleware.
- `src/config/environment.ts`; `src/utils/axiosInstance.js`; auth/bootstrap frontend code.

**Implementation:**

1. Prefer a same-site topology from LP-BE-004. If feasible, use `SameSite=Lax`/`Strict` and avoid cross-site cookies.
2. If split origins remain, reject unsafe methods when `Origin` is absent or not in an allowlist, with narrowly documented exceptions for verified payment webhooks and OAuth callbacks.
3. Add synchronizer-token or double-submit CSRF protection for cookie-authenticated unsafe routes. Bootstrap a non-secret token after authenticated session creation; Axios sends it in a custom header; server compares it in constant time.
4. Ensure webhook endpoints are excluded only after signature verification, not broadly.

**Security/performance:** Origin check is required even with CSRF token. Do not permit `*` with credentials. Tokens must rotate with session and never appear in URLs.

**Prerequisites/decisions:** Canonical origin/cookie topology. Paystack webhook and Google callback requirements must be enumerated.

**Regression/edge cases:** Logout, multipart/direct upload completion, same-origin browser navigation, API clients, preflight, OAuth, browser privacy modes.

**Tests:** Cross-site POST/DELETE/PATCH rejected; valid frontend origin/token accepted; expired/missing/mismatched token rejected; webhook signature path still accepted only when valid.

**Acceptance criteria:** Every cookie-authenticated unsafe request has an origin and CSRF defense, with explicit audited exceptions only.

### LP-SEC-006 — MEDIUM / P1 — Sessions ignore account state/revocation

**Root cause and components:** `protect` verifies JWT signature/expiry only; token claims remain usable after user disable/delete/role change and after logout until access token expiry.

**Files/functions to modify:**

- `src/middleware/authMiddleware.ts`, `src/utils/jwt.ts`, `src/modules/auth/authRepository.ts`, `authService.ts`.
- User status update functions in `src/modules/admin/users/*`.
- Database migration for a `session_version`/`auth_version` field and indexes, or a dedicated revoked-session table.

**Implementation:**

1. Add `session_version` to users (or an equivalent session table) and include it as a claim in newly issued access/refresh tokens.
2. In `protect`, load a minimal user auth state through a bounded cache: user exists, active, not deleted, role current, session version matches. Reject otherwise.
3. Increment version/revoke sessions on logout-all, password reset/change, account suspension/ban/deletion, role changes, and credential compromise response. Keep single-device logout semantics explicit.
4. Avoid a DB query for every static public request; only protected requests need this check. Cache short-lived state and invalidate it on mutation.

**Security/performance:** JWT validation remains first; database/cache verification prevents stale claims. Do not trust role solely from JWT after a role change.

**Prerequisites/decisions:** Decide whether standard logout revokes only the current refresh session or all sessions. This needs product/security approval.

**Regression/edge cases:** Multiple browser devices, admin bans self/other, concurrent refresh and invalidation, cache race, legacy tokens lacking version, deleted user reactivation.

**Tests:** A suspended/deleted user cannot use an existing access token; password reset invalidates all old sessions; role downgrade removes admin access instantly; old tokens are rejected after version increment.

**Acceptance criteria:** Account status and session revocation take effect within the documented propagation window, and no protected endpoint authorizes stale account/role claims.

### LP-SEC-007 — MEDIUM / P1 — Webhook errors leak details and disable retry

**Root cause and components:** `paymentsController.webhookHandler` returns 200 and `logged_error` for all exceptions; processing directly performs network/DB work in request path.

**Files/functions to modify:**

- `src/modules/payments/paymentsController.ts`, `paymentsService.ts`, `paymentsRepository.ts`, `paystackService.ts`.
- New outbox/job worker module only if existing job infrastructure is absent; deployment/monitoring configuration.

**Implementation:**

1. Verify signature before persisting/queueing event processing.
2. Persist raw verified event with provider event/reference uniqueness and a status (`received`, `processing`, `processed`, `retryable_failure`, `terminal_failure`) in one transaction.
3. Return 2xx only after durable acceptance. For invalid signature return 401/400 generic response. For transient persistence/processing errors return a retryable 5xx if provider retry policy is desired, or queue reliably before 2xx.
4. Move external provider verification/reconciliation to an idempotent worker/outbox consumer. Log detailed errors server-side, return no internal message to caller.
5. Add alerting for aged retryable/terminal events and a safe administrative replay tool.

**Security/performance:** Limit request body size, HMAC compare safely, prevent payload logging of sensitive data, and use provider reference uniqueness.

**Prerequisites/decisions:** Queue choice and Paystack retry guarantees need confirmation. It is acceptable to begin with a database outbox worker rather than add a heavy broker.

**Regression/edge cases:** Duplicate delivery, out-of-order event, provider API downtime, DB timeout after payment success, invalid reference, worker crash after status change.

**Tests:** Valid/invalid signature; duplicate event produces one state transition; transient failure remains retryable; response has no internal error; worker replay is idempotent.

**Acceptance criteria:** No internal exception text is returned; no successful payment event is silently discarded; every webhook has durable traceable processing state.

### LP-FE-001 — HIGH / P1 — Placeholder KYC documents and simulated admin actions

**Root cause and components:** Admin review components import stock images and delay action completion rather than displaying authenticated submitted evidence.

**Files/functions to modify:**

- Frontend: `src/pages/admin/components/VerificationReviewModal.jsx`, `VerificationRequestDetailPage.jsx`, `src/api/services/verificationService.js`, `src/pages/admin/AdminVerificationSubpage.jsx`, shared `DocumentPreview`/`EvidenceLightbox` where used.
- Backend: `src/modules/verification/*`, media relationship authorization endpoints/DTOs.

**Implementation:**

1. Define review-detail DTO containing verification record, evidence media IDs, review state, and only signed URLs generated after admin authorization.
2. Fetch detail when modal opens; show loading, explicit unavailable/error, and no-action states. Remove stock document/selfie imports and `setTimeout` simulation.
3. Disable approval/rejection until record version/status and required evidence are loaded. Submit a real review request with reason requirements enforced server-side.
4. Optimistically update only after successful response; refresh queue/detail after action and handle 409 conflict if another reviewer acted first.

**Security/performance:** Never include permanent KYC URLs or document binary in list responses. Signed links must be short-lived and avoid browser caching where appropriate.

**Prerequisites/decisions:** Confirm evidence schema, reviewer roles, and whether two-person approval is required for KYC.

**Regression/edge cases:** Missing/deleted evidence, expired signed URL, reviewer loses authorization, concurrent approval, rejected record reopening, mobile preview.

**Tests:** Component tests for loading/error/no-evidence; E2E with signed media; verify no placeholder is rendered in production path; backend test proves non-admin cannot receive evidence URL.

**Acceptance criteria:** Admins see actual authorized evidence or an explicit unavailable state; no simulated approval/rejection succeeds; actions are reflected from backend state.

### LP-FE-002 — HIGH / P1 — Seeded admin disputes and fake pagination/filtering

**Root cause and components:** `AdminDisputesSubpage.jsx` contains fallback seed data and hard-coded controls disconnected from server results.

**Files/functions to modify:**

- Frontend: `src/pages/admin/AdminDisputesSubpage.jsx`, `src/api/services/disputeService.js`/`adminService.js`, `src/utils/apiPaths.js`.
- Backend: admin dispute route/controller/service/repository/validation modules as needed for a real list contract.

**Implementation:**

1. Remove all production seed fallback data. Distinguish loading, empty, retryable error, forbidden, and malformed-response states.
2. Define typed list query: `page`, `limit`, status, raiser role, search, sort. Validate/cap all server parameters and return `{items, total, page, limit, totalPages}`.
3. Bind Apply filter, reset, page controls, URL query state, and accessible loading behavior to the query. Do not display fixed page counts.
4. Detail/action modal must use backend ID, refetch after mutation, and handle stale version/conflict.

**Security/performance:** Keep search server-side, parameterized, paginated, and admin-authorized; avoid exposing evidence in list DTOs.

**Prerequisites/decisions:** Align API with existing admin dispute routes and agree searchable fields/status taxonomy.

**Regression/edge cases:** No disputes, 1 page, last page becomes empty after resolving item, query change while request in flight, server error, unauthorized response.

**Tests:** Service tests for query serialization; component tests for all states; E2E proves no seed record appears after API failure and pagination changes server query.

**Acceptance criteria:** The admin page renders only backend data, and every visible count/filter/page reflects a validated server response.

### LP-FE-003 — MEDIUM / P1 — Oversized initial frontend bundle

**Root cause and components:** All routes and heavy exports/admin libraries are included in the primary Vite entry.

**Files/functions to modify:** `src/App.jsx`, heavy page imports, export utilities under `src/utils/export/`, pages using `jspdf`, `xlsx`, and `html2canvas`; `vite.config.js`; image assets under `src/assets/images`/`public`.

**Implementation:**

1. Convert non-landing/dashboard/admin/verification routes to `React.lazy` and use a route-level `Suspense` fallback that preserves auth restoration behavior.
2. Dynamically import PDF/XLSX/export code only on user export actions.
3. Split admin, chat, verification and export vendor chunks through measured Vite/Rolldown configuration rather than arbitrary manual chunks.
4. Convert/compress oversized raster files (prefer AVIF/WebP where supported), provide dimensions and responsive `srcSet` where applicable.
5. Add build size budget in CI; set target after a baseline measurement, e.g. initial gzip JS under 300 kB with documented exceptions.

**Security/performance:** Do not lazy-load authorization itself; protected route guard must execute before sensitive page content. Verify images remain accessible and no sensitive admin code/data is prefetched unnecessarily.

**Prerequisites/decisions:** Confirm browser support and performance target from product. No new package is required initially.

**Regression/edge cases:** Deep-link refresh, lazy-load network failure, dashboard preloader behavior, export click before module loads, low-bandwidth mobile.

**Tests:** Build manifest/budget check; route navigation tests; Playwright slow-network mobile smoke; export regression tests.

**Acceptance criteria:** Build shows intentional chunks, initial route payload meets approved budget, and all lazy routes/deep links work with error fallback.

### LP-FE-004 — MEDIUM / P2 — Hook dependency/stale closure warnings

**Root cause and components:** Effects/callbacks reference mutable filters, fetch functions, event handlers and props without stable dependencies; lint reports multiple occurrences.

**Files/functions to modify:** At minimum `AdminPaymentsSubpage.jsx`, `EmployerBrowseProfessionalsSubpage.jsx`, `CommunityPage.jsx`, `src/hooks/useBuyerProfessionals.js`, and every remaining `react-hooks/exhaustive-deps` lint location.

**Implementation:**

1. Inventory warnings by behavior, not bulk suppression.
2. Stabilize request functions with `useCallback`; use `useMemo` only for derived values; include all dependencies.
3. Add `AbortController`/request sequence guards for effects fetching on changed filters. Clean up subscriptions/timers.
4. Where effect is intentionally one-time, refactor to a stable event/initialization function with a documented invariant rather than disabling lint.

**Security/performance:** Prevent stale data from driving admin/payment decisions. Avoid recreating expensive callbacks that cause request loops.

**Prerequisites/decisions:** Complete LP-FE-002 state/query design first for dispute/admin flows.

**Regression/edge cases:** Fast filter changes, unmount before response, Strict Mode double invocation, failed retry, stale pagination.

**Tests:** Interaction tests that change filters quickly and assert only newest response renders; lint exits cleanly for hook rules; no duplicate API requests in a mocked test.

**Acceptance criteria:** No unresolved hook dependency warnings except documented framework false positives approved in review; no stale-response overwrite in targeted flows.

### LP-FE-005 — LOW / P2 — Imperative `innerHTML` fallback

**Root cause and components:** `ProfessionalCard.jsx` modifies `parentElement.innerHTML` when avatar fails.

**Files/functions to modify:** `src/components/buyer/ProfessionalCard.jsx`; optionally standardize through `src/components/common/Avatar.jsx`.

**Implementation:** Replace direct DOM mutation with local `imageFailed` state and render the shared React `Avatar` fallback/escaped initial. Ensure alt text remains meaningful.

**Security/performance:** Eliminates unsafe HTML parsing and React DOM reconciliation conflicts.

**Prerequisites:** None.

**Regression/edge cases:** Broken remote image, empty name, Unicode initial, card re-render, avatar URL change.

**Tests:** Render invalid image error and verify a React fallback appears; assert no `innerHTML` assignment remains.

**Acceptance criteria:** Avatar fallback works without imperative DOM or unescaped user-derived HTML.

### LP-FE-006 — LOW / P2 — Browser console logging in auth/OAuth

**Root cause and components:** Authentication pages and `authService.js` log form/OAuth metadata.

**Files/functions to modify:** `src/pages/auth/SignupPage.jsx`, `LoginPage.jsx`, `src/api/services/authService.js`, `src/utils/debugLogger.js`.

**Implementation:** Remove direct logs; if diagnostics are required, use a centralized logger that is disabled in production, redacts identifiers/URLs, and never accepts tokens/cookies.

**Security/performance:** Reduces client-side information disclosure and production noise.

**Prerequisites:** Decide whether an approved telemetry service exists; do not add one solely for this cleanup.

**Tests:** Production build/static check has no auth console logging; unit test logger redaction if logger retained.

**Acceptance criteria:** Auth/OAuth flows do not write user/OAuth values to the production console.

### LP-BE-001 — HIGH / P1 — Assignment operations return false success

**Root cause and components:** `assignmentController.ts` list/detail/update/delete handlers are placeholders returning `[]`/`{}` with 200; routes advertise complete CRUD.

**Files/functions to modify:** `src/modules/assignments/assignmentRoutes.ts`, `assignmentController.ts`, `assignmentsService.ts`, `assignmentRepository.ts`, `assignmentsValidation.ts`; frontend API paths/callers if endpoints are retired.

**Implementation:**

1. Before launch, choose one path per exposed operation: fully implement it or replace with explicit `501 Not Implemented` and remove its UI/client service entry.
2. For implementation, add role-aware service methods. Employers may read/update only their assignments; professionals only theirs; admins use separate admin routes. List query must be paginated and capped.
3. Define allowed state transitions in one shared state machine. Do not allow generic update to alter employer/professional IDs, money, or protected status fields.
4. Return correct 404/403/409 and real DTOs; no success on no-op unless idempotency semantics are explicit.

**Security/performance:** Enforce ownership in repository queries (`WHERE id AND employer_id/professional_id`) or service plus lock, never only frontend routing.

**Prerequisites:** Coordinate with LP-BE-002/003 for assignment payment/status states.

**Regression/edge cases:** Non-owner IDOR, assignment not found, cancelled/complete state, concurrent update, pagination after deletion.

**Tests:** Owner/non-owner role matrix, no-op placeholders rejected, list pagination, forbidden update of protected fields, valid transition rules.

**Acceptance criteria:** Every public assignment operation either performs its documented behavior with authorization or returns an explicit non-success unsupported response.

### LP-BE-002 — HIGH / P1 — Duplicate payment initiation

**Root cause and components:** `PaymentsService.initiatePayment` checks assignment status but does not lock assignment/check active payment, then generates unique time-based references and inserts multiple rows.

**Files/functions to modify:** `src/modules/payments/paymentsService.ts`, `paymentsRepository.ts`, `paymentsValidation.ts`, `paymentsController.ts`, `src/modules/assignments/assignmentRepository.ts`; migration and payment UI/service.

**Implementation:**

1. Define active payment statuses and a partial unique DB constraint for an assignment/currency while a payment is active (for example pending/payment-review/escrow statuses). Confirm business rule if split payments are legitimate; default to one.
2. Add repository transaction methods using `SELECT ... FOR UPDATE` on assignment and active payment rows.
3. Accept an idempotency key from frontend, store it with unique `(payer_id, idempotency_key)`, and return the already-created checkout response on a safe retry.
4. Commit a pending payment intent before provider initialization or use an explicit `initializing` state so concurrent calls converge. Handle provider initialization failure by transitioning/releasing intent safely.
5. Ensure client disables repeated initiate action but treats server idempotency as authoritative.

**Security/performance:** Database constraints are mandatory because retries/races span processes. Never use timestamps alone as unique payment identity.

**Prerequisites:** LP-DB-001 migration process, LP-BE-003 state machine, and finance decision on split/retry/expiry policy.

**Regression/edge cases:** Double click, browser retry, timeout after Paystack accepted request, two tabs, expired checkout, provider init failure, amount/currency update during lock.

**Tests:** Parallel initiation requests result in exactly one active payment/provider request; same key returns same reference; new key during active payment returns existing/409 by rule; failed initialization can retry safely.

**Acceptance criteria:** One assignment cannot create more than one active payment under concurrent/retried calls, and client receives a deterministic result.

### LP-BE-003 — HIGH / P1 — Non-atomic payment/dispute transitions

**Root cause and components:** `resolveDisputeByAdmin` catches payment failures and resolves dispute anyway; satisfaction dispute updates multiple records outside a transaction; notification/release TODOs remain.

**Files/functions to modify:** `paymentsService.ts`, `paymentsRepository.ts`, `paymentDisputesRepository.ts`, `src/modules/assignments/assignmentsService.ts`, associated controllers/routes; new outbox repository/worker and migration.

**Implementation:**

1. Document an explicit transition table for assignment, payment, dispute, refund, and ledger statuses. Reject undocumented transitions.
2. Build single transaction service methods that lock assignment/payment/dispute rows in a consistent order. Update all related rows and ledger state or roll back all.
3. Replace catch-and-continue behavior with a transaction failure. A dispute cannot become resolved if payment/refund transition fails.
4. Insert notification/refund/reconciliation work to an `outbox_events` table within the same transaction. A worker executes side effects idempotently after commit.
5. Add optimistic version/status predicates in update queries and return 409 on stale/concurrent actions.

**Security/performance:** Do not hold transactions open during Paystack calls. Queue external effects after DB commit. Keep audit actor/reason on every transition.

**Prerequisites:** LP-SEC-001 ledger model and LP-BE-002 active-payment constraint.

**Regression/edge cases:** Payment already approved/refunded, repeated admin click, refund provider failure, dispute without payment, transaction deadlock, worker replay.

**Tests:** Forced DB failure rolls back all state; concurrent approvals yield one success/one conflict; dispute not resolved when payment transition fails; outbox event is present exactly once; replay is safe.

**Acceptance criteria:** No observable partial state exists for payment/dispute operations, and every external side effect is durable, traceable, and retryable.

### LP-BE-004 — HIGH / P0 — Process-local OAuth state and host drift

**Root cause and components:** OAuth state uses an in-memory `Map`; checked local configuration differs from Vercel rewrite/backend callback origins, and no production contract proves agreement.

**Files/functions to modify:** `src/modules/auth/authController.ts`, `src/config/environment.ts`, `src/config/redis.ts`, `src/app.ts`, frontend `vercel.json`, `src/utils/apiPaths.js`, `.env.example`, `.env.docker.example`, deployment docs/workflows.

**Implementation:**

1. Define canonical variables: `PUBLIC_APP_ORIGIN`, `PUBLIC_API_ORIGIN`, `GOOGLE_REDIRECT_URI`, `COOKIE_SAME_SITE`, `CORS_ALLOWED_ORIGINS`, and trusted proxy setting. Validate URLs/host compatibility at startup without logging secrets.
2. Choose one architecture: preferably a same-site custom API subdomain or a verified Vercel proxy path whose OAuth callback is also public through that path. Do not mix direct Render callback with Vercel-cookie session assumptions.
3. Store opaque OAuth state/nonce in Redis with TTL, one-time consume semantics, role/type payload server-side, and a hash/nonce cookie validation. Never place authoritative role data only in client-controlled base64 state.
4. Add a startup preflight command that validates only hostnames/flags; use it in CI/staging/prod deployment.
5. Document DNS, Vercel rewrite, Render service URL, Google console redirect URI, cookie domain, and CORS values in an operations runbook.

**Security/performance:** OAuth state must be cryptographically random, one-time, TTL-bound, and safe across replicas/restarts. Do not log state/nonce/tokens.

**Prerequisites/clarification required:** The platform owner must select the canonical production domain and confirm whether Vercel supports required WebSocket/proxy behavior. The repository alone cannot establish deployed provider settings.

**Regression/edge cases:** Multi-instance callback, restart between authorization/callback, state replay, expired state, user cancels consent, Vercel preview deployment, local development.

**Tests:** Redis state create/consume/replay/expiry; two-process integration; staging browser OAuth login with production-equivalent domains/cookies; negative state tests.

**Acceptance criteria:** OAuth works through the exact production public hostname after a restart/replica change, state cannot replay, and callback/cookie/CORS hosts match the documented configuration contract.

### LP-BE-005 — MEDIUM / P1 — Socket.IO path unverified and unthrottled

**Root cause and components:** Browser defaults to same-origin while API is rewritten elsewhere; Socket.IO server CORS relies on `FRONTEND_URL`; no event-level limiter.

**Files/functions to modify:** `src/modules/chat/chatSocket.ts`, `src/utils/socketManager.js`, `src/utils/apiPaths.js`, `src/config/environment.ts`, deployment config/runbook, and rate-limit utilities.

**Implementation:**

1. Decide/declare `VITE_SOCKET_URL` or equivalent canonical socket endpoint independently of REST base URL when proxy upgrade is not guaranteed.
2. Validate allowed origins using same configuration as HTTP CORS; use cookie/session validation from LP-SEC-006.
3. Add per-socket and per-user token-bucket limits for connection attempts, `sendMessage`, typing, join/leave, and read events. Disconnect/reject abusive clients with generic errors.
4. Add connection metrics, auth failure counts, event rejection counts, and clean shutdown integration.

**Security/performance:** Never trust client-supplied token where cookie session is available; limits must work across replicas if socket adapter/scaling is introduced.

**Prerequisites:** Canonical hosts from LP-BE-004; rate-limit infrastructure from LP-SEC-004.

**Regression/edge cases:** Cross-tab presence counts, reconnection, expired token, backend deploy, message after rejoin, slow network, CORS preflight/upgrade.

**Tests:** Staging browser WebSocket upgrade from production frontend origin; connect/send/read; unrelated-thread join denied; event flood limited; reconnect works after rolling restart.

**Acceptance criteria:** Messaging has a verified production route and authentication; abusive event rates are bounded; shutdown drains/disconnects predictably.

### LP-BE-006 — MEDIUM / P2 — Unscoped admin impersonation bearer token

**Root cause and components:** Admin service creates a normal access JWT, returns it to browser JSON, and reports a possibly inaccurate fixed expiry.

**Files/functions to modify:** `src/modules/admin/users/adminUsersService.ts`, `adminUsersController.ts`, `adminUsersRoutes.ts`, `src/utils/jwt.ts`, `authMiddleware.ts`, admin audit middleware, frontend admin UI; migration for impersonation sessions if used.

**Implementation:**

1. Restrict initiation to an explicit privileged admin role, require reason and optional ticket reference, and prohibit impersonating protected/admin accounts by durable role policy.
2. Create a separate signed impersonation token/session with `purpose=impersonation`, target ID, actor ID, exact expiry, session ID, and no refresh capability.
3. Require `purpose` checks in middleware; restrict sensitive finance/security/admin operations during impersonation unless explicitly approved.
4. Store/revoke session records, show a persistent frontend banner, and provide immediate stop-impersonation. Return exact `expiresAt`, not a hard-coded string.

**Security/performance:** This is a privileged audit feature, not ordinary auth. Log issuance/use/revocation without logging token.

**Prerequisites:** Session version design from LP-SEC-006 and token response policy from LP-SEC-002.

**Regression/edge cases:** Session expiry while active, target banned/deleted, actor privilege revoked, refresh attempt, concurrent impersonations.

**Tests:** Unprivileged admin denied; token cannot refresh/admin-escalate; expiry/revocation immediate; audit row written; banner rendered.

**Acceptance criteria:** Impersonation is scoped, short-lived, visible, auditable, non-refreshable and revocable.

### LP-DB-001 — HIGH / P1 — Migration collisions and no migration ledger

**Root cause and components:** Duplicate numeric prefixes and manual filename selection; no schema migration history/checksum lock.

**Files/functions to modify:** `src/migrations/*`, `.github/workflows/production-migrate.yml`, `package.json`, add `scripts/migrate.ts` or a minimal dedicated migration tool configuration, CI workflow.

**Implementation:**

1. Do not rename already-applied production files until actual migration history is known. First produce an environment-specific applied-migration manifest from the database/operator records.
2. Adopt a migration runner with `schema_migrations` table: immutable unique ID, filename, checksum, applied timestamp, tool version; advisory lock prevents concurrent execution.
3. Assign globally unique chronological IDs to all unapplied/new migrations. For duplicate legacy prefixes, preserve filenames in an explicit ordered baseline manifest rather than guessing order.
4. Add `migrate:status`, `migrate:check`, and `migrate:up`; CI migrates an empty Postgres database from zero and runs schema assertions.
5. Release financial/session schema changes only through this runner. Production workflow calls the runner, not arbitrary `psql` file lists.

**Security/performance:** Store checksums to detect edited historical migrations. Back up production and rehearse restore; migrations must be non-destructive/online where data size requires it.

**Prerequisites/clarification required:** Need production DB applied-migration state and backup/RTO owner approval. This cannot be safely inferred from repository filenames.

**Regression/edge cases:** Legacy database without migration table, partially applied scripts, concurrent deploy, rollback of non-reversible data migrations, large table locks.

**Tests:** Fresh DB full migration, upgrade from production-like snapshot, checksum mismatch refusal, concurrent runner lock, CI schema contract tests.

**Acceptance criteria:** A new environment can be built reproducibly; status identifies exact applied versions; production deployment never requires manually selecting ambiguous filenames.

### LP-DB-002 — HIGH / P0 — Tests can use non-test database

**Root cause and components:** Jest setup imports normal DB config, checks neither `NODE_ENV` nor database identity, and test cleanup is disabled.

**Files/functions to modify:** `src/__tests__/setup.ts`, `src/config/environment.ts`, `src/config/db.ts`, `jest.config.js`, test scripts/package scripts, CI workflow, Docker compose test configuration.

**Implementation:**

1. Add `TEST_DATABASE_URL` separate from `DATABASE_URL`; in test startup require `NODE_ENV=test`, require `TEST_DATABASE_URL`, and reject known production/staging hostnames/database names.
2. Make `config/db.ts` select test connection only in test environment. Fail before any test query if the guard is not satisfied.
3. Use an ephemeral CI database and apply migrations before tests. Mock/disable SMTP, Paystack, Google and S3 by default; assert test mode adapters are active.
4. Wrap each test suite/test transactionally or provision a schema/database per worker. Re-enable cleanup only with scoped test prefix/schema and foreign-key safe teardown.
5. Update stale test fixtures to include `passwordConfirm` and OTP verification or mock the verification boundary intentionally; never bypass production auth behavior accidentally.

**Security/performance:** Never log connection strings. Guard must be code-enforced, not documented convention.

**Prerequisites:** LP-DB-001 runner for reproducible test schema; a dedicated test database/service.

**Regression/edge cases:** Developer local setup, parallel Jest workers, existing `DATABASE_URL` only, migration failure, test email delivery, aborted run cleanup.

**Tests:** Test bootstrap refuses `NODE_ENV=production`; refuses missing/mismatched test URL; CI proves migrations then tests run; fixtures pass current auth contract.

**Acceptance criteria:** `npm test` cannot connect to production/staging by configuration error, and the backend suite runs reliably against disposable isolated data.

### LP-DB-003 — MEDIUM / P2 — Storage malware/lifecycle/policy assurance gap

**Root cause and components:** Media service validates size/type/signature but has no asynchronous scan/quarantine/cleanup or versioned proof of private bucket policies.

**Files/functions to modify:** `src/modules/media/mediaService.ts`, `mediaRepository.ts`, `mediaTypes.ts`; new scan/cleanup worker; migrations; storage IaC/policy repository or documented Supabase policy export.

**Implementation:**

1. Add asset states: `pending_upload`, `pending_scan`, `ready`, `quarantined`, `failed`, `deleted`; only `ready` can be attached/delivered.
2. After complete upload, enqueue scan. Use a selected scanner/quarantine service only after security/operations approves operational cost and supported formats.
3. Implement scheduled cleanup for stale pending/failed/orphaned objects and DB records; retain audit evidence for KYC according to legal policy.
4. Version private/public bucket policies in IaC or export/validate them in CI. Explicitly prohibit anonymous reads for KYC/workspace/chat/document buckets.

**Security/performance:** Do not attempt synchronous antivirus scanning in request path. Keep public-profile/portfolio policy distinct from private evidence; signed URL only after relationship authorization.

**Prerequisites/clarification required:** Need retention, legal/KYC, scanner vendor, quarantine and data-residency decisions.

**Regression/edge cases:** Scanner unavailable, false positive, scan timeout, object deleted before scan, signed URL cached after revocation, cleanup racing a resume upload.

**Tests:** File state transitions; unscanned/quarantined access denied; stale object cleanup; policy assertion against test bucket; scanner failure safe default.

**Acceptance criteria:** Private objects cannot be served before scan/authorization; orphaned objects are cleaned to policy; bucket privacy is reproducibly verified.

### LP-OPS-001 — MEDIUM / P1 — No graceful shutdown/readiness lifecycle

**Root cause and components:** `server.ts` only calls `listen`; it does not drain HTTP/Socket.IO, close pools, or handle process failures.

**Files/functions to modify:** `src/server.ts`, `src/config/db.ts`, `src/config/redis.ts`, `src/modules/chat/chatSocket.ts`, health/readiness endpoint in `src/app.ts`, Docker/deployment health configuration.

**Implementation:**

1. Track server readiness separately from liveness. `/health` remains cheap; `/ready` verifies app initialization and dependency state with bounded timeouts.
2. Handle SIGTERM/SIGINT once: mark unready, stop accepting connections, notify/disconnect sockets, wait bounded time for HTTP requests, close Redis/DB pools, then exit.
3. Handle `unhandledRejection`/`uncaughtException` by logging redacted context, initiating controlled shutdown, and relying on platform restart.
4. Add startup dependency policy: required DB must connect before ready; optional Redis degradation must be visible and compatible with rate-limit/cache failure policy.

**Security/performance:** Avoid health endpoint DB query per probe. Never block shutdown indefinitely.

**Prerequisites:** Redis close helper and Socket.IO server reference; deployment readiness probe settings.

**Regression/edge cases:** SIGTERM during webhook/payment transaction, long poll/socket, DB unavailable at startup, duplicate signal, forced timeout.

**Tests:** Spawn process/integration tests send SIGTERM; readiness changes before exit; pool close invoked; in-flight request gets bounded behavior; Docker health checks target correct endpoint.

**Acceptance criteria:** Rolling deployment drains predictably, reports readiness accurately, and does not leave open DB/Redis/socket handles.

### LP-OPS-002 — HIGH / P0 — Runtime dependency advisories

**Root cause and components:** Current lockfiles resolve known advisories in frontend and backend chains, including a backend critical advisory.

**Files/functions to modify:** Both `package.json` and lockfiles; backend `overrides` if needed; CI dependency scan workflow; potentially source code affected by major-version upgrades.

**Implementation:**

1. Create a remediation branch and capture `npm ls`/audit JSON baseline. Do not run blind `npm audit fix --force` on launch branch.
2. Upgrade direct roots first (Express/body-parser chain, Socket.IO/Engine.IO, Axios/follow-redirects, Nodemailer, Zod, Multer or remove if unused). Use narrowly scoped `overrides` only when a compatible transitive upgrade is unavailable.
3. Regenerate lockfiles with supported Node/npm, rerun audit, build, lint and isolated tests. Investigate any residual advisory for reachability and document compensating control/expiry; critical/high residuals block launch.
4. Add CI gate that fails on critical advisories and reports high advisories; permit only explicitly reviewed temporary exceptions with owner/expiry.

**Security/performance:** Major upgrades can alter request parsing, Socket.IO protocol, validation error shapes, and email behavior. Treat as code changes and regression test them.

**Prerequisites:** Isolated test DB (LP-DB-002) and a compatible staging environment.

**Regression/edge cases:** Lockfile drift on Windows/Linux, Node version mismatch, transitive peer conflicts, changes in Axios redirects, Engine.IO client/server mismatch.

**Tests:** `npm ci`, `npm audit --omit=dev`, build/lint/unit/integration/E2E matrix, Socket.IO compatibility smoke, payment/email adapter mocks.

**Acceptance criteria:** No unreviewed critical or high runtime advisory remains; dependency update evidence is attached to release notes and CI enforces the policy.

### LP-OPS-003 — HIGH / P0 — No verifiable production configuration contract

**Root cause and components:** Environment schema validates individual variables but no versioned non-secret production host/service relationship or pre-deploy check exists.

**Files/functions to modify:** `src/config/environment.ts`, `.env.example`, `.env.docker.example`, frontend `.env.example` (create/update), `vercel.json`, Docker/deployment workflows, docs/runbook, preflight script.

**Implementation:**

1. Maintain examples containing variable names, valid formats, and non-secret placeholders only. Never commit real `.env` files/secrets.
2. Add `config:check` that validates required variables, production-only `NODE_ENV`, exact allowed origin list, URL host agreement, HTTPS, cookie policy and webhook/OAuth callback relationship. Output only variable names/hostnames, never values/secrets.
3. Make build/deploy CI run preflight with deployment environment secrets; add staging smoke steps for health, API, auth cookie, OAuth callback, storage intent and webhook signature fixture.
4. Create an owner-reviewed launch checklist for Render, Vercel, Google Cloud OAuth, Paystack, Supabase buckets, DNS, secrets, monitoring and rollback.

**Security/performance:** Prevent accidental `NODE_ENV=development` behavior in production. Do not echo credentials in CI logs.

**Prerequisites/clarification required:** Production service inventory, canonical domains, and access to deployment settings are required.

**Regression/edge cases:** Preview environments, local dev defaults, secret rotation, temporary webhook endpoint, maintenance mode.

**Tests:** Config check passes with approved staging/prod fixtures, fails for localhost in production, mismatched OAuth host, HTTP URL, wildcard CORS credentials, or missing required value.

**Acceptance criteria:** A deploy cannot proceed with inconsistent public host/cookie/OAuth/CORS configuration, and the signed-off launch checklist is complete.

## Supplemental audit items: dead code, dependency and long-term work

These items were documented in the audit's dead-code/P3 sections without original LP IDs. They are retained here rather than silently merged.

### SUP-001 — Committed OTP backup source file — P2

- **Affected files:** `src/modules/otp/otpService.ts.backup`; imports/search across backend.
- **Plan:** Confirm no runtime/build/reference usage with CI search and package build. Archive outside `src` or remove in a reviewed cleanup commit. Add ignore rule/process to prevent source backups in application tree.
- **Tests/acceptance:** Build/test pass; repository has no `*.backup` production source files.

### SUP-002 — Potentially unused Multer/local uploads artifacts — P2 investigation

- **Affected files:** Backend `package.json`, package lock, `uploads/`, Docker `uploads` volume.
- **Plan:** Trace all runtime imports and deployment dependency. If no active local-upload workflow exists, remove dependency and durable volume only after confirming no external process uses it. If it is retained, document purpose and apply dependency fixes under LP-OPS-002.
- **Clarification:** Requires deployment/operations confirmation; do not delete live uploads based only on source search.
- **Acceptance:** Either documented supported workflow with tests or removed dependency/artifacts through approved migration.

### SUP-003 — Frontend unused imports/variables and general lint debt — P2

- **Affected files:** All frontend `oxlint` warnings beyond hook work, including unused icons, parameters and variables.
- **Plan:** Fix incrementally by feature ownership; remove imports/variables only after confirming no dynamic use. Make warnings budget decrease in CI without mass suppressions.
- **Tests/acceptance:** Lint warning count reaches agreed target (prefer zero for new/modified files); affected UI behavior unchanged.

### SUP-004 — Formal security/performance observability program — P3

- **Plan:** Schedule BOLA/IDOR penetration test, threat model of payments/admin/media, production query plan/index review, load tests, and dashboards/alerts for OAuth, payments, uploads, queues and sockets.
- **Acceptance:** Named owner, cadence, alert thresholds and documented exercise results; not a launch substitute for P0/P1 remediation.

## Required release test matrix

| Layer | Minimum release evidence |
|---|---|
| Database | Fresh migration, production-like upgrade rehearsal, checksum/status output, backup/restore exercise. |
| Backend unit/integration | Isolated test DB; auth/token/CSRF/BOLA/ledger/payment/webhook/assignment/admin role matrix. |
| Frontend | Build budget, lint, auth/session tests, admin no-mock states, async filter race tests. |
| Staging E2E | Sign-up/OTP/login/logout/reset, Google OAuth, profile/media, job/apply/accept/pay, webhook fixture/replay, chat Socket.IO, admin review/dispute, mobile viewport. |
| Security | Dependency audit with no unreviewed critical/high runtime finding, proxy/header tests, CSRF tests, private media access tests. |
| Operations | Health/readiness, SIGTERM drain, Redis outage policy, payment worker retry, rollout/rollback runbook. |

## Explicit decisions and investigations required before implementation

1. **Canonical production host topology:** Which hostname owns browser cookies, REST API, Socket.IO, and Google OAuth callback? Owner: platform/deployment lead.
2. **Wallet/product semantics:** Is wallet money, prepaid credit, or a UI-only balance? What are authoritative opening balances and manual-adjustment controls? Owner: finance/product.
3. **Payment/dispute state policy:** Are split payments allowed? When is escrow released? What is refund responsibility when Paystack call fails? Owner: finance/product/legal.
4. **Migration history:** What exact scripts have been applied to each environment? Owner: database/operations lead.
5. **Storage retention/scanning:** KYC retention duration, scanner/quarantine provider, legal/data-residency requirements. Owner: security/legal/operations.
6. **Admin roles:** Exact permissions for verification, payments, disputes, support and impersonation. Owner: security/product.

Until these decisions are made, implementation may proceed only on safe preparatory code/tests; it must not guess financial, retention, or production-host behavior.

## Definition of done for the remediation program

The program is complete only when every numbered finding above has passed its stated acceptance criteria, no P0 remains open, P1 exceptions have an accountable owner/date/risk acceptance, production configuration/migration/test evidence is archived, and staging smoke tests prove the critical user journeys on the exact deployment topology intended for launch.
