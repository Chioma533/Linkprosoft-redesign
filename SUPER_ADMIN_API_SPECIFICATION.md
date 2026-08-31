# Linkprosoft Super Admin Dashboard — API Specification & Backend Integration Roadmap

## Executive Summary

This document provides an exhaustive, production-grade technical specification of all backend REST API endpoints, real-time WebSocket events, database query schemas, and security requirements needed to power the **Linkprosoft Super Admin Dashboard** (as captured in the Figma design flow mockup `Super admin Dashboard.jpg`).

---

## 1. System Architecture, Security & Role-Based Access Control (RBAC)

### 1.1 Authentication & Security Standards
- **Token Security**: All Super Admin API requests require a valid JSON Web Token (JWT) passed in the `Authorization: Bearer <token>` HTTP header.
- **Admin RBAC**: Endpoints must enforce admin authorization middleware verifying that `req.user.role` is either `SUPER_ADMIN` or authorized `ADMIN`. Sensitive financial and dispute arbitration actions are restricted to `SUPER_ADMIN`.
- **Admin Audit Trail**: Every mutating administrative action (approvals, bans, escrow overrides, dispute settlements, commission config updates) MUST write an immutable audit log entry into the `AdminAuditLogs` collection/table.
- **Standard API Response Envelope**:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63
  }
}
```
- **Standard Error Response**:
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [],
  "statusCode": 400
}
```

### 1.2 Real-Time Events (WebSockets / SSE)
- `admin:critical_alert` — Pushes notifications for new open disputes, high-value escrow anomalies, or batch verification backlogs.
- `admin:payout_status_change` — Broadcasts state updates when background gateway payout webhooks fire.
- `admin:user_registered` — Streams live user signups to the platform activity feed.

---

## 2. Screen-by-Screen Flow & API Breakdown

---

### Screen 1: Super Admin Overview (`/admin/overview`)

#### UI Components & Metrics Displayed:
1. **Header**:
   - Greeting: `"Good Morning Admin"`
   - Subtitle: `"Manage your jobs and payments effortlessly"`
   - Global Search input: `"Search anything"` (Universal admin search)
   - Notifications bell counter
   - Admin Profile badge: Name (`"Elvis Chimanda"`), Avatar, Role dropdown
2. **Top KPI Cards (8 Key Metrics)**:
   - `Total Users`: `18,524` (+% trend)
   - `Verified Users`: `1,930` (+% trend)
   - `Active Jobs`: `1,086` (+% trend)
   - `Escrow Balance`: `₦248,500` (+% trend)
   - `Monthly Revenue`: `₦31,240` (+% trend)
   - `Open Disputes`: `18` (alert state)
   - `Pending Verification`: `54` (warning state)
   - `Pending Payouts`: `27` (warning state)
3. **Platform Revenue & Escrow Activity Chart**:
   - Dual-series line/area chart comparing Platform Revenue vs Escrow Deposit Volume over a selected timeframe (`7d`, `30d`, `90d`, `1y`).
4. **Needs Attention Widget**:
   - Alert counts: `Pending Verifications` (156), `Open Disputes` (55), `Pending Payouts` (29).
   - Action Button: `"View All Critical Alerts"`.
5. **Recent Platform Activity Feed**:
   - Real-time audit stream (e.g., `"Marco Rossi registered as a Professional (UI/UX Designer) — Awaiting verification"`).
   - Action Button: `"View All Activities"`.
