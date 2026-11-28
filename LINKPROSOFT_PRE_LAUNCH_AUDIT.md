# LINKPROSOFT Pre-Launch Production Readiness Audit

**Audit date:** 28 November 2026  
**Scope:** `C:\Users\HP\Linkprosoft-redesign` (Vite/React frontend) and `C:\Users\HP\umarks\Linprosoft-Backend` (Express/PostgreSQL backend)  
**Method:** Static code and configuration review, production-build/lint/test execution, dependency audit, and frontend-to-backend contract tracing. No application source was changed.

## 1. Executive summary

**Launch decision: NO-GO until the P0 items below are remediated and independently retested.**

The codebase has good foundations: parameterized PostgreSQL queries are common, media has an explicit ownership model and signed URLs, authentication uses password hashing and short-lived access tokens, and the accept-and-fund path is transactional. However, the current repository contains several verified security and financial-integrity defects that are incompatible with a public launch:

- Any authenticated employer can call the wallet API to arbitrarily set or increase their own balance.
- Login and email-verification responses return access and refresh JWTs in JSON, defeating the intended HttpOnly-cookie protection.
- Any authenticated user can retrieve another user's email through the chat user lookup endpoint; public professional profile data provides the target user ID needed to do so.
- The checked-in environment/deployment configuration is internally inconsistent: it is set to development/local frontend, Google OAuth redirects to a different Render hostname than the Vercel API rewrite target, and there is no checked-in production environment contract.
- The test command uses whatever `DATABASE_URL` is available, creates real records, and has no test-environment assertion. The backend suite currently fails extensively because its fixtures predate the OTP/password-confirmation flow.

The largest operational risks after those blockers are incomplete assignment endpoints that return successful empty objects, payment/dispute state transitions that are not atomic, unbounded duplicate payment initiation, no dependable migration runner/history, and high/critical production dependency advisories.

## 2. Architecture overview

| Area | Observed implementation |
|---|---|
| Frontend | React 19 SPA built by Vite 8, React Router 7, Zustand state, Axios, Tailwind, Socket.IO client, Vercel SPA/API rewrites. API calls are same-origin in production (`src/utils/apiPaths.js:4-6`). |
| Backend | Node/Express 4 TypeScript application with modules split into routes, controllers, services, repositories, Zod validation, PostgreSQL (`pg`), Redis cache/rate-limit store, Socket.IO, Winston logs. Entrypoint: `src/server.ts`. |
| Authentication | Email/password plus OTP verification, Google OAuth, signed access JWT plus refresh JWT stored in DB. The normal frontend flow uses credentials cookies and `/api/auth/me`. |
| Roles | `professional`, `employer`, `admin`; some modules also reference `super_admin` and an `admin_role` concept. |
| Data | PostgreSQL migrations under `src/migrations`; modules cover profiles, skills, portfolios, jobs, applications, assignments, payments, verification, subscriptions, messaging, notifications, media, community, and admin operations. |
| Storage | S3-compatible Supabase storage with purpose-specific bucket policy. KYC, workspace, chat and documents are intended private; avatar/cover/portfolio/community objects are public. |
| Integrations | Paystack, Google OAuth, SMTP/Resend, Redis, Supabase S3, Socket.IO. |
| Deployment | Frontend `vercel.json` rewrites `/api/*` to `https://linkprosoft-backend-hxmc.onrender.com`; backend has Docker/Compose and CI workflows. |

### Important architectural observations

- Most private media retrieval flows correctly use signed URLs and ownership/relationship checks (`src/modules/media/mediaService.ts:92-95`, `151-184`). This is a positive control, not proof that every caller is authorized.
- The backend has two different rate-limiting implementations: custom in-memory auth limiting and `express-rate-limit`, with only search backed by Redis. Their behavior and proxy handling differ.
- There is no automatic, versioned migration runner or migration-history table. Production migration is a manual GitHub dispatch that accepts a comma-separated list of filenames (`.github/workflows/production-migrate.yml:1-108`).

## 3. User journey assessment

Status definitions: **Verified** = code path and contract examined; **Partial** = implementation exists but material gap found; **Blocked** = a P0/P1 issue prevents a safe/reliable launch; **Unverified** = no safe end-to-end environment was available.

