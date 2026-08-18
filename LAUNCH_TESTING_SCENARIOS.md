# Linkprosoft Platform — Pre-Launch Comprehensive Testing Matrix & Scenario Guide

**Document Version:** 1.0.0  
**Target Release:** Production Launch  
**Target Platform:** Linkprosoft (Web Application: React 19 + Vite + Tailwind CSS + Zustand + REST / WebSocket API)  
**Test Scope:** End-to-End User Journeys, RBAC Security, Data Flow, Escrow & Financial Flows, Messaging, Notification & Error Handling  

---

## Executive Summary & Testing Instructions

This document provides **20 comprehensive, production-grade testing scenarios** designed to validate every critical business workflow, data layer, state transition, and user role across the Linkprosoft ecosystem before launch next week.

### Testing Priority Classification
- **P0 (Critical / Launch Blocker):** Must pass 100% without exceptions. Failure blocks public launch.
- **P1 (High Priority):** Core platform experience; workarounds unacceptable for launch.
- **P2 (Medium Priority):** Edge cases, UX polish, and non-blocking optimizations.

### Test Environment Prerequisites
1. **Frontend App:** Running locally or on staging (`http://localhost:3000` or staging URL).
2. **Backend API:** Live backend instance (`VITE_API_BASE_URL`) or verified Mock Service layer fallback.
3. **Accounts Needed:**
   - Test Employer Account (`employer@test.com`)
   - Test Professional Account (`professional@test.com`)
   - Test Admin Account (`admin@test.com`)
   - Clean/Fresh Browser Session (Incognito) for registration tests.
4. **Developer Tools:** Browser Network Tab open (preserve log enabled), Application Storage tab (localStorage inspect).

---

## Quick Reference Matrix

| # | Scenario ID | Module / Feature Area | Target Role | Priority | Key Data / API Endpoint |
|---|---|---|---|---|---|
| 1 | `TC-AUTH-01` | Registration & Role Onboarding | New User | **P0** | `POST /api/auth/register` |
| 2 | `TC-AUTH-02` | Login, Session Persistence & Auth Headers | All Roles | **P0** | `POST /api/auth/login`, `authStore` |
| 3 | `TC-AUTH-03` | Role-Based Access Control (RBAC) & Guards | Guest / All | **P0** | `PrivateRoutes.jsx`, Router Guards |
| 4 | `TC-AUTH-04` | Google OAuth Authentication & Token Callback | New / Existing | **P0** | `/auth/google/callback` |
| 5 | `TC-JOB-01` | Employer Job Posting Wizard & Validation | Employer | **P0** | `POST /api/jobs`, `jobService.js` |
| 6 | `TC-JOB-02` | Professional Job Search, Filters & Bookmarking | Professional | **P0** | `GET /api/jobs`, `POST /api/jobs/:id/bookmark` |
| 7 | `TC-PROP-01` | Proposal Submission & Bid Workflow | Professional | **P0** | `POST /api/applications`, `JobApplicationPage` |
| 8 | `TC-PROP-02` | Employer Application Review, Shortlisting & Hire | Employer | **P0** | `GET /api/jobs/:id/applications`, `PUT /api/applications/:id` |
| 9 | `TC-ESC-01` | Escrow Funding & Project Kickoff | Employer | **P0** | `POST /api/projects/:id/escrow/fund` |
| 10 | `TC-PROJ-01` | Professional Work Delivery & Milestone Submit | Professional | **P0** | `POST /api/projects/:id/milestones/:id/submit` |
| 11 | `TC-ESC-02` | Employer Milestone Approval & Escrow Release | Employer | **P0** | `POST /api/projects/:id/milestones/:id/release` |
| 12 | `TC-FIN-01` | Professional Wallet Balance & Bank Withdrawal | Professional | **P0** | `GET /api/wallet`, `POST /api/wallet/withdraw` |
| 13 | `TC-MSG-01` | End-to-End Real-Time & Polling Messaging | Both Roles | **P0** | `messagingService.js`, `WebSocket/REST` |
| 14 | `TC-DISP-01` | Dispute Escalation & Escrow Lock | Employer / Prof | **P1** | `POST /api/disputes`, `EmployerOpenDisputeSubpage` |
| 15 | `TC-PROF-01` | Professional Profile, Skills & KYC Verification | Professional | **P1** | `PUT /api/profile`, `profileService.js` |
| 16 | `TC-DIR-01` | Employer Directory Search & Direct Invite | Employer / Buyer| **P1** | `GET /api/professionals`, `PublicBuyerScreen` |
| 17 | `TC-NOTIF-01`| Notifications Center & Real-Time Alerts | All Roles | **P1** | `GET /api/notifications`, `PUT /api/notifications/read` |
| 18 | `TC-PREM-01` | Professional Premium Tier Subscription Flow | Professional | **P1** | `GET/POST /api/subscriptions`, `PremiumSubpage` |
| 19 | `TC-MKT-01` | Public Landing, Waitlist Capture & Preloader | Public Guest | **P2** | `POST /api/waitlist`, `LandingPage.jsx` |
| 20 | `TC-ERR-01` | Token Expiry, 401 Interceptors & Network Recovery | All Roles | **P0** | `axiosInstance.js` Interceptors, Error Toasts |

