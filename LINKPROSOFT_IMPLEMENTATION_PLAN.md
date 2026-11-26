# LinkProSoft Implementation Plan

**Plan date:** 2026-11-24  
**Completion target:** 2026-11-30  
**Primary source:** [LINKPROSOFT_FRONTEND_AUDIT_REPORT.md](./LINKPROSOFT_FRONTEND_AUDIT_REPORT.md)  
**Scope:** Planning and task sequencing only. No application source, backend, environment, package, or dependency changes are included.

## 1. Executive Summary

The frontend is feature-rich but not release-ready. The P0 signup OTP and public professional jobs blockers have been implemented. Reset-code verification/resend now follow the confirmed backend contract; broader authentication verification, employer job selection, and backend response consistency remain.

The work is split into:

- Frontend bug fixes and missing UI flows.
- Backend-dependent integrations.
- Joint frontend/backend contract and runtime verification.
- UI, accessibility, and responsive verification.
- Regression and end-to-end testing.

The November 30 target is achievable for critical blockers and a focused subset of P1 work, provided backend developers respond promptly with canonical API contracts. Admin finance, static data replacement, settings persistence, subscriptions, and lower-priority polish may need deferral if backend endpoints or payment/test environments are unavailable.

## 2. Current Project State

The audit found substantial implementation across:

- React/Vite routing and role guards.
- Cookie-backed authentication and protected routes.
- Professional, employer, and admin dashboards.
- Profile, portfolio, skills, certification, verification, wallet, messaging, dispute, and admin UI.
- Shared API path and Axios service modules.

However, release-critical gaps remain:

- Signup OTP navigation references unavailable values.
- Public jobs are generated mock data.
- Reset-code verification reports success for a backend `404`.
- Settings and subscriptions contain local-state or toast-only behavior.
- Admin settings and several finance/dispute views contain static data.
- Backend response contracts have not been fully verified against runtime behavior.
- No complete end-to-end test suite is evidenced.

## 3. Implementation Objectives

1. Remove confirmed P0 blockers in authentication and public discovery.
2. Establish verified backend contracts for authentication, jobs, applications, messaging, verification, wallet, payments, disputes, and admin operations.
3. Complete real frontend submissions and replace misleading success fallbacks.
4. Replace required mock or static data with live API data.
5. Complete missing account and navigation functionality.
6. Make loading, error, empty, and success behavior consistent.
7. Verify desktop, tablet, and mobile behavior.
8. Add measurable testing for critical journeys.
9. Document any work deferred because of backend or product dependencies.

## 4. Master Outstanding Task Register

### Priority and category summary

| Category | P0 | P1 | P2 | P3 | Total |
|---|---:|---:|---:|---:|---:|
| AUTH | 1 | 2 | 0 | 0 | 3 |
| FIX | 1 | 2 | 1 | 0 | 4 |
| INT | 1 | 7 | 2 | 0 | 10 |
| FEAT | 0 | 5 | 3 | 1 | 9 |
| UI | 0 | 0 | 2 | 1 | 3 |
| TEST | 0 | 2 | 2 | 0 | 4 |
| FORM | 0 | 2 | 1 | 0 | 3 |
| **Total** | **3** | **20** | **11** | **2** | **36** |

### Master task table