| User/role | Flow | Frontend implementation | Backend implementation | Actual assessment | Status |
|---|---|---|---|---|---|
| Visitor | Sign-up and choose role | Multi-step role/type/signup/OTP UI | Zod validation, user creation, OTP delivery | Payload contract is aligned. Backend test fixtures are stale; live email delivery was not exercised. | Partial |
| Visitor | Email verification and session creation | Calls verify endpoint then restores cookie identity | Marks verified and sets cookies | Also returns both JWTs in JSON, exposing session credentials to JS. | Blocked |
| User | Login/logout/session restore | Cookie-backed Axios and `/me` restoration | Cookies, JWT validation, refresh records | Login returns JWTs in JSON; logout cannot revoke already-issued access JWTs before expiry. | Blocked |
| Visitor | Password reset | OTP/reset UI and API services | Generic non-enumerating forgot-password response, OTP flow | Code path is present; no end-to-end email/provider verification performed. | Partial |
| Professional | Create/edit profile, skills, portfolio, public profile | Implemented with media service | Ownership checks and profile DTOs | Core profile paths appear implemented; public detailed profile requires privacy regression tests. | Partial |
| User | Upload KYC/profile/chat/evidence media | Upload intent, direct signed PUT, complete call | Purpose policy, size/type checks and signed retrieval | Strong design; malware scanning, lifecycle cleanup and storage-bucket policies were not verifiable from this repo. | Partial |
| Employer | Post/manage jobs, accept application | Job and application UI/services | Job/application routes, transactional accept-and-fund path | Accept-and-fund transaction is sound, but payment initiation can be repeated and full E2E is unverified. | Partial |
| Employer | Fund escrow / payment | Paystack redirect/verify UI | Paystack initialize, webhook, admin approval | Wallet endpoint permits arbitrary balance manipulation; payment state has concurrency/duplicate hazards. | Blocked |
| Employer/professional | Assignment detail, update, delete, list | API paths are advertised | Controller returns `[]`/`{}` success placeholders | UI/API can report success without doing work. | Blocked for assignment API consumers |
| Professional/employer | Messages and attachments | REST + Socket.IO UI | Participant checks for thread messages and attachment ownership | Chat lookup exposes user emails; Socket.IO production routing/config needs live verification. | Partial |
| Authenticated user | Community posts, comments, follows | Implemented UI | Auth middleware plus services | No route-level request validation; authorization exists for edit/delete in service but needs adversarial coverage. | Partial |
| Admin | User moderation, verification, finance, disputes | Extensive dashboard UI | Admin routers use `protect` and role authorization | Some screens retain seeded/placeholder fallback content; production admin actions need permission and audit regression tests. | Partial |

## 4. Security findings

### LP-SEC-001 — Arbitrary employer wallet credit/debit

- **Severity:** CRITICAL / P0
- **Affected component:** Wallet API and financial integrity
- **Evidence:** `C:\Users\HP\umarks\Linprosoft-Backend\src\modules\wallet\walletRoutes.ts:9-12`; `walletController.ts:11-15`; `walletService.ts:14-18`.
- **Description:** Every authenticated `employer` may invoke `POST /api/wallet` with an amount or `PUT /api/wallet` with a chosen balance. The controller passes user-controlled values straight to repository mutation methods. There is no payment-provider verification, admin authorization, ledger, idempotency key, transaction reference, or business-purpose restriction.
- **Reproduction/evidence:** Authenticate as any employer and submit `PUT /api/wallet` with a new `balance`; the route only applies `protect, authorize("employer")` and invokes `setWalletBalance(currentUserId, req.body.balance)`.
- **Impact:** An attacker can manufacture account credit or erase/alter their balance. If balance influences payment, escrow, payouts, eligibility, or reporting, this can cause financial loss and corrupt accounting.
- **Required fix:** Remove these public mutation endpoints before launch. Credit only from verified, idempotent payment webhooks in an immutable double-entry ledger. Restrict manual adjustments to tightly audited finance-admin workflows and make direct balance columns derived/cache-only.

### LP-SEC-002 — Access and refresh tokens exposed in JSON responses