---

## Detailed Test Scenarios

```
================================================================================
SECTION 1: AUTHENTICATION, ONBOARDING & SECURITY
================================================================================
```

### Scenario 1: New User Registration & Role Onboarding (TC-AUTH-01)
- **Feature Area:** Authentication & Account Creation
- **Role:** New Visitor (Guest)
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Browser cache cleared or Incognito session.
- **Objective:** Verify that a new user can register as either an Employer/Buyer or a Professional with proper validation, state dispatch, and landing redirection.

#### Test Execution Steps:
1. Navigate to `/signup`.
2. Select role **"I want to hire talent (Employer)"**.
3. Fill in required fields: Full Name, Business Email, Password (8+ chars, mix of case & symbols), Agree to Terms.
4. Click **"Create Account"**.
5. Observe network request and UI redirection.
6. Log out, return to `/signup`, and repeat with role **"I am a Freelancer / Professional"**.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/auth/register` with payload `{ fullName, email, password, role: 'employer' | 'professional' }`.
- **Response:** Status `201 Created` with payload `{ success: true, token: "JWT_TOKEN", user: { id, name, role, email } }`.
- **Local Storage:** `localStorage.getItem('token')` or `auth_token` populated.
- **Zustand State (`authStore`):** `isAuthenticated: true`, `user.role === 'employer'` (or `'professional'`).
- **UI Redirect:** Employer redirected to `/employer/dashboard` or `/home`; Professional redirected to `/professional/dashboard` or `/professional/home`.

#### Edge Cases & Negative Checks:
- Submit form with invalid email format (`user@domain`) -> expect inline error badge.
- Submit password shorter than minimum requirements -> expect validation toast/error.
- Attempt duplicate registration with existing email -> expect `409 Conflict` friendly toast message.

---

### Scenario 2: Login, Session Persistence & Auth Header Injection (TC-AUTH-02)
- **Feature Area:** Session Management & Axios Interceptors
- **Role:** Registered User (Employer / Professional)
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Registered test accounts ready.
- **Objective:** Verify valid credentials log in the user, persist across page refreshes, and inject Bearer tokens into all subsequent API requests.

#### Test Execution Steps:
1. Navigate to `/login`.
2. Enter registered credentials (`professional@test.com` / `ValidPass123!`).
3. Click **"Sign In"**.
4. Once on the dashboard, refresh the browser page (`F5` or `Ctrl+R`).
5. Open browser DevTools Network tab.
6. Trigger any dashboard action (e.g. click "Browse Jobs" or "My Jobs").
7. Inspect the outgoing HTTP request headers.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/auth/login` returning `{ token, user }`.
- **Persistence:** After page reload, `authStore` re-hydrates `user` and `token` from `localStorage` without bouncing the user to `/login`.
- **Request Headers:** All subsequent API requests must include `Authorization: Bearer <JWT_TOKEN>`.
- **UI State:** Top navigation bar displays the logged-in user's name and avatar.

#### Edge Cases & Negative Checks:
- Attempt login with incorrect password -> expect `401 Unauthorized` with "Invalid email or password" error toast.
- Attempt login with empty fields -> form buttons remain disabled or trigger client-side validation hints.

---