6. **Quick Actions Panel**:
   - `"Approve Professionals"` (Direct navigation to verification queue)
   - `"Release Escrow"` (Modal to manually release escrow for verified completion)
   - `"Resolve Disputes"` (Direct navigation to active dispute arbitration)
   - `"Send Announcement"` (Modal to broadcast system notification to users)

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard/overview-metrics` | None | Retrieves all 8 high-level overview KPI counts, totals, and % trends. |
| `GET` | `/api/admin/dashboard/revenue-escrow-chart` | `period=7d\|30d\|90d\|1y` | Returns time-series revenue and escrow deposit data points for the analytics chart. |
| `GET` | `/api/admin/dashboard/critical-alerts` | None | Returns aggregated count and priority list for items requiring immediate attention. |
| `GET` | `/api/admin/dashboard/recent-activity` | `limit=10&page=1` | Returns paginated live stream of user registrations, disputes, and system logs. |
| `POST` | `/api/admin/announcements` | `{ title, message, targetAudience: "ALL"\|"PROFESSIONALS"\|"CLIENTS", channel: "IN_APP"\|"EMAIL"\|"BOTH" }` | Sends platform-wide announcement / notification. |
| `GET` | `/api/admin/search` | `q=string&type=ALL\|USERS\|JOBS\|DISPUTES\|TRANSACTIONS` | Global search across users, jobs, disputes, and transactions. |

---

### Screen 2: User Management (`/admin/users`)

#### UI Components & Metrics Displayed:
1. **Header & Actions**:
   - Subtitle: `"Manage all clients and professionals, monitor account status, and perform administrative actions."`
   - Primary Action: `"New Verification Requests"` (Opens/filters pending KYC verifications).
2. **KPI Stat Cards (4 Metrics)**:
   - `Total Users`: `42,500`
   - `Clients`: `24,300`
   - `Professionals`: `18,200`
   - `Suspended Accounts`: `142`
3. **Users Data Table**:
   - **Search & Filters**: Search by Name or Email, Filter by Role (`Client`, `Professional`), Category (`Plumbing`, `Carpentry`, etc.), Verification Status (`Verified`, `Pending`, `Unverified`, `Rejected`), Account Status (`Online`, `Active`, `Suspended`, `Banned`), Date Joined range.
   - **Columns**: `User` (Avatar, Full Name, Email/Phone), `Role`, `Category`, `Verification` (Badge), `Status` (Badge), `Date Joined`, `Actions` (View Details icon, Action menu).
   - **Row Actions**: View User Profile, Review KYC Documents, Suspend / Unsuspend Account, Ban User, Send Direct Email, Impersonate User Session.
   - **Pagination**: Page size selector, current page index, total count.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users/metrics` | None | Returns counts for Total Users, Clients, Professionals, Suspended Accounts, and Pending KYC. |
| `GET` | `/api/admin/users` | `page=1&limit=10&search=&role=&category=&verificationStatus=&accountStatus=&startDate=&endDate=&sortBy=createdAt&sortOrder=desc` | Paginated list of users with multi-parameter filtering. |
| `GET` | `/api/admin/users/:id` | None | Retrieves comprehensive user dossier (profile, verification files, job history, wallet balance, audit history). |
| `PATCH` | `/api/admin/users/:id/status` | `{ status: "ACTIVE"\|"SUSPENDED"\|"BANNED", reason: string }` | Updates user account status with audit logging. |
| `GET` | `/api/admin/users/verification-queue` | `page=1&limit=10&status=PENDING` | Fetches dedicated list of professionals awaiting KYC/identity document verification. |
| `PATCH` | `/api/admin/users/:id/verification` | `{ status: "VERIFIED"\|"REJECTED", reason?: string, badgeLevel?: string }` | Approves or rejects professional KYC documents and certification credentials. |
| `POST` | `/api/admin/users/:id/impersonate` | None | Generates a short-lived administrative impersonation token to diagnose user issues. |

---

### Screen 3: Jobs Management (`/admin/jobs`)

#### UI Components & Metrics Displayed:
1. **Header**:
   - Title: `"Jobs Management"`
   - Subtitle: `"Review, monitor, and manage marketplace jobs, milestone progress, and contract deliverables."`
2. **KPI Stat Cards (4 Metrics)**:
   - `Total Jobs`: `1,284`
   - `Active Jobs`: `156`
   - `Completed Jobs`: `42`
   - `Disputed`: `76`