- **Severity:** HIGH / P0
- **Affected component:** Authentication/session handling
- **Evidence:** `C:\Users\HP\umarks\Linprosoft-Backend\src\modules\auth\authController.ts:424-449` (email verification) and `528-553` (login).
- **Description:** The endpoints set `httpOnly` cookies, but also return `accessToken` and `refreshToken` in the JSON response body. This defeats the stated cookie-only protection: any XSS, malicious browser extension, compromised same-origin dependency, or debug logger can read and exfiltrate the refresh token.
- **Reproduction/evidence:** Successful `POST /api/auth/login` or `POST /api/auth/verify-email` response includes both token fields at the cited lines.
- **Impact:** Account takeover lasting until token rotation/revocation; refresh tokens are especially sensitive.
- **Required fix:** Remove both token fields from all browser-facing response bodies, including refresh and impersonation paths where appropriate. Keep credentials solely in `Secure; HttpOnly` cookies, review logs/client code for token handling, rotate existing refresh-token secrets/sessions after deployment, and add regression tests asserting token absence.

### LP-SEC-003 — Authenticated users can disclose arbitrary users’ email addresses

- **Severity:** HIGH / P0
- **Affected component:** Chat directory/user lookup and privacy
- **Evidence:** `C:\Users\HP\umarks\Linprosoft-Backend\src\modules\chat\chatRoutes.ts:6-17`; `chatService.ts:182-185`; public-profile user IDs in `src/modules/profile/profileService.ts:33-42`.
- **Description:** `GET /api/chat/users/:userId` is protected only by authentication and returns `{ id, fullName, email, role }` without requiring a conversation, business relationship, or admin role. Public profile data exposes the associated user ID.
- **Reproduction/evidence:** Register any account, obtain a professional user ID from a public profile response, then request `/api/chat/users/<id>`; service returns `user.email` at line 185.
- **Impact:** Bulk harvesting of user emails, spam/phishing, and violation of user privacy expectations.
- **Required fix:** Remove email from the response. Require an approved contact/thread relationship if the route is needed, or return only the minimum public profile fields. Add BOLA/privacy tests for unrelated authenticated users.

### LP-SEC-004 — Rate limiting is bypassable/inconsistent in proxy deployments

- **Severity:** HIGH / P1
- **Affected component:** API abuse controls
- **Evidence:** `src/middleware/rateLimitMiddleware.ts:14-21, 26-43, 73-105`; `src/app.ts:96-103`; no `app.set("trust proxy", ...)` in the application bootstrap.
- **Description:** The global/heavy/search limiter trusts the first client-supplied `X-Forwarded-For` value. A direct caller can choose a new value per request. In contrast, the auth limiter uses `req.ip`; without explicitly configuring trusted proxies, reverse-proxy deployments may collapse many users onto one proxy IP or produce unpredictable behavior. The default global/heavy stores are per-process; only search has a Redis store.
- **Impact:** API scraping and resource abuse can bypass limits; legitimate users can be collectively rate-limited behind a proxy; limits reset when scaled/restarted.
- **Required fix:** Configure an exact trusted-proxy topology, derive IP from Express only after that configuration, never parse arbitrary forwarded headers manually, and use Redis (with fail-closed/explicit policy) for every production limiter. Add tests with spoofed forwarding headers.

### LP-SEC-005 — Cross-site cookie session lacks a CSRF defense-in-depth control

- **Severity:** MEDIUM / P1
- **Affected component:** Cookie-authenticated state-changing API
- **Evidence:** `authController.ts:307-322, 424-439, 528-543` sets `sameSite: "none"` in production; `app.ts:75-100` allows credentialed CORS.
- **Description:** Cross-site cookies are necessary for the deployed split frontend/backend arrangement, but there is no CSRF token or server-side Origin/Referer validation on mutating requests. CORS is not a CSRF control; simple cross-site form requests can still be sent (for example, logout).
- **Impact:** Cross-site request attacks against endpoints accepting simple requests today or in a future regression.
- **Required fix:** Prefer same-site hosting. If cross-site cookies remain necessary, validate Origin on unsafe methods and implement CSRF tokens/double-submit protection; add CSRF tests for every cookie-authenticated mutation.

### LP-SEC-006 — Token validity does not check account state or server-side access-token revocation

- **Severity:** MEDIUM / P1
- **Affected component:** Authorization/session invalidation
- **Evidence:** `src/middleware/authMiddleware.ts:35-85` verifies only JWT signature/expiry and assigns decoded claims.
- **Description:** `protect` does not load the user or check `is_active`, `deleted_at`, role changes, or a token/session version. Revoking refresh tokens on logout/password reset does not invalidate an already-issued access JWT.
- **Impact:** Suspended, banned, deleted, or logged-out users can continue making requests until access-token expiry; role changes are delayed.
- **Required fix:** Use a session/token-version or denylist check for sensitive operations and validate user active/deleted state (with a bounded cache if needed). Immediately invalidate all sessions on status/role/password changes.