### Scenario 3: Role-Based Access Control (RBAC) & Route Guards (TC-AUTH-03)
- **Feature Area:** Navigation Security & `PrivateRoutes.jsx`
- **Role:** All Roles / Unauthenticated Guest
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Browser session in clean or logged-in state as specified in each step.
- **Objective:** Ensure unauthorized users cannot access restricted routes via direct URL tampering.

#### Test Execution Steps:
1. **Unauthenticated Test:** Open a fresh incognito window. Directly type `http://localhost:3000/employer/dashboard` into address bar. Press Enter.
2. Directly type `http://localhost:3000/professional/dashboard` into address bar. Press Enter.
3. **Cross-Role Test:** Log in as a **Professional**. Directly type `http://localhost:3000/employer/dashboard` in the address bar.
4. Log in as an **Employer**. Directly type `http://localhost:3000/professional/dashboard` or `/professional/jobs/apply` in the address bar.
5. Attempt direct access to `/admin/dashboard` as non-admin.

#### Data Flow & State Verification:
- **Unauthenticated:** `PrivateRoutes.jsx` detects `!isAuthenticated` -> redirects to `/login` (preserving query `redirect=/employer/dashboard`).
- **Cross-Role Violation:** `PrivateRoutes.jsx` checks `allowedRoles` array -> user role mismatch redirects to appropriate home screen or displays an Access Denied fallback.
- **Admin Guard:** Only users with `role: 'admin'` can render `AdminDahboardPage.jsx`.

---

### Scenario 4: Google OAuth 2.0 Single Sign-On & Callback Handling (TC-AUTH-04)
- **Feature Area:** Social Auth
- **Role:** New / Returning User
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Google Client ID configured in backend/frontend.
- **Objective:** Verify user can authenticate via Google and is processed through `GoogleCallbackPage.jsx`.

#### Test Execution Steps:
1. Navigate to `/login` or `/signup`.
2. Click **"Continue with Google"** button.
3. Complete Google account consent screen.
4. Observe redirect to `/auth/google/callback?token=...&role=...`.
5. Observe automatic redirection into the user's dashboard.

#### Data Flow & State Verification:
- **Component:** `GoogleCallbackPage.jsx` extracts query params (`token`, `role`, `user`).
- **Store Sync:** Dispatches `setAuth({ token, user })` in `authStore`.
- **Storage:** Stores token in `localStorage`.
- **Navigation:** Redirects to `/employer/dashboard` or `/professional/dashboard`.

---

```
================================================================================
SECTION 2: JOB MANAGEMENT, SEARCH & PROPOSALS
================================================================================
```

### Scenario 5: Employer Job Posting Wizard & Validation (TC-JOB-01)
- **Feature Area:** Job Creation Workflow (`PostJobWizard.jsx` / `EmployerManageJobsSubpage.jsx`)
- **Role:** Employer
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Logged in as Employer.
- **Objective:** Verify an employer can create and publish a new job posting with milestones, budget, and skills.