| Task ID | Feature | Description | Audit reference | File paths | Category | Priority | Dependencies | Implementation requirements | Acceptance criteria | Responsible party | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FIX-001 | Signup OTP success | Repair OTP completion navigation and resend behavior. | Executive Summary 1; Section 4 Signup; Section 5 | [src/pages/auth/SignupPage.jsx](./src/pages/auth/SignupPage.jsx:75), [src/api/services/authService.js](./src/api/services/authService.js), [src/context/PreLoaderContext.jsx](./src/context/PreLoaderContext.jsx) | FIX | P0 | AUTH-002 resend contract | Import/use preloader only if needed; navigate using the authenticated verified user/role; call the existing resend OTP service or implement only after backend confirmation. | A valid OTP closes the verification step and navigates to the verified role dashboard; invalid OTP stays on the step with error feedback; resend invokes the backend or is disabled until a confirmed contract exists. | Frontend; backend only for resend | Not started |
| INT-001 | Public jobs | Replace generated mock jobs with live public job listings. | Executive Summary 2; Sections 4, 7 | [src/pages/professional/PublicProfessionalScreen.jsx](./src/pages/professional/PublicProfessionalScreen.jsx), [src/api/services/jobService.js](./src/api/services/jobService.js), [backend job routes](../umarks/Linprosoft-Backend/src/modules/jobs/jobRoutes.ts) | INT | P0 | Confirmed public jobs contract | Use `GET /api/jobs`, normalize response envelopes, and support server filters/pagination with loading, empty, and error states. The backend route returns only public posted jobs. | Browser smoke test verifies live response rendering, filters, pagination, and error/empty states. | Frontend + backend | Completed (2026-11-26) |
| INT-002 | Public search contract | Confirm public professional/job search endpoint behavior. | Executive Summary 5; Section 6 | [src/utils/apiPaths.js](./src/utils/apiPaths.js), [src/api/services/searchService.js](./src/api/services/searchService.js), [src/pages/buyer/PublicBuyerScreen.jsx](./src/pages/buyer/PublicBuyerScreen.jsx) | INT | P0 | Backend route confirmation | Document the public endpoint, method, query parameters, response envelope, pagination, and authentication requirements. | A backend-constrained contract table exists and both public search pages use only verified fields and responses. | Backend + frontend | Blocked |
| AUTH-001 | Reset password | Remove the reset-code `404` success fallback and standardize reset payload/resend behavior. | Executive Summary 4; Sections 4, 6, 9 | [src/api/services/authService.js](./src/api/services/authService.js), [src/pages/auth/LoginPage.jsx](./src/pages/auth/LoginPage.jsx) | AUTH | P1 | Backend reset routes | Fail on real `404` or route outage; resend uses `POST /api/auth/resend-otp` with `purpose: "password_reset"`; reset payload matches backend. | Invalid/unavailable reset code does not advance to password entry; resend uses the confirmed endpoint; reset token is passed to the password reset request. | Frontend + backend | Completed (2026-11-26) |
| AUTH-002 | Auth contract | Confirm canonical signup, login, OTP, resend, reset, `/me`, logout, refresh, and Google callback contracts. | Section 6; Section 8 | [src/api/services/authService.js](./src/api/services/authService.js), [src/store/authStore.js](./src/store/authStore.js), [src/utils/cookieSession.js](./src/utils/cookieSession.js), [src/pages/auth/GoogleCallbackPage.jsx](./src/pages/auth/GoogleCallbackPage.jsx) | AUTH | P1 | Backend documentation/runtime verification | Compare payload and response fields, cookie behavior, nonce/state handling, and role values. | Contract matrix for auth is confirmed; valid flows work and invalid/expired sessions are handled consistently. | Backend + frontend | Blocked |
| AUTH-003 | Session and role routing | Verify refresh, 401, role guard, OAuth callback, and unauthorized-role behavior. | Sections 4, 8, 10 | [src/App.jsx](./src/App.jsx), [src/routes/PrivateRoutes.jsx](./src/routes/PrivateRoutes.jsx), [src/store/authStore.js](./src/store/authStore.js), [src/utils/getDashboardRoute.js](./src/utils/getDashboardRoute.js) | AUTH | P1 | AUTH-002 | Test session restoration and route transitions; consider role-specific redirect instead of public landing on wrong-role access. | Reload restores the session; unauthorized/expired users are redirected predictably; wrong-role access is tested and no protected data renders. | Frontend + backend | Not started |
| FIX-002 | Employer selected job | Remove the hardcoded `ORD657783` fallback and require valid navigation state. | Executive Summary; Sections 4, 5, 7 | [src/pages/employer/EmployerDashboardPage.jsx](./src/pages/employer/EmployerDashboardPage.jsx:20) | FIX | P1 | INT-004 job detail contract | Initialize no selected job or derive it from route/navigation state; render an explicit empty/error state when absent. | Opening a real job loads that ID only; direct or missing job selection never displays a fallback unrelated job. | Frontend | Not started |
| FIX-003 | Silent project API failures | Replace silent empty-array fallbacks with distinguishable loading/error/empty behavior. | Section 12 | [src/api/services/projectService.js](./src/api/services/projectService.js), [src/store/dashboardStore.js](./src/store/dashboardStore.js) | FIX | P1 | INT-003; INT-004 | Preserve thrown errors or expose a structured error response instead of always returning `[]`; update dashboard consumers. | Network/server failures display retry/error UI; genuinely empty responses display empty UI. | Frontend | Not started |
| FEAT-001 | Public 404/trending | Add a real `/trending` route or remove the trending link and add a 404 route. | Sections 4, 5, 13 | [src/pages/buyer/PublicBuyerScreen.jsx](./src/pages/buyer/PublicBuyerScreen.jsx), [src/App.jsx](./src/App.jsx) | FEAT | P1 | INT-002; route decision | Implement the product-approved behavior; do not introduce an invented endpoint. | The existing public navigation never opens an unregistered route; unknown paths show intentional not-found UI. | Frontend; backend only if trending is retained | Not started |
| INT-003 | Public/pro profile search | Verify public professional search and profile APIs and normalize data shapes. | Section 6; Section 10 | [src/pages/buyer/PublicBuyerScreen.jsx](./src/pages/buyer/PublicBuyerScreen.jsx), [src/pages/professional/PublicProfessionalProfile.jsx](./src/pages/professional/PublicProfessionalProfile.jsx), [src/api/services/searchService.js](./src/api/services/searchService.js), [src/api/services/profileService.js](./src/api/services/profileService.js) | INT | P1 | INT-002; profile contract | Confirm response fields and update loading/profile navigation behavior. | Search results navigate to existing public profiles; empty/error/loading states and profile contact actions are correct. | Frontend + backend | Blocked |
| INT-004 | Job/application lifecycle | Verify job CRUD, matches, applications, and accept-and-fund contracts. | Sections 6, 10 | [src/api/services/jobService.js](./src/api/services/jobService.js), [src/api/services/projectService.js](./src/api/services/projectService.js), [src/pages/employer/PostJobWizard.jsx](./src/pages/employer/PostJobWizard.jsx), [src/pages/professional/JobApplicationPage.jsx](./src/pages/professional/JobApplicationPage.jsx) | INT | P1 | Backend status/unit/response confirmation | Normalize status enums and response envelopes; add retry/error/success handling. | Post, browse, apply, view matches, and accept/fund flows complete in test mode or are blocked by documented missing backend capability. | Frontend + backend | Blocked |
| INT-005 | Profile and media | Verify profile CRUD, media, portfolio, certification, skill, and slug contracts. | Sections 6, 8, 9 | [src/api/services/profileService.js](./src/api/services/profileService.js), [src/api/services/mediaService.js](./src/api/services/mediaService.js), [src/pages/professionals/ProfileSubpage.jsx](./src/pages/professionals/ProfileSubpage.jsx), [src/pages/employer/EmployerProfileSubpage.jsx](./src/pages/employer/EmployerProfileSubpage.jsx) | INT | P1 | AUTH-002; backend profile/media contract | Define payload fields and response envelopes; verify rollback and stale state. | Profile updates and each media/portfolio/certification/skill action reflect the persisted backend state after reload. | Frontend + backend | Blocked |
| INT-006 | Messaging | Verify threads, messages, read state, approved contacts, accept/decline, attachments, and socket auth. | Sections 6, 10 | [src/api/services/messagingService.js](./src/api/services/messagingService.js), [src/store/messagingStore.js](./src/store/messagingStore.js), [src/hooks/useMessaging.js](./src/hooks/useMessaging.js), [src/components/messages/](./src/components/messages) | INT | P1 | Auth and messaging backend contracts | Remove placeholder behavior and verify socket lifecycle, pagination, read state, and media. | Send/read/accept/decline/attachment flows work for approved users and reject unauthorized or unapproved attempts. | Frontend + backend | Blocked |
| INT-007 | Notification/schedule | Verify notifications, read state, and dashboard schedules. | Sections 6, 10 | [src/api/services/notificationService.js](./src/api/services/notificationService.js), [src/pages/NotificationsPage.jsx](./src/pages/NotificationsPage.jsx), [src/store/dashboardStore.js](./src/store/dashboardStore.js) | INT | P1 | Notification/schedule contracts | Normalize response fields and confirm mark-read behavior and polling/socket requirements. | Real notifications and schedules display; mark-read and filters update the UI correctly. | Frontend + backend | Blocked |
| INT-008 | Verification | Complete identity, professional, face, bank/payment, document, preview, and status flows. | Sections 4, 6, 9, 10 | [src/api/services/verificationService.js](./src/api/services/verificationService.js), [src/api/services/mediaService.js](./src/api/services/mediaService.js), [src/pages/verification/VerificationPage.jsx](./src/pages/verification/VerificationPage.jsx), [src/components/verification/](./src/components/verification) | INT | P1 | Backend verification/media contract | Trace every modal submission; use real API calls and persist status; remove toast-only success. | Each supported pathway submits valid test data and shows persisted status/error/loading/success feedback. | Frontend + backend | Blocked |
| INT-009 | Wallet/payment/escrow | Verify wallet history, initiate/verify, and escrow UI semantics. | Sections 6, 10 | [src/api/services/walletService.js](./src/api/services/walletService.js), [src/pages/professionals/WalletSubpage.jsx](./src/pages/professionals/WalletSubpage.jsx), [src/pages/buyer/PaymentScreen.jsx](./src/pages/buyer/PaymentScreen.jsx) | INT | P0 for payments release | Backend/payment test mode; AUTH-002 | Confirm endpoints, amount units, status values, and test-provider behavior. | Test-mode payment updates only test state and shows real backend status; no mock success is presented. | Frontend + backend/payment owner | Blocked |
| INT-010 | Dispute evidence | Verify dispute creation, evidence upload/download, links, and escrow values. | Sections 6, 7, 10 | [src/api/services/disputeService.js](./src/api/services/disputeService.js), [src/pages/employer/EmployerOpenDisputeSubpage.jsx](./src/pages/employer/EmployerOpenDisputeSubpage.jsx), [src/pages/professionals/ProjectDetailsSubpage.jsx](./src/pages/professionals/ProjectDetailsSubpage.jsx) | INT | P1 | Media contract; selected job contract | Replace static job/balance text and trace submissions. | A real selected job and live remaining escrow are used; evidence is uploaded and returned by backend. | Frontend + backend | Blocked |
| INT-011 | Admin operations | Verify overview, users, jobs, verification, disputes, and status/mutation contracts. | Sections 4, 6 | [src/api/services/adminService.js](./src/api/services/adminService.js), [src/pages/admin/](./src/pages/admin) | INT | P1 | Backend admin routes/permissions | Replace response assumptions as needed and verify action refresh behavior. | Admin actions perform only in test/backend environment and UI reflects persisted state after reload. | Frontend + backend | Blocked |
| INT-012 | Admin finance | Replace static and fallback finance/dispute/payout/refund data with live admin APIs. | Sections 4, 6, 7 | [src/pages/admin/AdminPaymentsSubpage.jsx](./src/pages/admin/AdminPaymentsSubpage.jsx), [src/pages/admin/components/finance/](./src/pages/admin/components/finance), [src/pages/admin/AdminDisputesSubpage.jsx](./src/pages/admin/AdminDisputesSubpage.jsx) | INT | P1 | INT-011; admin finance contracts | Integrate all relevant metrics, tables, actions, exports, and detail views. | No static rows/stat totals remain in release-critical finance/dispute views; live empty/error/loading states appear. | Frontend + backend | Blocked |
| FEAT-002 | Account settings | Implement password change, linked accounts, and account action feedback. | Sections 5, 8, 13 | [src/pages/SettingsSubpage.jsx](./src/pages/SettingsSubpage.jsx) | FEAT | P1 | AUTH-002; backend account/provider decisions | Remove “not available” placeholders for in-scope features; link to approved routes or APIs. | Password and in-scope account-provider actions work or are documented as unavailable and removed from UI. | Frontend + backend | Not started |
| FEAT-003 | Legal pages | Add privacy and terms routes/content or approved external links. | Sections 5, 13 | [src/pages/SettingsSubpage.jsx](./src/pages/SettingsSubpage.jsx), [src/App.jsx](./src/App.jsx) | FEAT | P2 | Product/legal approval | Add only approved content or external destinations. | Both settings controls open accessible privacy/terms destinations with no placeholder toast. | Frontend/product | Not started |
| FEAT-004 | Notification preferences | Persist push and email settings. | Sections 5, 8 | [src/pages/SettingsSubpage.jsx](./src/pages/SettingsSubpage.jsx) | FEAT | P1 | Backend preference endpoint or explicit local-only product decision | Add API-backed state and loading/error feedback. | Preferences survive reload and reflect backend/account state. | Frontend + backend | Blocked |
| FEAT-005 | Subscription | Replace Pro/free toast behavior with real payment/subscription state. | Sections 5, 7, 13 | [src/pages/professionals/PremiumSubpage.jsx](./src/pages/professionals/PremiumSubpage.jsx:30) | FEAT | P1 | INT-009; backend subscription contract | Integrate activate/renew/cancel and badge state only if endpoints exist. | Selecting free/pro persists the intended state; no fake payment success appears. | Frontend + backend/payment owner | Blocked |
| FEAT-006 | Employer invitations | Replace invitation toast-only behavior with real request dispatch. | Section 5 | [src/pages/employer/EmployerBrowseProfessionalsSubpage.jsx](./src/pages/employer/EmployerBrowseProfessionalsSubpage.jsx:396), [src/pages/employer/EmployerJobDetailsSubpage.jsx](./src/pages/employer/EmployerJobDetailsSubpage.jsx:132) | FEAT | P1 | Approved invitation/contact endpoint | Submit a real approved payload and reflect returned state. | Invitation success/error and duplicate state come from backend response. | Frontend + backend | Blocked |
| FEAT-007 | Admin settings | Persist commission, payout, session, verification, and admin lifecycle settings. | Sections 4, 5, 7 | [src/pages/admin/AdminSettingsSubpage.jsx](./src/pages/admin/AdminSettingsSubpage.jsx:37), [src/pages/admin/components/finance/FinanceCommissionTab.jsx](./src/pages/admin/components/finance/FinanceCommissionTab.jsx) | FEAT | P1 | Backend admin settings/endpoints | Remove local-only state and static admin list; integrate approved endpoints. | Reload shows persisted configuration and admin records; add/delete/update calls persist. | Frontend + backend | Blocked |
| FEAT-008 | Admin announcement | Distinguish saved drafts from sent/published announcements. | Section 5 | [src/pages/admin/components/overview/SendAnnouncementModal.jsx](./src/pages/admin/components/overview/SendAnnouncementModal.jsx) | FEAT | P2 | Admin announcement contract | Implement send/draft semantics and backend response handling. | User actions persist the intended status and invalid submissions show validation. | Frontend + backend | Blocked |
| FEAT-009 | Static marketing/community | Explicitly classify static content and integrate only areas identified as live. | Section 7 | [src/pages/CommunityPage.jsx](./src/pages/CommunityPage.jsx), [src/components/landing/](./src/components/landing), [src/pages/Waitlist.jsx](./src/pages/Waitlist.jsx) | FEAT | P3 | Product/CMS decision | Keep legitimate static marketing until a CMS/API requirement is confirmed. | Audit labels static areas accurately and no live-looking data is presented as backend-driven. | Frontend/product | Not started |
| FORM-001 | Auth validation | Correct signup/login/reset form validation and submit feedback. | Sections 9, 12 | [src/components/auth/components/SignupForm.jsx](./src/components/auth/components/SignupForm.jsx), [src/components/auth/components/LoginForm.jsx](./src/components/auth/components/LoginForm.jsx), [src/components/auth/components/ForgotPassword.jsx](./src/components/auth/components/ForgotPassword.jsx) | FORM | P1 | AUTH-001; AUTH-002 | Verify required fields, password rules, reset code, loading, error, success, and duplicate submission behavior. | Invalid values cannot submit; server validation is shown; successful submissions produce one measurable state transition. | Frontend + backend for messages | Not started |
| FORM-002 | Profile/job/verification forms | Audit and standardize submission payload, validation, loading, reset, and error behavior. | Section 9 | [src/pages/professionals/ProfileSubpage.jsx](./src/pages/professionals/ProfileSubpage.jsx), [src/pages/employer/PostJobWizard.jsx](./src/pages/employer/PostJobWizard.jsx), [src/pages/verification/VerificationPage.jsx](./src/pages/verification/VerificationPage.jsx) | FORM | P1 | INT-004; INT-005; INT-008 | Normalize payload names and state; prevent duplicate submit; preserve errors and reset only after success. | Required fields are enforced, payloads match contract, and success/error/loading states are verified. | Frontend + backend | Blocked |
| FORM-003 | Admin and dispute forms | Verify validation and result handling for arbitration, evidence, payouts, refunds, and status updates. | Section 9 | [src/pages/admin/components/](./src/pages/admin/components), [src/pages/employer/EmployerOpenDisputeSubpage.jsx](./src/pages/employer/EmployerOpenDisputeSubpage.jsx) | FORM | P2 | INT-010; INT-011; INT-012 | Confirm destructive-action confirmations and server feedback. | Invalid submissions remain actionable; successful mutations refresh or update the source state. | Frontend + backend | Blocked |
| UI-001 | Dashboard/loading states | Standardize loading, error, empty, and retry behavior across dashboard subpages. | Sections 11, 12 | [src/layouts/DashboardLayout.jsx](./src/layouts/DashboardLayout.jsx), [src/store/dashboardStore.js](./src/store/dashboardStore.js), [src/components/common/preloader/](./src/components/common/preloader) | UI | P2 | FIX-003; integrations | Remove overly long or fixed skeleton behavior where not required and expose API errors. | Each subpage has loading, success, empty, and error states or an intentional skeleton-only exception. | Frontend | Not started |
| UI-002 | Responsive/accessibility | Perform desktop, tablet, mobile, keyboard, focus, label, overflow, and contrast verification. | Sections 11, 12 | All route/layout/page components; priority [src/layouts/DashboardLayout.jsx](./src/layouts/DashboardLayout.jsx), [src/components/layout/](./src/components/layout) | UI | P2 | Critical feature stabilization | Fix reproducible overflow/clipping and focus/label issues; do not change source until defects are recorded. | Core journeys pass 360 px, tablet, and desktop smoke checks; icon controls have accessible names and keyboard operation. | Frontend + QA | Not started |
| UI-003 | Static visual assets | Verify fixed assets, missing images, and public placeholders. | Section 11 | [public/](./public), [src/layouts/](./src/layouts), [src/components/](./src/components) | UI | P3 | UI-002 | Identify broken/missing assets and replace or remove only confirmed defects. | No confirmed broken assets appear in core routes. | Frontend/design | Not started |
| TEST-001 | Build/lint/unit baseline | Restore local execution environment and run existing build, lint, and Node tests. | Section 12 | [package.json](./package.json), [tests/](./tests) | TEST | P1 | PowerShell/toolchain available | Run existing scripts; add no dependencies unless explicitly required. | `npm run build`, `npm run lint`, and `npm test` complete with reported failures traced to source. | Frontend/QA | Blocked |
| TEST-002 | Critical auth/E2E | Test signup, OTP, resend, login, Google callback, reset, logout, role guards, and reload. | Sections 10, 12 | [src/pages/auth/](./src/pages/auth), [src/routes/PrivateRoutes.jsx](./src/routes/PrivateRoutes.jsx) | TEST | P1 | FIX-001; AUTH-001; AUTH-002; AUTH-003 | Add or run test cases against test backend only. | The auth matrix passes and unauthorized/expired routes are confirmed. | Frontend + backend + QA | Blocked |
| TEST-003 | Core journey E2E | Test public search, profile, job post/browse/apply, project, messaging, wallet, verification, and disputes. | Section 10 | [src/pages/](./src/pages), [src/components/](./src/components), [tests/](./tests) | TEST | P2 | INT-003 through INT-010 | Use test accounts and test-mode payment resources. | Core role journeys pass end-to-end and produce no real destructive transaction. | Frontend + backend + QA | Blocked |
| TEST-004 | Admin and regression | Test admin metrics/actions and run browser regression for all routes/subpages. | Sections 10, 11 | [src/pages/admin/](./src/pages/admin), [src/App.jsx](./src/App.jsx) | TEST | P2 | INT-011; INT-012 | Use isolated admin/test data; verify export and mutation responses. | Admin route matrix and action matrix pass without live or destructive operations. | Frontend + backend + QA | Blocked |