### LP-SEC-007 — Webhook errors disclose internal messages and suppress retries

- **Severity:** MEDIUM / P1
- **Affected component:** Paystack webhook reliability/information handling
- **Evidence:** `src/modules/payments/paymentsController.ts:52-73`.
- **Description:** Any webhook failure is returned as HTTP 200 with `logged_error: error.message`. This both exposes implementation/provider details to callers and tells Paystack not to retry transient database/provider failures.
- **Impact:** Lost payment events and difficult reconciliation; unnecessary information exposure.
- **Required fix:** Return a generic response; return non-2xx for retryable failures after verified signature, implement durable idempotent processing/queueing, and alert on failed event processing.

## 5. Frontend findings

### LP-FE-001 — Admin verification screens show placeholder identity documents and simulate actions

- **Severity:** HIGH / P1
- **Evidence:** `src/pages/admin/components/VerificationReviewModal.jsx:17-19, 40, 151, 175`; `VerificationRequestDetailPage.jsx:21-23, 48, 73, 204, 234`.
- **Description:** These admin review components import stock placeholder images for identity/selfie documents and wait one second to simulate actions. A moderator can appear to view or act on KYC data that is not the uploaded evidence.
- **Impact:** Unsafe KYC decisions and a misleading high-risk admin workflow.
- **Fix:** Do not render review/approval controls until actual authenticated signed document URLs are loaded. Display an explicit error/unavailable state; remove simulated success paths.

### LP-FE-002 — Admin dispute interface contains seeded fallback data and nonfunctional filter/pagination controls

- **Severity:** HIGH / P1
- **Evidence:** `src/pages/admin/AdminDisputesSubpage.jsx:26` (seed fallback); filter apply button at `421-423`; hard-coded pagination text/buttons at `564-584`.
- **Description:** The screen falls back to mock disputes and presents actions/navigation that do not correspond to server-side pagination/filtering.
- **Impact:** Admins may make decisions from fabricated/stale data or believe a filter applied when it did not.
- **Fix:** Remove production fallback records; make loading/error states explicit; bind filters and pagination to authenticated backend queries.

### LP-FE-003 — Large un-split production bundle

- **Severity:** MEDIUM / P1
- **Evidence:** `npm run build` completed but Vite reported one JavaScript bundle of **3,033.68 kB minified / 750.70 kB gzip**, above the 500 kB warning threshold.
- **Impact:** Slow first load and degraded mobile experience, especially for a marketplace targeting mobile users.
- **Fix:** Route-level lazy loading for dashboards/admin/verification, manually chunk PDF/XLSX/export libraries, defer Socket.IO/admin code, and set a performance budget. The largest static images should also be optimized (several are 0.6–1.1 MB).

### LP-FE-004 — Hook dependency warnings indicate stale-data/race-condition risk

- **Severity:** MEDIUM / P2
- **Evidence:** Frontend lint completed with many warnings, including missing hook dependencies in `AdminPaymentsSubpage.jsx`, `EmployerBrowseProfessionalsSubpage.jsx`, `CommunityPage.jsx`, `useBuyerProfessionals.js`, and multiple modal/list components.
- **Impact:** Filters, search results, pagination, modal data, and network callbacks can use stale closures after state changes.
- **Fix:** Resolve each hook warning rather than suppressing it; wrap network functions in `useCallback` where appropriate and add interaction tests for changing filters quickly/unmounting during fetches.

### LP-FE-005 — Unsafe imperative `innerHTML` fallback

- **Severity:** LOW / P2
- **Evidence:** `src/components/buyer/ProfessionalCard.jsx:103-110`.
- **Description:** The image error fallback writes markup via `parentElement.innerHTML`. The current interpolation is only a first character, limiting exploitability, but user-derived data should never be placed through imperative HTML parsing.
- **Fix:** Use React state and render a normal escaped fallback element; remove the imperative DOM mutation.

### LP-FE-006 — Console logging remains in user authentication/OAuth flows

- **Severity:** LOW / P2
- **Evidence:** `src/pages/auth/SignupPage.jsx:54, 118`; `src/pages/auth/LoginPage.jsx:58`; `src/api/services/authService.js` logs the OAuth redirect URL.
- **Impact:** Avoidable production diagnostics and user/flow metadata in browser consoles.
- **Fix:** Remove logs or route redacted telemetry through an approved client logger.