#### Test Execution Steps:
1. Log in as Employer and navigate to `/employer/dashboard`.
2. Click **"Post a Job"** or open the Job Wizard.
3. **Step 1 - Project Info:** Enter Title ("Full-Stack React & Node.js Developer"), Category ("Web Development"), Project Scope/Description, Required Skills ("React", "Node.js", "Tailwind").
4. **Step 2 - Budget & Milestones:** Select Budget Type ("Fixed Price"), Enter Total Budget (`₦350,000`), define 2 milestones (Milestone 1: UI Implementation - `₦150,000`, Milestone 2: Backend API Integration - `₦200,000`).
5. **Step 3 - Review & Submit:** Review all fields and click **"Publish Job"**.
6. Navigate to **Manage Jobs** tab.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/jobs` with complete job payload.
- **Response:** `201 Created` with new Job Object `{ id, orderId: "JOB-XXXX", title, status: "Open", ... }`.
- **Zustand State:** Job added to `dashboardStore` or refreshed job list.
- **UI Verification:** Toast displays "Job posted successfully!". The new job card appears in "Manage Jobs" tab with status badge "Active / Open".

#### Edge Cases & Negative Checks:
- Leave required fields blank (e.g. title or budget) -> "Next" button disabled or shows field errors.
- Milestone sum mismatch with total budget -> error warning displayed before allowing submission.

---

### Scenario 6: Professional Job Search, Filtering & Bookmarking (TC-JOB-02)
- **Feature Area:** Job Discovery (`BrowseJobsSubpage.jsx`)
- **Role:** Professional
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Logged in as Professional; multiple active jobs exist in system.
- **Objective:** Verify professional can search, filter by category/budget, and bookmark jobs.

#### Test Execution Steps:
1. Log in as Professional and navigate to **Browse Jobs** tab (`/professional/dashboard`).
2. Type keyword "React" in `ProfessionalSearchBar`.
3. Filter by Category -> "Web Development".
4. Adjust Budget Range slider/inputs (`Min: ₦100,000`, `Max: ₦500,000`).
5. Click on Bookmark icon on the first job card.
6. Refresh the page and verify bookmark status persists.

#### Data Flow & State Verification:
- **Network Call (Search):** `GET /api/jobs?search=React&category=Web%20Development&minBudget=100000&maxBudget=500000`.
- **Network Call (Bookmark):** `POST /api/jobs/:id/bookmark`.
- **UI Verification:** Job list updates dynamically; matched jobs contain keyword badges; bookmarked icon toggles to filled state with toast confirmation.

---

### Scenario 7: Professional Proposal Submission & Bid Workflow (TC-PROP-01)
- **Feature Area:** Proposal Creation (`JobApplicationPage.jsx` / Bid Modal)
- **Role:** Professional
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Active open job selected from Browse Jobs.
- **Objective:** Verify a professional can apply for a job, propose bid amount, timeline, and cover letter.

#### Test Execution Steps:
1. From Browse Jobs, click **"Apply Now"** on target job card.
2. Verify redirect to `/professional/jobs/apply?jobId=...` or opening of the Application Modal.
3. Enter Bid Amount: `₦320,000`.
4. Enter Estimated Delivery Time: `14 Days`.
5. Enter Cover Letter / Pitch highlighting relevant experience.
6. Attach a portfolio document / link if supported.
7. Click **"Submit Proposal"**.
8. Navigate to **Applications** tab in Professional Dashboard.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/applications` with payload `{ jobId, bidAmount: 320000, estimatedDays: 14, coverLetter: "...", attachments: [...] }`.
- **Response:** `201 Created` with application ID and timestamp.
- **UI Verification:** Success toast "Proposal submitted successfully!".
- **Applications Subpage:** Application appears under **"Sent / Pending"** column with correct job title, bid amount, and "Under Review" status badge.

---

### Scenario 8: Employer Application Review, Shortlisting & Hiring Decision (TC-PROP-02)
- **Feature Area:** Applicant Management (`EmployerManageJobsSubpage.jsx` / `EmployerJobDetailsSubpage.jsx`)
- **Role:** Employer
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Job has at least 1 received proposal from Scenario 7.
- **Objective:** Verify employer can view applicants, compare proposals, shortlist, and accept a bid.

#### Test Execution Steps:
1. Log in as Employer and open **Manage Jobs** tab.
2. Click on the job posted in Scenario 5 ("Full-Stack React & Node.js Developer").
3. Open **"Proposals / Applicants"** view.
4. Click on the professional's proposal card to inspect cover letter, rating, and bid.
5. Click **"Shortlist"** button, then click **"Accept & Hire"** (or "Create Contract").
6. Verify confirmation modal and contract generation.

#### Data Flow & State Verification:
- **Network Calls:**
  - `GET /api/jobs/:jobId/applications` -> returns array of applicant objects.
  - `PUT /api/applications/:appId` -> `{ status: "Accepted" }`.
  - `POST /api/projects` -> creates contract/project linking Employer and Professional.
- **State Update:** Job status updates from "Open" to "Assigned / In Progress".
- **Professional Impact:** Professional receives notification "Your proposal was accepted!" and application moves to "Accepted" in `ApplicationsSubpage.jsx`.

---

```
================================================================================
SECTION 3: ESCROW, MILESTONES, DELIVERABLES & PAYMENTS
================================================================================
```

### Scenario 9: Milestone Escrow Funding & Project Kickoff (TC-ESC-01)
- **Feature Area:** Escrow Deposit & Security
- **Role:** Employer
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Contract created between Employer and Professional.
- **Objective:** Verify employer can fund project milestones into Escrow before work begins.