## 5. P0 and P1 Critical Tasks

### P0

- **FIX-001:** Repair signup OTP navigation and resend.
- **INT-002:** Confirm public search endpoint contract.
- **INT-009:** Complete or explicitly defer real payment/escrow; treat as P0 because it blocks a payment-producing release.

### P1

- Authentication reset/session contracts.
- Employer selected-job correctness.
- Silent dashboard API failure handling.
- `/trending` or 404 routing.
- Public profile/search, jobs/applications, profile/media, messaging, notifications, verification, disputes, and admin operations.
- Settings, notification preferences, subscription, employer invitations, and admin settings.
- Auth/form/build/testing baseline.

## 6. Implementation Phases

### Phase 1: Critical integration blockers

1. AUTH-002 — confirm auth contract.
2. FIX-001 — repair signup OTP.
3. AUTH-001 — correct reset fallback.
4. AUTH-003 — verify sessions and roles.
5. INT-002 — confirm public search contract.
6. INT-001 — replace public mock jobs. **Completed 2026-11-26.**
7. FIX-002 — remove hardcoded employer job ID.

### Phase 2: Core functionality completion

1. INT-004 — job/application lifecycle.
2. INT-005 — profile/media.
3. INT-006 — messaging.
4. INT-008 — verification.
5. INT-010 — disputes/evidence.
6. INT-009 — wallet/payments/escrow.
7. FEAT-006 — real invitations.
8. FORM-001 and FORM-002 — submission validation.