## 6. Backend findings

### LP-BE-001 — Assignment API advertises operations that do not perform work

- **Severity:** HIGH / P1
- **Evidence:** `src/modules/assignments/assignmentController.ts:25-46`; routes at `assignmentRoutes.ts:9-23`.
- **Description:** `GET /api/assignments`, `GET /:id`, `PUT /:id`, and `DELETE /:id` return success with `[]` or `{}` and comments saying the feature "can be implemented." The routes are reachable and validated as though they are production operations.
- **Impact:** Clients receive false success for list/detail/update/delete; state becomes confusing and support incidents follow.
- **Fix:** Implement with role/ownership checks and pagination, or remove/hide these endpoints and frontend affordances before launch. Return 501 rather than a success response until implemented.

### LP-BE-002 — Duplicate payment initiation is not prevented

- **Severity:** HIGH / P1
- **Evidence:** `src/modules/payments/paymentsService.ts:61-145`; repository insert at `paymentsRepository.ts:11-37`.
- **Description:** Payment initiation accepts assignment states including `accepted`, `in_progress`, and `completed`, generates a time-based reference, calls Paystack, then inserts a new pending payment. No transaction, assignment lock, idempotency key, or query for an existing active payment protects repeated clicks/retries.
- **Impact:** An employer can create multiple checkout links/charges for the same assignment and create reconciliation/refund incidents.
- **Fix:** Lock the assignment and payment row in a database transaction; use a unique partial constraint/idempotency key for active payments per assignment; return the existing payment/checkout session safely.

### LP-BE-003 — Payment/dispute resolution uses best-effort, non-atomic state changes

- **Severity:** HIGH / P1
- **Evidence:** `paymentsService.ts:455-484`; `assignmentsService.ts:39-74`.
- **Description:** Dispute resolution catches payment approval/rejection failures and continues to mark the dispute resolved. Satisfaction-dispute processing updates payment satisfaction and creates a dispute in separate operations without a transaction. TODOs acknowledge missing release/notification behavior.
- **Impact:** A dispute may be marked resolved while funds retain the previous state, or partial records can be committed.
- **Fix:** Model a single transaction/state machine with row locks and explicit transition rules. Only resolve a dispute after the corresponding payment transition succeeds; persist an outbox event for notifications/refunds.

### LP-BE-004 — OAuth state is process-local and deployment configuration is drifted

- **Severity:** HIGH / P0
- **Evidence:** OAuth state `Map` in `src/modules/auth/authController.ts:27-31, 189-243`; Vercel target in frontend `vercel.json:4`; local backend environment inspection found `NODE_ENV=development`, frontend host `localhost`, and a Google callback host different from the Vercel rewrite's Render host.
- **Description:** OAuth state is not shared across instances/restarts. The repository's backend environment configuration is development/local and directs Google callback to a different Render hostname from the frontend proxy target. The actual deployed production variables are not represented or verifiable in version control.
- **Impact:** Google login can fail intermittently or consistently; cookies can be scoped to the callback backend host instead of the frontend/Vercel proxy origin, yielding an apparently successful redirect without a usable session.
- **Fix:** Store OAuth state in Redis with expiry; define one canonical public API/frontend origin; make `GOOGLE_REDIRECT_URI`, frontend API base, Vercel rewrite and CORS all agree; add a non-secret production configuration validation/checklist and execute a real Google OAuth smoke test before launch.

### LP-BE-005 — Socket.IO deployment path is unverified and has no event-level throttling

- **Severity:** MEDIUM / P1
- **Evidence:** Client API base defaults to same-origin production in `src/utils/apiPaths.js:1-6`; server starts Socket.IO in `src/server.ts:4-7`; socket server CORS uses only `env.FRONTEND_URL` in `src/modules/chat/chatSocket.ts:25-28`; no per-socket event limit appears in `chatSocket.ts:44-93`.
- **Description:** HTTP API is routed by a Vercel rewrite to Render, but the repository provides no verified WebSocket proxy/deployment configuration. Socket.IO events can be emitted repeatedly without per-user/event rate controls.
- **Impact:** Messaging may fail in production or be susceptible to typing/message event abuse.
- **Fix:** Test real WebSocket upgrade/connect/send/read from the production frontend host. Use an explicit Socket.IO endpoint if the edge host does not proxy upgrades, and add per-user/per-event rate limits plus monitoring.