3. **Jobs Data Table**:
   - **Search & Filters**: Search jobs by title/ID, Filter by Category, Status (`In Progress`, `Completed`, `Cancelled`, `Disputed`), Amount range, Date posted.
   - **Columns**: `Job Title`, `Client`, `Professional`, `Category`, `Amount` (₦), `Status` (Badge), `Date Posted`, `View` (Eye action icon).
   - **Job Details Drawer / Modal**: Shows job description, milestone progress, escrow funding state, deliverables, client-professional contract terms, dispute history, cancellation request audit.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/jobs/metrics` | None | Returns KPI counts for Total Jobs, Active Jobs, Completed Jobs, and Disputed Jobs. |
| `GET` | `/api/admin/jobs` | `page=1&limit=10&search=&category=&status=&minAmount=&maxAmount=&startDate=&endDate=&sortBy=createdAt&sortOrder=desc` | Paginated list of platform jobs with comprehensive filtering. |
| `GET` | `/api/admin/jobs/:id` | None | Detailed breakdown of a single job listing, milestones, proposals, escrow state, and activity logs. |
| `PATCH` | `/api/admin/jobs/:id/status` | `{ status: "CANCELLED"\|"COMPLETED"\|"UNDER_REVIEW", reason: string }` | Administrative status override on a marketplace job. |
| `POST` | `/api/admin/jobs/:id/force-cancel` | `{ reason: string, refundClient: boolean }` | Forcefully cancels an orphaned or problematic job and resolves related escrow. |

---

### Screen 4: Disputes & Reviews (`/admin/disputes`)

#### UI Components & Metrics Displayed:
1. **Header**:
   - Title: `"Disputes & Reviews"`
   - Subtitle: `"Review dispute cases, examine evidence, arbitrate escrow settlements, and manage platform reviews."`
2. **KPI Stat Cards (4 Metrics)**:
   - `Open Disputes`: `24`
   - `Under Review`: `12`
   - `Resolved`: `186`
   - `Escrow Held`: `₦860K`
3. **Disputes Data Table**:
   - **Search & Filters**: Search by Dispute ID, Job Title, or User; Filter by Status (`Open`, `Under Review`, `Resolved`), Category, Date range.
   - **Columns**: `Dispute ID` (e.g. `#DSP-1024`), `Job`, `Raised by`, `Against`, `Amount` (₦), `Reason` (e.g. `"Poor Workmanship"`, `"Uncompleted Job"`), `Status` (Badge), `Date Posted`, `View` (Eye action icon).
   - **Dispute Arbitration Modal / Workspace**:
     - Timeline of dispute events.
     - Evidence attachments (photos, videos, work logs, message chat logs).
     - Escrow amount in dispute.
     - Arbitration settlement tool: Release 100% to Professional, Refund 100% to Client, or Split custom percentage (e.g., 60% Client / 40% Professional).
     - Notes / Resolution justification sent to both parties.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/disputes/metrics` | None | Returns stats for Open Disputes, Under Review, Resolved, and Total Escrow Held in Dispute. |
| `GET` | `/api/admin/disputes` | `page=1&limit=10&search=&status=&reason=&startDate=&endDate=&sortBy=createdAt&sortOrder=desc` | Paginated list of disputes with filter controls. |
| `GET` | `/api/admin/disputes/:id` | None | Detailed dispute dossier including claim details, evidence files, chat transcripts, and contract terms. |
| `PATCH` | `/api/admin/disputes/:id/assign` | `{ assignedAdminId: string }` | Assigns an admin investigator to review the dispute. |
| `POST` | `/api/admin/disputes/:id/arbitrate` | `{ decision: "REFUND_CLIENT"\|"RELEASE_TO_PROFESSIONAL"\|"SPLIT", clientSharePercentage?: number, professionalSharePercentage?: number, resolutionNotes: string, penaltyApplied?: boolean }` | Executes binding dispute resolution, splits escrow accordingly, and notifies parties. |
| `GET` | `/api/admin/reviews` | `page=1&limit=10&rating=&flagged=true\|false` | Lists user ratings and reviews with moderation options (flag, hide, delete toxic reviews). |
| `DELETE` | `/api/admin/reviews/:id` | `{ reason: string }` | Removes or moderates a fraudulent or abusive review. |

---

### Screen 5: Finance — Overview (`/admin/finance/overview`)

#### UI Components & Metrics Displayed:
1. **Finance Sub-Navigation Tabs**:
   - `Overview` (Active), `Transactions`, `Escrow`, `Payouts`, `Refunds`, `Commission`.
2. **KPI Stat Cards (4 Metrics)**:
   - `Total Transaction Volume`: `₦48.6M` (+% trend)
   - `Platform Revenue`: `₦4.8M` (+% trend)
   - `Escrow Balance`: `₦12.4M` (+% trend)
   - `Pending Payouts`: `₦5.2M` (+% trend)
3. **Revenue Analytics Chart**:
   - Interactive line/area chart showing Gross Volume vs Net Platform Revenue over time (`daily`, `weekly`, `monthly`, `yearly`).
4. **Earnings Breakdown Donut Chart**:
   - Escrow: `₦28.2M` (58%)
   - Payouts: `₦15.4M` (32%)
   - Refunds: `₦850K` (2%)
   - Commissions: `₦4.1M` (8%)
   - Center total: `₦48.6M`
5. **Escrow Summary Card**:
   - `Total Held`: `₦12.4M`
   - `Awaiting Completion`: `₦7.8M`
   - `Ready for Release`: `₦3.2M`
   - `Under Dispute`: `₦1.4M`
6. **Payout Summary Card**:
   - `Pending`: `₦5.2M`
   - `Processing`: `₦1.8M`
   - `Completed`: `₦22.4M`
   - `Failed`: `₦12.4M`

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/finance/overview-metrics` | None | Returns Total Volume, Platform Revenue, Escrow Balance, and Pending Payouts. |
| `GET` | `/api/admin/finance/revenue-analytics` | `timeframe=monthly\|weekly\|yearly` | Time-series dataset for the Revenue Analytics chart. |
| `GET` | `/api/admin/finance/earnings-breakdown` | `startDate=&endDate=` | Donut chart dataset (Escrow, Payouts, Refunds, Commission proportions). |
| `GET` | `/api/admin/finance/escrow-summary` | None | Aggregated escrow status breakdown (Total Held, Awaiting, Ready, Disputed). |
| `GET` | `/api/admin/finance/payout-summary` | None | Aggregated payout status breakdown (Pending, Processing, Completed, Failed). |