### Phase 3: Dynamic data and consistency

1. FIX-003 — structured API failure handling.
2. INT-007 — notifications/schedules.
3. INT-011 and INT-012 — admin data/actions.
4. FEAT-004 — notification preferences.
5. FEAT-007 — admin settings.
6. FEAT-005 — subscriptions.
7. UI-001 — loading/error/empty/success consistency.

### Phase 4: Secondary functionality

1. FEAT-001 — trending/not-found.
2. FEAT-002 — account settings.
3. FEAT-003 — legal destinations.
4. FEAT-008 — announcement semantics.
5. FORM-003 — admin/dispute form handling.
6. FEAT-009 — static content classification.

### Phase 5: UI refinement and responsiveness

1. UI-002 — responsive and accessibility.
2. UI-001 — dashboard states.
3. UI-003 — assets.

### Phase 6: Testing and final verification

1. TEST-001 — build/lint/unit baseline.
2. TEST-002 — auth journey.
3. TEST-003 — core role journeys.
4. TEST-004 — admin and regression.

## 7. Frontend Task Breakdown

Frontend work that can proceed independently:

- FIX-001, FIX-002, FIX-003.
- FEAT-001 after deciding `/trending` behavior.
- FEAT-003.
- UI-001, UI-002, UI-003.
- Remove mock/static UI once backend response shapes are supplied.
- Normalize service responses and add loading/error/empty handling.
- Add route tests and component test coverage.
- Standardize form validation and duplicate-submission protection.