### LP-BE-006 — Admin impersonation creates a bearer token and reports an inaccurate expiry

- **Severity:** MEDIUM / P2
- **Evidence:** `src/modules/admin/users/adminUsersService.ts:118-147`.
- **Description:** An API response returns an impersonation bearer access token to the browser, and labels its expiry as `30m` even though `generateAccessToken` defaults to 1,800 seconds only if environment configuration has not changed. No dedicated impersonation scope/session is enforced by `protect`.
- **Impact:** High-value token is exposed to browser context; audit/user-facing expiry can be wrong.
- **Fix:** Implement scoped, separately signed impersonation sessions with exact expiry, a visible banner, mandatory reason, one-time use/revocation, and stricter admin role requirements.

## 7. Database and storage findings

### LP-DB-001 — Migration numbering collisions and no automated migration ledger

- **Severity:** HIGH / P1
- **Evidence:** Duplicate prefixes exist for `005`, `007`, `015`, `016`, `017`, `028`, and `029` under `src/migrations`; no migration runner was found. Production uses manually selected filenames (`.github/workflows/production-migrate.yml:6-8, 104-108`).
- **Description:** Filename ordering is not a migration history. An operator must know dependencies and select every file in correct order. Duplicate version prefixes make the intended sequence ambiguous.
- **Impact:** Schema drift, partial production deployment, missing indexes/tables, and irreproducible environments.
- **Fix:** Adopt a migration tool/history table or implement an append-only runner with checksums, unique monotonic IDs, locking, and CI verification against a clean database. Do not apply production migrations manually tomorrow without a tested ordered manifest and backup/rollback plan.

### LP-DB-002 — Test suite is not isolated from non-test databases

- **Severity:** HIGH / P0
- **Evidence:** `src/__tests__/setup.ts:19-23` connects to the application's `DATABASE_URL` without checking `NODE_ENV` or database name; cleanup is deliberately disabled at `31-45, 76-82`; integration tests create users, e.g. `auth.integration.test.ts:78-105`.
- **Observed run:** The audit ran the backend Jest command once before this was identified. It connected successfully and was then stopped after failures were observed. The suite contains record-creating tests, but the truncated failing run does not prove which mutations, if any, completed. No cleanup was attempted; the target database should be reviewed for records matching the test suite's timestamped `*@test.com` patterns.
- **Impact:** `npm test` can pollute, email from, or potentially damage a production/staging database if its environment is misconfigured. It cannot be safely used as a launch gate.
- **Fix:** Fail fast unless `NODE_ENV=test` and a dedicated allowlisted test database URL is used; provision/reset an ephemeral database in CI; mock email/payment providers; tag and clean fixture data transactionally.

### LP-DB-003 — Storage validation is good but malware scanning/lifecycle proof is absent

- **Severity:** MEDIUM / P2
- **Evidence:** File policy and magic-byte checks at `src/modules/media/mediaService.ts:9-38, 77-147`; S3 bucket policy depends on environment names at `26-38`.
- **Description:** The code checks declared type, byte size, S3 metadata and a small file signature sample. There is no anti-malware scanning, content-disarm/re-encode for images/PDFs, failed-pending-upload cleanup job, or infrastructure-as-code proof that private buckets cannot be read directly.
- **Impact:** Malicious content and abandoned upload objects may persist; bucket privacy cannot be proven from application code alone.
- **Fix:** Add asynchronous malware scanning/quarantine, TTL cleanup for pending/failed objects, security tests, and versioned storage policy/IaC verification.

## 8. Performance and production-readiness findings

### LP-OPS-001 — Backend has no graceful shutdown or process-level failure handlers

- **Severity:** MEDIUM / P1
- **Evidence:** `src/server.ts:1-11` only creates/listens to the HTTP server.
- **Impact:** Deploy/restart can drop active requests/socket connections abruptly; unhandled rejections/exceptions are not visibly managed; PostgreSQL/Redis connections are not drained.
- **Fix:** Add SIGTERM/SIGINT graceful shutdown, server close timeout, pool/Redis close, Socket.IO close, and structured handlers for unhandled rejection/exception with health/readiness semantics.

### LP-OPS-002 — Dependency audit contains material production advisories