#### Test Execution Steps:
1. Navigate to Employer Dashboard -> Active Projects -> Select Contract.
2. Click **"Fund Milestone 1 (₦150,000)"** or **"Fund All Milestones"**.
3. Select Payment Method (Wallet Balance / Debit Card / Transfer).
4. Authorize the payment simulation.
5. Inspect the project status and escrow badge.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/projects/:id/escrow/fund` with `{ milestoneId, amount: 150000, paymentMethod: "wallet" }`.
- **Response:** Status `200 OK` with `{ escrowStatus: "Funded", transactionId: "TX-XXXX" }`.
- **Employer Dashboard:** Spent / In-Escrow metric updates in `EmployerOverviewSubpage.jsx`.
- **Professional Dashboard:** In `ProjectDetailsSubpage.jsx`, Milestone 1 status updates to "Funded - Ready to Start".

---

### Scenario 10: Professional Work Delivery & Milestone Submission (TC-PROJ-01)
- **Feature Area:** Deliverable Submission (`ProjectDetailsSubpage.jsx` / `MyJobsSubpage.jsx`)
- **Role:** Professional
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Active project with funded Milestone 1.
- **Objective:** Verify professional can submit completed work, notes, and attachments for review.

#### Test Execution Steps:
1. Log in as Professional and go to **My Jobs** -> Click active project.
2. In `ProjectDetailsSubpage.jsx`, locate Milestone 1 ("UI Implementation").
3. Click **"Submit Deliverables"** button.
4. Enter work summary notes ("Completed all 5 responsive dashboard screens and integrated Zustand store").
5. Add GitHub repository link or attach zip artifact.
6. Click **"Submit for Approval"**.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/projects/:projectId/milestones/:milestoneId/submit` with payload `{ notes, deliveryUrl, attachments }`.
- **Response:** `200 OK` with `{ status: "Under Review", submittedAt: ISO_DATE }`.
- **UI Verification:** Milestone badge changes from "In Progress" to "Submitted / Pending Review".
- **Notification:** Employer receives real-time / in-app notification: "Professional has submitted Milestone 1 for review".

---

### Scenario 11: Employer Milestone Approval & Escrow Release (TC-ESC-02)
- **Feature Area:** Milestone Approval & Funds Release
- **Role:** Employer
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Milestone 1 submitted by Professional.
- **Objective:** Verify employer can review deliverable and release funds to the professional's wallet.