---

### Screen 6: Finance — Transactions (`/admin/finance/transactions`)

#### UI Components & Metrics Displayed:
1. **Finance Sub-Navigation Tabs**:
   - `Overview`, `Transactions` (Active), `Escrow`, `Payouts`, `Refunds`, `Commission`.
2. **Transactions Ledger Table**:
   - **Search & Filters**: Search by Transaction ID (`#TX-92841`), User Name, or Job Title; Filter by Transaction Type (`Escrow Deposit`, `Payout`, `Milestone Release`, `Refund`, `Commission Fee`), Status (`Successful`, `Pending`, `Failed`), Date range.
   - **Columns**: `TRX ID`, `User`, `Job`, `Type`, `Amount` (₦), `Status` (Badge), `Date Posted`, `View` (Action icon).
   - **Transaction Details Drawer**: Shows Payment Gateway reference (Paystack / Flutterwave), Payment Method (Card, Bank Transfer, USSD), Associated Job ID, Associated Escrow ID, Fees breakdown, Raw Gateway Webhook payload.
   - **Export Action**: Export CSV / Excel of filtered ledger.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/finance/transactions` | `page=1&limit=10&search=&type=&status=&startDate=&endDate=&minAmount=&maxAmount=&sortBy=createdAt&sortOrder=desc` | Paginated transaction ledger with multi-column filtering. |
| `GET` | `/api/admin/finance/transactions/:id` | None | Full details for a single transaction record, including payment gateway trace logs. |
| `POST` | `/api/admin/finance/transactions/:id/reconcile` | None | Re-queries the payment gateway (Paystack/Flutterwave) to reconcile stuck/pending transactions. |
| `GET` | `/api/admin/finance/transactions/export` | `type=&status=&startDate=&endDate=&format=csv\|xlsx` | Generates a downloadable financial report file. |

---

### Screen 7: Finance — Escrow (`/admin/finance/escrow`)

#### UI Components & Metrics Displayed:
1. **Finance Sub-Navigation Tabs**:
   - `Overview`, `Transactions`, `Escrow` (Active), `Payouts`, `Refunds`, `Commission`.
2. **KPI Stat Cards (4 Metrics)**:
   - `Total Held`: `₦498.6M`
   - `Awaiting Completion`: `₦53.8M`
   - `Ready for Release`: `₦12.4M`
   - `Under Dispute`: `₦3.2M`
3. **Escrow Transactions Table**:
   - **Search & Filters**: Search by ESC ID (`#ESC-687`), Job Title, Client Name, or Professional Name; Filter by Status (`Held`, `Ready for Release`, `Disputed`, `Released`), Date Funded range.
   - **Columns**: `ESC ID`, `Job`, `Client`, `Professional`, `Amount` (₦), `Date Funded`, `Status` (Badge), `View` (Action icon).
   - **Escrow Actions**:
     - Manual Release override (e.g., client confirmed verbal completion but didn't click button).
     - Force Lock / Freeze Escrow (pending anti-fraud check).
     - Refund to Client Escrow Deposit.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/finance/escrow/metrics` | None | Returns KPI counts for Total Held, Awaiting Completion, Ready for Release, and Under Dispute. |
| `GET` | `/api/admin/finance/escrow` | `page=1&limit=10&search=&status=&startDate=&endDate=&sortBy=createdAt&sortOrder=desc` | Paginated list of all escrow accounts and their lifecycle states. |
| `GET` | `/api/admin/finance/escrow/:id` | None | Comprehensive escrow record with milestone timeline and linked job contract. |
| `POST` | `/api/admin/finance/escrow/:id/manual-release` | `{ reason: string, recipientId: string }` | Super Admin manual override to release escrow funds directly to the professional. |
| `POST` | `/api/admin/finance/escrow/:id/freeze` | `{ reason: string }` | Freezes an escrow balance during fraud investigations. |

---

### Screen 8: Finance — Payouts (`/admin/finance/payouts`)

#### UI Components & Metrics Displayed:
1. **Finance Sub-Navigation Tabs**:
   - `Overview`, `Transactions`, `Escrow`, `Payouts` (Active), `Refunds`, `Commission`.
2. **KPI Stat Cards (4 Metrics)**:
   - `Pending`: `₦42.8M`
   - `Processing`: `₦33.8M`
   - `Completed`: `₦12.4M`
   - `Failed`: `₦3.2M`
3. **Payouts Requests Table**:
   - **Search & Filters**: Search by Payout ID (`#PAY-9921`), Professional Name, or Bank Account Number; Filter by Status (`Pending`, `Processing`, `Completed`, `Failed`), Bank name (`GT Bank`, `Zenith Bank`, `Access Bank`, etc.), Date range.
   - **Columns**: `Payout ID`, `Job`, `Professional`, `Amount` (₦), `Bank`, `Status` (Badge), `Date Requested`, `View` (Action icon).
   - **Payout Actions**:
     - Single / Batch Approve Payouts.
     - Reject Payout (with return of funds to professional wallet).
     - Retry Failed Bank Transfer.
     - Bank Account Name Verification lookup.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/finance/payouts/metrics` | None | Returns KPI metrics for Pending, Processing, Completed, and Failed Payout totals. |
| `GET` | `/api/admin/finance/payouts` | `page=1&limit=10&search=&status=&bank=&startDate=&endDate=&sortBy=createdAt&sortOrder=desc` | Paginated list of professional payout requests with status filters. |
| `GET` | `/api/admin/finance/payouts/:id` | None | Retrieves detailed payout record, bank account verification info, and gateway transfer logs. |
| `POST` | `/api/admin/finance/payouts/:id/approve` | `{ note?: string }` | Approves and dispatches bank payout via payment gateway transfer API. |
| `POST` | `/api/admin/finance/payouts/batch-approve` | `{ payoutIds: string[] }` | Batch approves multiple pending payout requests in a single transaction. |
| `POST` | `/api/admin/finance/payouts/:id/reject` | `{ reason: string }` | Rejects payout request and reverses funds back to the professional's Linkprosoft wallet. |
| `POST` | `/api/admin/finance/payouts/:id/retry` | None | Retries a failed bank transfer payout. |

---

### Screen 9: Finance — Refunds (`/admin/finance/refunds`)

#### UI Components & Metrics Displayed:
1. **Finance Sub-Navigation Tabs**:
   - `Overview`, `Transactions`, `Escrow`, `Payouts`, `Refunds` (Active), `Commission`.
2. **KPI Stat Cards (4 Metrics)**:
   - `Total Refund`: `₦860,000`
   - `Pending`: `₦120,000`
   - `Completed`: `₦690,000`
   - `Failed`: `₦50,000`
3. **Refund Records Table**:
   - **Search & Filters**: Search by Refund ID (`#REF-9921`), Client Name, or Job Title; Filter by Status (`Successful`, `Pending`, `Failed`), Reason (`Service not satisfactory`, `Cancellation`, `Mutual Agreement`), Date range.
   - **Columns**: `Refund ID`, `Job`, `Client`, `Amount` (₦), `Reason`, `Status` (Badge), `Date Requested`, `View` (Action icon).
   - **Refund Actions**: Process Refund to Client Source Account / Card, View Gateway Refund Trace, Cancel Refund Request.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/finance/refunds/metrics` | None | Returns Total Refund Volume, Pending, Completed, and Failed refund totals. |
| `GET` | `/api/admin/finance/refunds` | `page=1&limit=10&search=&status=&reason=&startDate=&endDate=&sortBy=createdAt&sortOrder=desc` | Paginated table of all client refund requests and processed refunds. |
| `GET` | `/api/admin/finance/refunds/:id` | None | Full details of refund request, linked dispute/job, and payment gateway refund reference. |
| `POST` | `/api/admin/finance/refunds/:id/process` | `{ note?: string }` | Executes payment gateway refund back to the customer's original payment method. |
| `POST` | `/api/admin/finance/refunds/manual-initiate` | `{ jobId: string, clientId: string, amount: number, reason: string }` | Allows admin to initiate an emergency refund from platform reserves or escrow. |

---

### Screen 10: Finance — Commission & Settings (`/admin/finance/commission`)

#### UI Components & Metrics Displayed:
1. **Finance Sub-Navigation Tabs**:
   - `Overview`, `Transactions`, `Escrow`, `Payouts`, `Refunds`, `Commission` (Active).
2. **KPI Stat Cards (3 Metrics)**:
   - `Total Commission Earned`: `₦42.8M`
   - `Total Refund`: `₦860,000`
   - `Average Commission`: `₦860,000` (or Average Commission per completed job)
3. **Global Commission Settings Panel**:
   - `Standard Platform Commission`: Numeric input with percentage (`10 %`).
   - `Tiered Commission Toggle`: Toggle switch enabling dynamic volume-based commission tiers.
   - `Automatic Payouts Toggle`: Toggle switch enabling automatic gateway payouts upon job approval.
4. **Category-Based Percentage Overrides Table**:
   - Subtitle: `"Custom percentage overrides by service type"`
   - **Columns**: `Service Category` (e.g. `Plumbing`, `Carpentry`, `Painting`, `Electrical`, `Cleaning`), `Current Rate` (`12%`, `10%`, `8%`), `Actions` (Edit Rate pencil icon, Remove override).
   - Modal to add new category override or edit existing rate.
   - Pagination for service categories.

#### Required API Endpoints:

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/finance/commission/metrics` | None | Returns Total Commission Earned, Total Commission Refunded, and Average Commission. |
| `GET` | `/api/admin/finance/commission/settings` | None | Retrieves global commission configuration (standard rate %, tiered config, auto-payout flag). |
| `PUT` | `/api/admin/finance/commission/settings` | `{ standardCommissionPercentage: number, tieredCommissionEnabled: boolean, automaticPayoutsEnabled: boolean, tiers?: Array<{ minVolume: number, ratePercentage: number }> }` | Updates platform global commission and payout settings. |
| `GET` | `/api/admin/finance/commission/categories` | `page=1&limit=10` | Lists all service categories and their custom commission percentage overrides. |
| `POST` | `/api/admin/finance/commission/categories` | `{ categoryId: string, commissionPercentage: number }` | Creates a new category-specific commission percentage override. |
| `PATCH` | `/api/admin/finance/commission/categories/:id` | `{ commissionPercentage: number }` | Updates the commission percentage override for a specific service category. |
| `DELETE` | `/api/admin/finance/commission/categories/:id` | None | Removes category override (reverts category to standard platform commission rate). |

---

## 3. Comprehensive Master Endpoints Reference Table

```
========================================================================================================
METHOD   ROUTE                                                 DESCRIPTION
========================================================================================================
-- DASHBOARD & GLOBAL --
GET      /api/admin/dashboard/overview-metrics                 High-level KPI metrics (users, escrow, etc.)
GET      /api/admin/dashboard/revenue-escrow-chart             Time-series chart data for revenue & escrow
GET      /api/admin/dashboard/critical-alerts                  Needs attention counter & alert items
GET      /api/admin/dashboard/recent-activity                  Live platform activity audit stream
POST     /api/admin/announcements                              Broadcast in-app/email system announcement
GET      /api/admin/search                                     Global cross-entity admin search

-- USER MANAGEMENT --
GET      /api/admin/users/metrics                              User counts (Total, Clients, Pros, Suspended)
GET      /api/admin/users                                      Paginated users list with filters
GET      /api/admin/users/:id                                  Detailed user profile & dossier
PATCH    /api/admin/users/:id/status                           Update status (Active, Suspended, Banned)
GET      /api/admin/users/verification-queue                   Pending professional KYC verification requests
PATCH    /api/admin/users/:id/verification                     Approve or reject professional KYC
POST     /api/admin/users/:id/impersonate                      Generate session token to impersonate user

-- JOBS MANAGEMENT --
GET      /api/admin/jobs/metrics                               Jobs KPI counts (Total, Active, Completed, Disputed)
GET      /api/admin/jobs                                       Paginated marketplace jobs list with filters
GET      /api/admin/jobs/:id                                   Full job detail, milestones & escrow status
PATCH    /api/admin/jobs/:id/status                            Administrative job status override
POST     /api/admin/jobs/:id/force-cancel                      Force cancel job and resolve escrow

-- DISPUTES & REVIEWS --
GET      /api/admin/disputes/metrics                           Dispute KPI counts & total escrow held
GET      /api/admin/disputes                                   Paginated dispute cases with filters
GET      /api/admin/disputes/:id                               Full dispute dossier (evidence, messages, terms)
PATCH    /api/admin/disputes/:id/assign                        Assign admin investigator to case
POST     /api/admin/disputes/:id/arbitrate                     Arbitrate escrow settlement (Refund/Release/Split)
GET      /api/admin/reviews                                    User reviews list for moderation
DELETE   /api/admin/reviews/:id                                Delete / moderate abusive review

-- FINANCE: OVERVIEW --
GET      /api/admin/finance/overview-metrics                   Financial KPI cards (Volume, Revenue, Escrow, Payouts)
GET      /api/admin/finance/revenue-analytics                  Revenue vs Volume time-series analytics
GET      /api/admin/finance/earnings-breakdown                 Donut chart distribution dataset
GET      /api/admin/finance/escrow-summary                     Aggregated escrow summary breakdown
GET      /api/admin/finance/payout-summary                     Aggregated payout summary breakdown

-- FINANCE: TRANSACTIONS --
GET      /api/admin/finance/transactions                       Paginated transaction ledger
GET      /api/admin/finance/transactions/:id                   Transaction detail with gateway trace log
POST     /api/admin/finance/transactions/:id/reconcile         Re-query gateway to reconcile status
GET      /api/admin/finance/transactions/export                Export CSV/Excel of transaction records

-- FINANCE: ESCROW --
GET      /api/admin/finance/escrow/metrics                     Escrow KPI metrics (Held, Awaiting, Ready, Disputed)
GET      /api/admin/finance/escrow                             Paginated escrow accounts list
GET      /api/admin/finance/escrow/:id                         Detailed escrow contract & milestone state
POST     /api/admin/finance/escrow/:id/manual-release          Super Admin force release escrow to pro
POST     /api/admin/finance/escrow/:id/freeze                  Freeze escrow balance for anti-fraud

-- FINANCE: PAYOUTS --
GET      /api/admin/finance/payouts/metrics                    Payout KPI metrics (Pending, Processing, Done, Failed)
GET      /api/admin/finance/payouts                            Paginated payout requests list
GET      /api/admin/finance/payouts/:id                        Payout request detail & bank verification info
POST     /api/admin/finance/payouts/:id/approve                Approve and trigger bank transfer
POST     /api/admin/finance/payouts/batch-approve              Batch approve payout requests
POST     /api/admin/finance/payouts/:id/reject                 Reject payout & refund balance to wallet
POST     /api/admin/finance/payouts/:id/retry                  Retry failed bank payout transfer

-- FINANCE: REFUNDS --
GET      /api/admin/finance/refunds/metrics                    Refund KPI metrics (Total, Pending, Done, Failed)
GET      /api/admin/finance/refunds                            Paginated client refund requests table
GET      /api/admin/finance/refunds/:id                        Refund record with gateway trace
POST     /api/admin/finance/refunds/:id/process                Execute gateway refund to client card/bank
POST     /api/admin/finance/refunds/manual-initiate            Admin manual refund creation

-- FINANCE: COMMISSION & SETTINGS --
GET      /api/admin/finance/commission/metrics                 Commission KPI metrics (Earned, Refund, Average)
GET      /api/admin/finance/commission/settings                Get global commission & payout config
PUT      /api/admin/finance/commission/settings                Update global commission & payout config
GET      /api/admin/finance/commission/categories              List service category commission overrides
POST     /api/admin/finance/commission/categories              Create new category commission override
PATCH    /api/admin/finance/commission/categories/:id          Update category commission rate %
DELETE   /api/admin/finance/commission/categories/:id          Remove category override (revert to global)
========================================================================================================
```

---

## 4. Key Request / Response Schemas

### 4.1 Overview Metrics (`GET /api/admin/dashboard/overview-metrics`)
```json
{
  "success": true,
  "data": {
    "totalUsers": { "value": 18524, "growthPercentage": 12.4 },
    "verifiedUsers": { "value": 1930, "growthPercentage": 8.1 },
    "activeJobs": { "value": 1086, "growthPercentage": 5.3 },
    "escrowBalance": { "value": 248500.00, "currency": "NGN", "growthPercentage": -2.1 },
    "monthlyRevenue": { "value": 31240.00, "currency": "NGN", "growthPercentage": 14.8 },
    "openDisputes": { "value": 18, "growthPercentage": 0.0 },
    "pendingVerification": { "value": 54, "growthPercentage": 4.2 },
    "pendingPayouts": { "value": 27, "growthPercentage": 1.5 }
  }
}
```

### 4.2 Dispute Arbitration Submission (`POST /api/admin/disputes/:id/arbitrate`)
```json
// Request Body
{
  "decision": "SPLIT",
  "clientSharePercentage": 60,
  "professionalSharePercentage": 40,
  "resolutionNotes": "Work was partially delivered according to milestone 1 specifications, but milestone 2 was not completed satisfactorily.",
  "penaltyApplied": false
}

// Response Body
{
  "success": true,
  "message": "Dispute resolved successfully. Escrow funds distributed.",
  "data": {
    "disputeId": "DSP-1024",
    "status": "RESOLVED",
    "totalEscrowAmount": 85000.00,
    "clientRefundAmount": 51000.00,
    "professionalPayoutAmount": 34000.00,
    "resolvedAt": "2026-08-31T02:30:00.000Z",
    "resolvedBy": "admin_uuid_123"
  }
}
```

### 4.3 Commission Configuration (`PUT /api/admin/finance/commission/settings`)
```json
// Request Body
{
  "standardCommissionPercentage": 10.0,
  "tieredCommissionEnabled": true,
  "automaticPayoutsEnabled": true,
  "tiers": [
    { "minVolume": 0, "ratePercentage": 10.0 },
    { "minVolume": 1000000, "ratePercentage": 8.5 },
    { "minVolume": 5000000, "ratePercentage": 7.0 }
  ]
}

// Response Body
{
  "success": true,
  "message": "Commission settings updated successfully",
  "data": {
    "standardCommissionPercentage": 10.0,
    "tieredCommissionEnabled": true,
    "automaticPayoutsEnabled": true,
    "updatedAt": "2026-08-31T02:30:00.000Z"
  }
}
```

---

## 5. Implementation Roadmap & Backend Integration Steps

1. **Step 1: Admin Auth & Security Middleware**
   - Implement `verifySuperAdmin` and `verifyAdmin` JWT middlewares.
   - Implement `AdminAuditLogger` middleware to capture admin mutation requests.

2. **Step 2: Core Overview & Metrics Aggregate Pipelines**
   - Create MongoDB aggregation pipelines / SQL views to compute dashboard KPI cards and analytics series without locking operational tables.

3. **Step 3: User & KYC Verification Flow**
   - Implement `/api/admin/users` querying and verification document approval/rejection endpoints.

4. **Step 4: Dispute Arbitration & Escrow Resolution**
   - Implement atomic transactional dispute arbitration to split escrow funds between client and professional wallet balances safely.

5. **Step 5: Finance & Payment Gateway Reconciliation**
   - Connect Payouts to Paystack Transfers / Flutterwave Payouts API.
   - Implement automatic webhook listeners and admin manual reconciliation tools for pending/failed transfers.

6. **Step 6: Commission & Dynamic Fee Engine**
   - Implement dynamic fee calculation service that evaluates category overrides before falling back to the standard platform commission percentage during escrow settlement.