Frontend work should wait or proceed with feature flags until backend contracts are available:

- Public live jobs.
- Profile/media contract-dependent fields.
- Messaging.
- Verification.
- Wallet/payments/escrow.
- Disputes.
- Admin mutation screens.
- Notification preferences.
- Subscriptions.
- Settings persistence.
- Admin announcement/invitation behavior.

## 8. Backend Dependency Register

| Dependency | Required backend functionality | Verified endpoint from frontend source | Frontend-independent work |
|---|---|---|---|
| Auth | Canonical signup/login/OTP/resend/reset `/me`/logout/callback behavior | Auth paths in [src/utils/apiPaths.js](./src/utils/apiPaths.js) | Repair handler state and add route test cases |
| Public jobs/search | Public discovery query, response and pagination | `/api/search/professionals`, `/api/jobs`, `/api/search/filters`, `/api/search/skills` | Remove mock data and prepare normalization UI |
| Profiles | Canonical profile/media/portfolio/certification/skill contracts | `/api/profiles...`, `/api/media...`, `/api/skills...` | Improve form state and loading UI |
| Jobs/applications | Status values, job payload, application payload, match/accept/fund rules | `/api/jobs...`, `/api/applications...`, `/api/assignments...` | Correct fallback job selection and submission UX |
| Messaging | Thread eligibility, approved contacts, payload, socket auth | `/api/chat...` | Build socket cleanup and UI states |
| Notifications | Notification/schedule envelope and read semantics | `/api/notifications...` | Build filter/read UI and retry states |
| Verification | Identity/professional/face/payment/preview statuses and document fields | `/api/verification...` | Create shared submission/error components |
| Wallet/payment | Wallet/history/initiate/verify/escrow status and units | `/api/wallet`, `/api/payments...` | Remove mock fallback presentation and add test-mode guards |
| Disputes | Evidence, link and remaining escrow contracts | `/api/disputes...` | Replace static selected-job/escrow values |
| Admin | Dashboard, user, job, dispute, finance and settings contracts | `/api/admin...` | Improve tables/forms and loading/error states |
| Subscription | Activate/renew/cancel and badge state | No dedicated frontend service currently known | Build plan UI shell only after contract decision |
| Password/provider accounts | Password change and linked-provider lifecycle | No confirmed frontend endpoints | Do not expose fake controls until backend capability exists |