- **Severity:** HIGH / P0
- **Evidence:** `npm audit --omit=dev --json` reported **frontend: 9 high, 2 moderate**; **backend: 1 critical, 7 high, 2 moderate**. Backend affected chains include `proxy-addr` (critical), `axios`, `body-parser`, `engine.io`, `follow-redirects`, `multer`, `nodemailer`, `zod`, `ip-address`, and `qs`.
- **Impact:** The backend has a critical advisory in its runtime dependency graph plus multiple externally reachable denial-of-service, request-handling, redirect, and proxy-related advisories.
- **Fix:** Run `npm audit fix` only in a branch, explicitly upgrade/override the root dependency chains, regenerate lockfiles, and rerun tests and security review. Do not waive the critical advisory without a documented reachability assessment and compensating control.

### LP-OPS-003 — Production environment cannot be proven ready from source control

- **Severity:** HIGH / P0
- **Evidence:** Backend local environment is development/local; `environment.ts` requires database, JWT, storage, Paystack, and Google values (`17-171`), but no non-secret production manifest or deployment environment checklist validates their actual Render/Vercel values.
- **Impact:** Deployment can succeed with broken OAuth, email, storage, CORS, cookies, or payment webhooks and no deterministic preflight catches it.
- **Fix:** Establish a deployment preflight that validates non-secret hostnames/config relationships, performs health/readiness checks, and runs authenticated staging smoke tests. Keep secrets outside git.

## 9. Dead code and unused dependencies

- Frontend lint reports a large number of unused imports/variables and missing hook dependencies. These are mostly P2 maintenance work, but a few are tied to stale admin workflows above.
- `src/modules/otp/otpService.ts.backup` is a source backup committed alongside the active implementation. Remove/archive it outside production source after verifying it is not referenced.
- Assignment controller placeholder endpoints are dead/incomplete production API surface, not merely unused code.
- The backend includes `multer` and a local `uploads` directory, but no active `multer`, `express.static`, or local upload route was found under `src`; confirm whether those are obsolete before removing dependencies/artifacts.
- Bundle savings are measurable: route-level code splitting can defer the 3.0 MB admin/dashboard-heavy entry bundle; PDF/XLSX export dependencies are likely a material portion and should not load for ordinary browsing.

## 10. Missing tests

P0/P1 coverage that must be added before launch:

| Area | Required regression test |
|---|---|
| Wallet | Employer cannot directly set/increase balance; provider webhook/ledger credit is idempotent. |
| Token handling | Login, verification, refresh, and OAuth responses never include access/refresh tokens in JSON. |
| Privacy/BOLA | Unrelated authenticated user cannot retrieve email, chat thread/messages, media, application attachment, payment, KYC, or dispute evidence of another user. |
| Payments | Concurrent/retried initiate calls create exactly one active payment; webhook delivery is idempotent; dispute/payment transition is atomic. |
| Admin | Regular employer/professional receives 403 for every admin route; role-specific admin permissions and impersonation scope/revocation are tested. |
| Assignments | List/detail/update/delete either work with ownership enforcement or return 501; never return false success. |
| OAuth | State survives multi-instance/restart; redirect/cookie works from exact production frontend/API hostnames. |
| CSRF/rate limiting | Forged origin requests are rejected; forwarding headers cannot bypass rate limits; limits work across instances. |
| Media | Upload type mismatch, oversize, relationship-based retrieval, signed URL expiry, deletion, pending-upload cleanup, and malware quarantine behavior. |
| Frontend E2E | New registration/OTP, login, password reset, profile edits, media upload, job post/apply/accept/pay, chat, admin verification review, empty/error states, and mobile viewport smoke tests. |

## 11. Executed checks and results

| Check | Result |
|---|---|
| Frontend production build | **Passed.** Vite completed; emitted a >500 kB chunk warning (3.03 MB minified main JS). |
| Frontend lint | **Completed with warnings.** Many unused-variable/import and hook-dependency warnings; no lint failure. |
| Frontend tests | **Passed: 76/76.** These are predominantly static/service-contract tests, not a live backend E2E suite. |
| Backend TypeScript build | **Passed.** |
| Backend lint | **Passed.** |
| Backend Jest | **Failed.** Broad failures begin in setup because tests submit old signup payloads without `passwordConfirm` and expect immediate cookies/auth before email OTP verification. Search integration setup then dereferences missing signup results. The suite also is unsafe to run without an isolated test DB. |
| Frontend runtime dependency audit | **11 advisories:** 9 high, 2 moderate. |
| Backend runtime dependency audit | **10 advisories:** 1 critical, 7 high, 2 moderate. |