#### Test Execution Steps:
1. Log in as Employer and open the project details.
2. In the Milestones tab, locate the submitted Milestone 1.
3. Click **"Review Deliverable"** to inspect submitted notes and URLs.
4. Click **"Approve & Release Funds"**.
5. Enter rating/feedback if prompted and confirm release modal.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/projects/:projectId/milestones/:milestoneId/release`.
- **Response:** `200 OK` with `{ milestoneStatus: "Completed", paymentStatus: "Released", releasedAmount: 150000 }`.
- **Escrow State:** Escrow hold is released; milestone marks as "Completed (Green Check)".
- **Professional Impact:** Professional wallet balance increases by `₦150,000` (minus platform commission fee if configured).

---

### Scenario 12: Professional Wallet Balance, Earnings & Bank Withdrawal (TC-FIN-01)
- **Feature Area:** Wallet Management (`WalletSubpage.jsx`)
- **Role:** Professional
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Released funds exist in wallet balance from Scenario 11.
- **Objective:** Verify professional can view real-time balance breakdown, bank account details, and request payout withdrawal.

#### Test Execution Steps:
1. Log in as Professional and click **Wallet** tab in sidebar.
2. Verify KPI Cards: Available Balance, Pending Escrow, Total Earned.
3. Click **"Withdraw Funds"** button.
4. Select saved Bank Account (or enter Bank Name, Account Number, Account Name).
5. Enter Withdrawal Amount (e.g. `₦100,000`).
6. Click **"Confirm Withdrawal"**.
7. Inspect Transaction History table below.

#### Data Flow & State Verification:
- **Network Call (Fetch):** `GET /api/wallet` -> `{ balance: 150000, pendingEscrow: 200000, totalWithdrawn: 0, transactions: [...] }`.
- **Network Call (Withdraw):** `POST /api/wallet/withdraw` with `{ amount: 100000, bankAccountId: "..." }`.
- **Response:** `200 OK` with `{ transactionId: "WD-XXXX", status: "Processing", newBalance: 50000 }`.
- **UI Verification:** Available Balance immediately updates to `₦500,000` (or `₦50,000`); new row appears in "Transaction History" table with status "Processing / Pending".

---

```
================================================================================
SECTION 4: REAL-TIME MESSAGING, NOTIFICATIONS & DISPUTES
================================================================================
```

### Scenario 13: End-to-End Real-Time & Polling Messaging Flow (TC-MSG-01)
- **Feature Area:** Communication System (`MessagesPage.jsx` / `ChatSubpage.jsx` / `EmployerMessagesSubpage.jsx`)
- **Role:** Both Employer & Professional
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Active conversation or contract exists between test Employer and Professional.
- **Objective:** Verify bidirectional message exchange, attachment handling, unread counts, and active thread synchronization.

#### Test Execution Steps:
1. Open two browser windows side-by-side (Window A: Employer; Window B: Professional).
2. Employer opens **Messages** tab and selects the Professional from conversation list.
3. Type message: "Hello! Did you review the API specifications?" and hit Send.
4. Observe Window B (Professional):
   - Message bubble appears in chat window.
   - Unread badge counter increments if thread wasn't active.
5. Professional types reply: "Yes, starting implementation now." and hits Send.
6. Verify Window A receives the reply in real-time.

#### Data Flow & State Verification:
- **Network / Socket Events:**
  - `POST /api/messages` or WebSocket `send_message` with `{ threadId, recipientId, content }`.
  - Event `new_message` received by recipient client.
- **Zustand State (`messagingStore`):** `messages` array appended; `unreadCounts` updated; `activeThreadId` set.
- **UI Verification:** Correct message alignment (outgoing on right, incoming on left), timestamps formatted accurately, sound/toast alert triggered if backgrounded.

---

### Scenario 14: Dispute Initiation, Mediation & Escrow Lock (TC-DISP-01)
- **Feature Area:** Conflict Resolution (`EmployerOpenDisputeSubpage.jsx`)
- **Role:** Employer (or Professional)
- **Priority:** `P1 (High Priority)`
- **Pre-conditions:** Active project in progress with disputed milestone.
- **Objective:** Verify user can open a formal dispute, locking escrow funds and alerting admin support.

#### Test Execution Steps:
1. Log in as Employer, navigate to Active Project, and click **"Open Dispute"**.
2. Select Dispute Reason (e.g. "Work not delivered according to requirements" / "Unresponsive freelancer").
3. Select Affected Milestone (Milestone 2).
4. Enter detailed description of grievance and upload proof screenshot.
5. Click **"Submit Dispute Ticket"**.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/disputes` with `{ projectId, milestoneId, reason, description, evidenceUrls }`.
- **Response:** `201 Created` with Dispute ID (`DISP-XXXX`).
- **State Impact:** Project status changes to `Disputed / In Mediation`; milestone payout buttons disabled; funds remain locked in Escrow.
- **Admin Visibility:** Dispute appears in Admin Dashboard dispute queue.

---

```
================================================================================
SECTION 5: PROFILE, DIRECTORY, SUBSCRIPTIONS & PLATFORM
================================================================================
```

### Scenario 15: Professional Profile Setup, Skills & KYC Verification (TC-PROF-01)
- **Feature Area:** Profile & Trust Verification (`ProfileSubpage.jsx`)
- **Role:** Professional
- **Priority:** `P1 (High Priority)`
- **Pre-conditions:** Logged in as Professional.
- **Objective:** Verify professional can update personal details, portfolio items, hourly rate, and submit KYC identification.

#### Test Execution Steps:
1. Navigate to **Profile** subpage (`/professional/dashboard`).
2. Update Full Name, Professional Title ("Senior Full-Stack Architect"), Bio, and Hourly Rate (`₦15,000/hr`).
3. Add 3 Skills with proficiency badges ("React", "Node.js", "Docker").
4. Add a Portfolio Item with title, description, and thumbnail image.
5. Click **"Save Changes"**.
6. Navigate to **Verification / KYC** tab and upload ID document.