## 9. Joint Integration Tasks

The following require frontend and backend coordination:

- AUTH-001, AUTH-002, AUTH-003.
- INT-001 through INT-012.
- FEAT-004 through FEAT-008.
- FORM-001 through FORM-003.
- TEST-002 through TEST-004.

For every joint task:

1. Confirm endpoint and HTTP method.
2. Confirm request and canonical response fields.
3. Confirm test accounts and test-only operations.
4. Implement frontend mapping and error states.
5. Verify reload and role behavior.
6. Add a focused test.

## 10. Task Dependency Map

### Critical chain

`AUTH-002 -> FIX-001 -> TEST-002`

`AUTH-002 -> AUTH-001 -> TEST-002`

`AUTH-002 -> AUTH-003 -> TEST-002`

`INT-002 -> INT-001 -> INT-003 -> TEST-003`

`INT-002 -> FIX-003 -> UI-001`

### Core feature chains

`INT-004 -> FIX-002 -> INT-010 -> TEST-003`

`INT-005 -> Profile journey -> TEST-003`

`INT-008 -> Verification journey -> TEST-003`

`INT-006 -> Messaging journey -> TEST-003`

`INT-009 -> FEAT-005 -> TEST-003`

`INT-011 -> INT-012 -> FEAT-007 -> TEST-004`