## 12. Prioritized remediation plan

### P0 — Must fix before launch

1. Remove/directly disable `POST /api/wallet` and `PUT /api/wallet`; implement payment-webhook-driven immutable accounting.
2. Stop returning access/refresh JWTs to browser JavaScript; rotate existing sessions/secrets after deployment.
3. Remove email from chat lookup/directory responses and require a relationship for any private lookup.
4. Resolve and retest the critical/high runtime dependency advisories; do not ship known-critical `proxy-addr` chain unresolved.
5. Establish/verify one canonical production hostname setup for Vercel rewrite, Render API, CORS, cookies, and Google OAuth callback; perform real OAuth and cookie-session smoke tests.
6. Disable or repair placeholder assignment operations and KYC/admin mock review interfaces.
7. Make test execution fail closed unless it targets a dedicated disposable test database. Review the database used by the audit test run for any timestamped test records before launch.
8. Produce a deterministic migration manifest/run history and verify a clean production-like database can migrate successfully.

### P1 — Should fix before launch

1. Add payment idempotency and transactional payment/dispute transitions.
2. Fix proxy-aware distributed rate limiting and add Socket.IO event throttling.
3. Add CSRF protection/unsafe-method Origin validation for cross-site cookie operation.
4. Add graceful shutdown, readiness checks, monitored background/outbox processing, and webhook retry correctness.
5. Remove seeded admin fallbacks and hard-coded filter/pagination controls.
6. Split the frontend bundle and optimize large images.
7. Replace backend test fixtures/contracts and build a safe staging E2E suite.

### P2 — Fix after launch

1. Resolve all frontend lint warnings and stale hook dependencies.
2. Remove backups, dead dependencies, console logging, unused imports, and imperative `innerHTML` fallback.
3. Add malware scanning and object lifecycle cleanup for storage.
4. Refine admin impersonation into a scoped/revocable audited capability.

### P3 — Future improvements

1. Formal threat modeling and periodic BOLA/IDOR penetration testing.
2. Database query plans, index review from production telemetry, and load testing.
3. Observability dashboards for payment, upload, OAuth, queue and Socket.IO failure rates.

## 13. Launch readiness scorecard

| Area | Score /10 | Justification |
|---|---:|---|
| Authentication and authorization | 3 | Strong primitives exist, but JWTs are exposed in JSON, active-user state is not checked per request, and CSRF defense is absent. |
| API security | 3 | Parameterized queries/validation are common, but wallet manipulation, email disclosure, rate-limit weaknesses and dependency advisories are material. |
| User journeys | 4 | Basic flows exist, but assignment endpoints falsely succeed and high-value payment/OAuth paths are not safely E2E verified. |
| Frontend functionality | 5 | Build/tests pass, but admin mock/fallback screens and many stale-hook warnings remain. |
| Backend reliability | 3 | Build/lint pass and some transactions exist, but payments/disputes are not consistently atomic; Jest is broken and unisolated. |
| Database integrity | 3 | Some transactions and constraints are used, but migration process is manual/ambiguous and test isolation is unsafe. |
| Performance | 4 | Main bundle is 3 MB minified; no load-test evidence. |
| Mobile responsiveness | 5 | Responsive classes are present, but no real mobile/browser smoke run was performed. |
| Error handling | 5 | Central handler exists, but webhook swallows errors/retries and placeholder endpoints give success responses. |
| Deployment configuration | 2 | Hostname/OAuth environment drift is visible; production values cannot be verified from the repository. |
| Monitoring and observability | 4 | Winston/audit logging exists, but no proven error monitoring, payment reconciliation queue, alerts, or readiness instrumentation. |

**Overall: 3.7/10 — not production-ready.**

## Appendix: limitations and verification boundaries

- This was a source/configuration audit. It did not send payments, emails, OAuth requests, storage uploads, or destructive database operations.
- Backend Jest was started once under the repository's current environment before its unsafe database setup was discovered and was not repeated. It may have written test records; inspect and remove only clearly identified test records in the target database using an approved, scoped procedure.
- Deployed Render/Vercel/Supabase/Paystack settings, database schema state, bucket policy, and network behavior were not available for direct inspection; findings about those settings distinguish code/config evidence from deployment-state confirmation.