#### Data Flow & State Verification:
- **Network Call:** `PUT /api/profile` with profile updates.
- **Network Call (KYC):** `POST /api/profile/kyc` with multipart/form-data.
- **Response:** `200 OK` with updated profile model.
- **UI Verification:** Profile header immediately reflects new title, hourly rate, and portfolio cards; verification status displays "Pending Review" badge.

---

### Scenario 16: Buyer / Employer Professional Directory Search & Direct Inquiry (TC-DIR-01)
- **Feature Area:** Talent Discovery (`PublicBuyerScreen.jsx` / `EmployerBrowseProfessionalsSubpage.jsx`)
- **Role:** Buyer / Employer (Public or Authenticated)
- **Priority:** `P1 (High Priority)`
- **Pre-conditions:** Multiple professional profiles available.
- **Objective:** Verify talent directory searching, rating/skill filters, profile modal preview, and direct invite action.

#### Test Execution Steps:
1. Navigate to `/browse-professionals` (or `/employer/dashboard` -> Browse Professionals).
2. Filter talent by Category ("Design & Creative" or "Software Development").
3. Filter by Minimum Rating ("4.5+ Stars") and Hourly Rate Bracket.
4. Click on a Professional's talent card.
5. Inspect Profile Modal (Bio, portfolio projects, client reviews, badge levels).
6. Click **"Invite to Job"** or **"Send Message"**.

#### Data Flow & State Verification:
- **Network Call:** `GET /api/professionals?category=...&minRating=4.5&skills=...`.
- **UI Verification:** Filtered talent cards re-render accurately without layout distortion; clicking Invite opens job selector modal.

---

### Scenario 17: Notification Center & Read State Synchronization (TC-NOTIF-01)
- **Feature Area:** In-App Notification Hub
- **Role:** All Logged-in Users
- **Priority:** `P1 (High Priority)`
- **Pre-conditions:** User has at least 3 unread notifications.
- **Objective:** Verify bell icon notification count, dropdown preview, mark single/all as read, and filter toggles.

#### Test Execution Steps:
1. Check top navigation header bell icon for red unread count badge (e.g. `3`).
2. Click the bell icon to open Notification Popover.
3. Verify list displays titles, timestamps, and unread indicator dots.
4. Click on an unread notification item -> verify redirect to target entity (e.g. job or message) and unread dot clears.
5. Click **"Mark all as read"**.
6. Switch filter toggle between "Unread" and "All".

#### Data Flow & State Verification:
- **Network Calls:**
  - `GET /api/notifications` -> returns notification array with `unreadCount`.
  - `PUT /api/notifications/:id/read` -> marks specific notification as read.
  - `PUT /api/notifications/mark-all-read` -> updates all to read.
- **UI Verification:** Bell icon counter clears to 0; empty state message displays properly when "Unread" filter has no items.

---

### Scenario 18: Professional Premium Tier Subscription Flow (TC-PREM-01)
- **Feature Area:** Monetization & Memberships (`PremiumSubpage.jsx`)
- **Role:** Professional
- **Priority:** `P1 (High Priority)`
- **Pre-conditions:** Professional on Free Tier.
- **Objective:** Verify viewing subscription tiers, benefit breakdowns, upgrade checkout simulation, and tier activation.