### Parallel work

Frontend can proceed in parallel on:

- FIX-001 and FIX-002.
- FEAT-001 after route decision.
- FEAT-003.
- UI-001, UI-002, and UI-003.
- TEST-001.
- Form state and validation refactoring that does not alter API contracts.

Backend can proceed in parallel on:

- Auth contract.
- Public search contract.
- Profile/media contract.
- Messaging contract.
- Verification contract.
- Payment/subscription contract.
- Admin and settings contract.

## 11. Seven-Day Critical Completion Schedule

### November 24

- Complete audit-to-plan sign-off.
- Begin AUTH-002 contract review.
- Begin FIX-001 OTP repair.
- Begin FIX-002 job fallback removal.
- Run TEST-001 tooling checks.

### November 25

- Confirm auth and public search contracts.
- Complete FIX-001 and AUTH-001.
- Start INT-001 public job replacement.
- Document payment and backend test-mode availability.

### November 26

- Complete INT-001 and INT-002.
- Complete FIX-002 and FIX-003.
- Start INT-004 and INT-005.
- Add initial TEST-002 cases.

### November 27

- Complete core job/application and profile/media integrations.
- Start INT-006, INT-007, and INT-008.
- Remove confirmed P0 UI fallbacks.

### November 28

- Verify messaging, notifications, verification, and disputes.
- Complete critical form validation.
- Start UI-002 core-route smoke checks.
- Run build/lint/test baseline.