#### Test Execution Steps:
1. In Professional Dashboard, click **"Premium"** or "Upgrade Plan" in sidebar.
2. Compare plan cards: "Starter (Free)", "Professional Pro (₦5,000/mo)", "Agency Elite (₦15,000/mo)".
3. Click **"Upgrade to Pro"**.
4. Select Billing Cycle (Monthly vs Annually with discount toggle).
5. Complete payment checkout modal.
6. Verify subscription badge changes to "PRO Member" across dashboard header.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/subscriptions/upgrade` with `{ planId: "pro_monthly" }`.
- **Response:** `200 OK` with updated subscription metadata `{ tier: "pro", activeUntil: ISO_DATE }`.
- **UI Verification:** Success banner displayed; zero proposal fee limit unlocked; badge updated.

---

### Scenario 19: Public Landing Page, Waitlist Capture & Preloader Experience (TC-MKT-01)
- **Feature Area:** Marketing & Lead Generation (`LandingPage.jsx`, `Waitlist.jsx`, `TestPreloaderPage.jsx`)
- **Role:** Unauthenticated Visitor
- **Priority:** `P2 (Medium Priority)`
- **Pre-conditions:** Clean browser session.
- **Objective:** Verify landing page hero animations, responsive layout, waitlist signup form, and preloader smoothness.

#### Test Execution Steps:
1. Navigate to `/` (Landing Page).
2. Verify all sections load smoothly: Hero banner, Feature Highlights, Category Grid, Testimonials, Footer links.
3. Resize browser window to mobile width (375px) -> check hamburger menu and mobile layout.
4. Click **"Join Waitlist"** -> navigate to `/waitlist`.
5. Enter Name, Email, and select Interest Category ("Freelancer", "Client", or "Partner").
6. Submit form and verify confirmation screen / confetti animation.
7. Navigate to `/test-preloader` to verify asset preloading and splash screen animations.

#### Data Flow & State Verification:
- **Network Call:** `POST /api/waitlist` with `{ name, email, role }`.
- **Response:** `201 Created` with confirmation message.
- **UI Verification:** Success screen displays waitlist queue number and social share links.

---

### Scenario 20: System Error Handling, Token Expiration & Network Failure Recovery (TC-ERR-01)
- **Feature Area:** Robustness, Resilience & Error Interceptors (`axiosInstance.js`)
- **Role:** All Roles
- **Priority:** `P0 (Launch Blocker)`
- **Pre-conditions:** Logged-in session.
- **Objective:** Verify the application handles token expiration, backend downtime, and 500 errors gracefully without crashing or white-screening.

#### Test Execution Steps:
1. **Token Expiry Test:** In browser DevTools -> Application -> LocalStorage, edit `token` to an invalid/expired string.
2. Click any dashboard link that triggers an API call.
3. Observe Axios response interceptor behavior.
4. **Backend Downtime / Offline Test:** Disconnect network in DevTools (Offline Mode) and click a data-fetching tab.
5. **Form Error Test:** Trigger an intentional server validation error (e.g. submit bad payload).
6. Observe UI feedback.

#### Data Flow & State Verification:
- **401 Interceptor:** `axiosInstance.js` catches `401 Unauthorized` -> clears `localStorage` token -> clears `authStore` -> redirects user to `/login` with notification "Session expired. Please log in again."
- **500 / Network Error:** React Hot Toast renders user-friendly error message ("Network error. Please check your connection or try again later.") rather than an unhandled runtime error.
- **UI Stability:** Application does not throw unhandled white-screen exceptions; fallback mock data or empty state illustrations render cleanly.

---

## Pre-Launch Execution Sign-Off Checklist

Use this sign-off sheet to record execution results during the final pre-launch testing sprint.

| Test ID | Scenario Name | Tester Name | Date Tested | Status (PASS / FAIL / BLOCKED) | Notes / Issue Ticket # |
|---|---|---|---|---|---|
| `TC-AUTH-01` | User Registration & Onboarding | | | | |
| `TC-AUTH-02` | Login & Session Persistence | | | | |
| `TC-AUTH-03` | RBAC & Route Protection | | | | |
| `TC-AUTH-04` | Google OAuth Callback | | | | |
| `TC-JOB-01` | Employer Job Posting Wizard | | | | |
| `TC-JOB-02` | Job Search, Filter & Bookmark | | | | |
| `TC-PROP-01` | Proposal & Bid Submission | | | | |
| `TC-PROP-02` | Application Review & Hire | | | | |
| `TC-ESC-01` | Escrow Funding & Kickoff | | | | |
| `TC-PROJ-01` | Milestone Work Submission | | | | |
| `TC-ESC-02` | Approval & Escrow Release | | | | |
| `TC-FIN-01` | Wallet & Payout Withdrawal | | | | |
| `TC-MSG-01` | Real-Time Messaging Flow | | | | |
| `TC-DISP-01` | Dispute & Escrow Lock | | | | |
| `TC-PROF-01` | Profile & KYC Verification | | | | |
| `TC-DIR-01` | Talent Directory & Invite | | | | |
| `TC-NOTIF-01`| Notifications Hub | | | | |
| `TC-PREM-01` | Premium Membership Upgrade | | | | |
| `TC-MKT-01` | Landing Page & Waitlist | | | | |
| `TC-ERR-01` | Error Recovery & Interceptors | | | | |

---
**End of Test Matrix Document**