### November 29

- Stabilize defects found in critical journeys.
- Complete test-mode wallet/payment verification only if backend/test provider is ready.
- Defer unsupported settings/subscription/admin work if backend endpoints are absent.

### November 30

- Run final auth/core journey regression.
- Produce a concise remaining limitation list.
- Mark completed P0/P1 tasks.
- Move unsupported P1/P2 items to the post-November 30 plan.

### Realistically achievable scope

**Critical completion scope:**

- OTP/reset/session fixes.
- Live public discovery if backend public endpoint is confirmed.
- Job fallback removal.
- Public search/profile stabilization.
- Core build/test baseline.

**Important deferrable work:**

- Admin settings and static admin finance replacement.
- Subscription activation.
- Linked accounts.
- Announcement semantics.
- Full verification/messaging/payment runtime verification if contracts/test environments are missing.

**Post-completion improvements:**

- Accessibility polish beyond critical keyboard failures.
- Legal/CMS integration.
- Static marketing classification.
- Broad visual regression suite.

## 12. Post-November 30 Improvement Plan

1. Complete unverified verification, messaging, wallet, payment, dispute, and admin journeys.
2. Replace all static payout/refund/dispute/finance data.
3. Persist admin settings and administrator lifecycle.
4. Integrate password change and linked accounts.
5. Integrate subscription lifecycle.
6. Add `/trending` or remove it.
7. Add complete 404, accessibility, and visual regression coverage.
8. Complete broad end-to-end automation.
9. Document remaining backend contracts and limitations.

## 13. Testing and Verification Strategy

### Static verification

- Run existing `npm run lint`.
- Run `npm run build`.
- Run `npm test`.
- Inspect route inventory after each route change.
- Inspect API response normalization at every integration boundary.

### Auth verification

- Signup success and OTP failure.
- OTP resend.
- Login by each role.
- Google callback success/failure.
- Forgot/reset/resend flows.
- Reload restoration.
- Logout and unauthorized route access.
- Wrong-role access.

### Professional verification

- Profile create/update/avatar/cover.
- Portfolio, certification, and skill operations.
- Browse jobs and apply.
- View my jobs/applications.
- Chat and approved contact rules.
- Verification and wallet.

### Employer verification

- Post/manage job.
- Match/applicant selection.
- Accept and fund in test mode.
- View real job details.
- Raise dispute and upload evidence.
- Invitation behavior.

### Admin verification

- Read metrics and tables.
- Verify or reject users.
- Update job/status.
- Arbitration/dispute actions.
- Payout/refund/escrow actions.
- Export output.
- Settings persistence.

### UI verification

- 360 px mobile.
- Tablet.
- 1280 px and wide desktop.
- Keyboard tab/focus.
- Loading/error/empty/success states.
- Browser console and network errors.

No real transactions or destructive backend operations are allowed outside isolated test environments.

## 14. Acceptance Criteria

A task is complete only when:

- Its implementation requirements are present in the target code.
- Its relevant acceptance criteria pass.
- No fake success or silent fallback remains.
- Loading, error, empty, and success states are appropriate.
- API payload and response fields match the confirmed backend contract.
- Reload and role behavior are correct where state is persistent.
- The task is represented in test coverage or an explicit manual test record.
- No real transaction or destructive operation was performed during verification.

## 15. Final Completion Checklist

- [ ] FIX-001 passes for valid and invalid OTP.
- [ ] Public jobs contain only live or verified data.
- [ ] AUTH-001 does not produce success on unavailable reset routes.
- [ ] Employer job details never use an unrelated fallback ID.
- [ ] Core role routes are protected and redirect predictably.
- [ ] Public, professional, employer, and admin API envelopes are normalized.
- [ ] Messaging, verification, disputes, and wallet states are live or blocked honestly.
- [ ] Settings and subscription controls are persistent or removed from UI.
- [ ] Static admin/finance/dispute data is removed from release-critical views.
- [ ] `/trending` is resolved or removed.
- [ ] Core forms validate payloads and duplicate submissions.
- [ ] Build, lint, unit, smoke, and E2E checks pass.
- [ ] Mobile/tablet/desktop and keyboard checks pass.
- [ ] Remaining work is documented with owner and priority.

## 16. Project Completion Definition

The project is complete when all P0 and P1 release-critical tasks are complete or formally accepted as backend-blocked, all critical journeys pass test-mode verification, no confirmed mock/simulated success remains in release functionality, and the build/lint/test suite passes.

P2 and P3 items do not block release by themselves unless product acceptance identifies one as mandatory. Backend-blocked P1 items must be named with owner, required endpoint/contract, and frontend-independent progress.
