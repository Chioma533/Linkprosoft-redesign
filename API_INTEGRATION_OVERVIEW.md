# Linkprosoft Professional Portal — API Integration & Backend Roadmap

## Executive Summary

This document provides an exhaustive, screen-by-screen audit of all user interfaces within `src/pages/professionals/`. It details every mock data structure, interactive control, state dependency, and required backend endpoint necessary to transition the Linkprosoft Professional portal from static mock data to a fully production-ready backend integration.

---

## 1. System Architecture & Common Dependencies

### 1.1 Authentication & User Context
- **Current Mock / State**: Hardcoded fallback user `"Samuel"`, user payload in `useAuthStore`.
- **Backend Requirement**: 
  - JWT / Session Bearer token in all HTTP headers (`Authorization: Bearer <token>`).
  - Current authenticated professional context (`/api/profile` or `/api/auth/me`).
  - Professional verification status (`isVerified`, `badgeLevel`, `kycStatus`).

### 1.2 Shared Real-Time Events (WebSockets / Server-Sent Events)
- Direct Chat messages & typing indicators.
- In-app notification pushes (new job offers, escrow updates, application status changes).
- Escrow milestone releases and wallet balance updates.

---

## 2. Subpage Integration Requirements

---

### 2.1 Overview Subpage (`OverviewSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **Dashboard KPI Stats (`DashboardStats`)**:
   - `earningsTotal` (Mocked in store: `₦500,000`)
   - `upcomingJobsCount` (Mocked: `172`)
   - `completedJobsCount` (Mocked: `288`)
   - `performancePercentage` (Mocked: `80%`)
2. **Active Jobs Table**:
   - `activeJobs` filtered from `myJobs` array (mock jobs in `projectService.js`).
   - Fields: `orderId`, `title`, `category`, `client`, `status`, `paymentStatus`.
3. **Recent Messages Widget**:
   - Filter dropdown: `Unread` / `All`.
   - Message items: `sender`, `text`, `time`, `unread` status.
4. **Notifications Widget**:
   - Notification items: `title`, `body`, `time`, `unread` status.
5. **Your Performance Widget (`PerformanceMetrics.jsx`)**:
   - `responseRate`, `successRate`, `reviews`, `reviewsCount`.
6. **List a Service Button**:
   - Desktop action button triggers service creation flow.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **KPI Metrics** | `GET` | `/api/professionals/dashboard/metrics` | Fetches aggregated stats for earnings, upcoming jobs, completed jobs, and performance % | None (reads auth token) |
| **Active Jobs** | `GET` | `/api/professionals/jobs?status=Active&limit=5` | Fetches paginated active jobs assigned to the professional | `status=Active`, `limit=5`, `page=1` |
| **Recent Messages** | `GET` | `/api/messages/recent` | Fetches latest unread or all conversation previews | `filter=unread|all`, `limit=4` |
| **Notifications** | `GET` | `/api/notifications` | Fetches latest notifications for current professional | `filter=unread|all`, `limit=5` |
| **Performance Data** | `GET` | `/api/professionals/performance` | Returns response rate, job completion rate, rating score, and timeframe analytics | `period=this_week|this_month` |
| **Export Data** | `GET` | `/api/professionals/jobs/export` | Generates / retrieves downloadable data for active jobs report | `type=csv|pdf|xlsx`, `status=Active` |
| **Create Service Listing** | `POST` | `/api/services` | Creates a new professional service offering | `{ title, categoryId, description, basePrice, turnaroundTime }` |

---

### 2.2 Browse Jobs Subpage (`BrowseJobsSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **KPI Header Cards**: `activeJobsCount`, `upcomingJobsCount`, `completedJobsCount`, `performancePercentage`.
2. **Search & Filter Bar (`ProfessionalSearchBar`)**:
   - Query text (`searchQuery`)
   - Category filter
   - Location filter (City/State)
   - Budget range filter (Min / Max)
   - Client rating filter
3. **Job Cards (`JobCard.jsx`)**:
   - `id`, `orderId`, `title`, `description`, `category`, `location`, `budget`, `postedAt`, `datePosted`, `client`, `paymentStatus`, `isBookmarked`.
4. **Job Application Action**:
   - `handleApplyClick`: Currently fires a local `toast.success()`. Needs modal for bid proposal / cover letter submission.
5. **Pagination**:
   - Handled purely client-side over static array.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Browse Jobs Feed** | `GET` | `/api/jobs` | Paginated search across all open job postings with server-side filters | `page=1`, `limit=9`, `search=`, `category=`, `location=`, `minBudget=`, `maxBudget=`, `minRating=`, `sortBy=newest` |
| **Job Details Modal / Quick View** | `GET` | `/api/jobs/:id` | Full details of a single job listing | None |
| **Submit Proposal / Apply** | `POST` | `/api/applications` | Submits a formal bid / application for a job | `{ jobId: string, bidAmount: number, coverLetter: string, estimatedDeliveryDays?: number }` |
| **Bookmark Job** | `POST` | `/api/jobs/:id/bookmark` | Toggles bookmark / saved status for a job posting | None |
| **Job Category List** | `GET` | `/api/search/filters` | Dynamic categories, locations, and budget brackets for filter dropdowns | None |

---

### 2.3 Applications Subpage (`ApplicationsSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **Application Stats Cards**:
   - Application Sent (`activeJobsCount`)
   - Under Review (`upcomingJobsCount`)
   - Accepted (`completedJobsCount`)
   - Rejected (`performancePercentage`)
2. **Applications Table**:
   - Fields: `title`, `client`, `category`, `appliedOn`, `status` (`Under review`, `Accepted`, `Rejected`), `lastUpdate`, `budget`.
3. **Filters & Search**:
   - Search input (Job title / client name).
   - Category dropdown (`categoryOptions`).
   - Status dropdown (`statusOptions`).
4. **Actions**:
   - "View" action button: currently placeholder / no-op.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Application Metrics** | `GET` | `/api/applications/metrics` | Returns counts for `total_applied`, `under_review`, `accepted`, `rejected` | None |
| **Applications List** | `GET` | `/api/applications` | Fetches paginated applications submitted by current professional | `page=1`, `limit=10`, `status=`, `category=`, `search=`, `startDate=`, `endDate=` |
| **Application Details** | `GET` | `/api/applications/:id` | Detailed view of the proposal, client feedback, and status history | None |
| **Withdraw Application** | `DELETE` | `/api/applications/:id` | Allows professional to retract a pending proposal | None |
| **Update Proposal** | `PUT` | `/api/applications/:id` | Updates bid amount or proposal cover letter before acceptance | `{ bidAmount: number, coverLetter: string }` |

---

### 2.4 My Jobs Subpage (`MyJobsSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **KPI Header Cards**: Active Jobs, Upcoming Jobs, Completed Jobs, Total Earnings (`₦500,000`).
2. **Jobs Table & Mobile Cards**:
   - Fields: `title`, `client`, `category`, `datePosted` (Schedule date/time), `budget`, `status` (`Active`, `Pending`, `Completed`, `Cancelled`).
3. **Filters**:
   - Search keyword.
   - Category dropdown filter.
   - Status dropdown filter.
4. **Row Action**:
   - Clicking "View" sets `selectedJob` in local Zustand store and routes to `project-details` subpage.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **My Jobs List** | `GET` | `/api/jobs/me` | Fetches contracted / assigned jobs for the logged-in professional | `page=1`, `limit=10`, `status=Active|Pending|Completed|Cancelled`, `category=`, `search=` |
| **My Jobs Summary Stats** | `GET` | `/api/professionals/jobs/summary` | Summary counters for active, upcoming, completed, and total contracted earnings | None |
| **Update Job Progress** | `PATCH` | `/api/assignments/:id/progress` | Updates completion milestone percentage or internal job status | `{ status: "In Progress" | "Completed", progressPercent: number }` |

---

### 2.5 Project Details Subpage (`ProjectDetailsSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **Job Header & Metadata**:
   - Fallback object: `ORD657783`, `Wardrobe Installation`, `Carpentry`, `Lekki Lagos`, `₦500,000`, `Samuel owoniyi`, `In Progress`.
   - Asset images: `handyman.jfif`, `IMG-20260704-WA0195.jpg`, `IMG-20260704-WA0196.jpg`.
2. **Escrow Protected Payment Banner**:
   - Total Project Budget (computed with mock platform fee: `job.budget * 1.08`).
   - Released amount (`job.budget * 0.3`).
   - Remaining balance (`job.budget * 0.7`).
3. **Progress Gallery**:
   - 4 hardcoded static image tiles.
   - Needs dynamic media upload for project proof-of-work (photos before, during, after).
4. **Project Message Box**:
   - Client name, online status, static chat bubble (`"Going well! I've just finished..."`).
   - Chat input field (`chatMessage`) currently unlinked to messaging service.
5. **Project Actions & Modal Flows (`ProjectModals.jsx`)**:
   - **Submit Project**: Triggers `confirm-submit` modal -> Calls `success-submit` -> Links to Wallet / Home.
   - **Cancel Project**: Triggers `confirm-cancel` modal -> Calls `success-cancel`.
   - **Open Dispute**: Triggers browser `alert("Dispute process opened successfully.")`.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Project Full Details** | `GET` | `/api/assignments/:id` | Full contract, client details, job specifications, milestones, and payment breakdown | None |
| **Escrow Status & Breakdown** | `GET` | `/api/payments/escrow/:assignmentId` | Returns total escrow deposit, released milestones, platform fees, and held balance | None |
| **Upload Progress Media** | `POST` | `/api/assignments/:id/gallery` | Uploads proof-of-work images / media to cloud storage (S3 / Cloudinary) | `FormData: { files: File[], stage: "before" | "progress" | "completed", caption: string }` |
| **Get Progress Gallery** | `GET` | `/api/assignments/:id/gallery` | Retrieves all uploaded progress images for this project | None |
| **Project Direct Chat** | `GET` | `/api/assignments/:id/messages` | Fetches conversation thread linked directly to this job order | None |
| **Send Project Message** | `POST` | `/api/assignments/:id/messages` | Sends a message to the client for this specific assignment | `{ message: string, attachments?: string[] }` |
| **Submit Project Completion** | `POST` | `/api/assignments/:id/submit` | Marks project as completed by professional and triggers client inspection / escrow release request | `{ notes: string, completedMediaIds: string[] }` |
| **Request Project Cancellation** | `POST` | `/api/assignments/:id/cancel` | Submits a cancellation request with reason | `{ reason: string, explanation: string }` |
| **Open Dispute** | `POST` | `/api/assignments/:id/dispute` | Opens a formal dispute ticket with Linkprosoft mediation team | `{ reason: string, description: string, evidenceUrls: string[] }` |

---

### 2.6 Wallet & Payouts Subpage (`WalletSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **Wallet Balances & Stats**:
   - Total Balance: `₦500,000` (Toggle show/hide eye icon).
   - Stats Cards: Available Balance (`₦500,000`), Pending Earnings (`₦59,000`), Total Earnings (`₦1.8M`), Total Withdrawn (`₦1.8M`).
2. **Active Escrow Payments Table**:
   - 4 hardcoded items (`"Wardrobe Installation"`, `"Jonathan D"`, `₦22,500`, `"Awaiting Funding"` / `"In progress"`).
3. **Recent Transactions Feed**:
   - 3 hardcoded items (`"Wallet Top-Up"`, `"12th July 2026"`, `₦50,000`, `"Successful"`).
4. **Upcoming Payments Feed**:
   - 3 hardcoded update cards.
5. **Withdraw Funds Multi-Step Modal**:
   - **Step 1 (Amount & Bank Details)**: Hardcoded bank destination (`GT Bank • Samuel Owoniyi • *****37749`), static Linkprosoft Fee calculation (`₦2,000`), static estimated arrival (`INSTANTLY`).
   - **Step 2 (PIN Verification)**: Virtual numpad entering 4-digit PIN (currently purely simulated with timeout transition).
   - **Step 3 (Success Receipt)**: Hardcoded success message (`₦50,000 Deposited...`).
6. **Top-Up Wallet Button**:
   - Triggers withdraw modal rather than a deposit gateway.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Wallet Summary** | `GET` | `/api/wallet/summary` | Fetches available balance, ledger balance, pending escrow earnings, total earnings, and total payouts | None |
| **Active Escrows** | `GET` | `/api/wallet/escrows` | List of all ongoing job escrows where funds are held/processing | `status=active|pending_funding|disputed`, `page=1` |
| **Transaction History** | `GET` | `/api/wallet/transactions` | Paginated transaction history (credits, debits, withdrawals, fees) | `page=1`, `limit=10`, `type=all|withdrawal|credit|escrow` |
| **Upcoming / Pending Payouts** | `GET` | `/api/wallet/upcoming-payouts` | Upcoming milestone releases awaiting client approval | None |
| **Get Saved Bank Accounts** | `GET` | `/api/wallet/bank-accounts` | Fetches verified bank payout destinations | None |
| **Add / Verify Bank Account** | `POST` | `/api/wallet/bank-accounts/verify` | Resolves NUBAN account number with Paystack / Monnify / NIBSS | `{ accountNumber: string, bankCode: string }` |
| **Initiate Withdrawal** | `POST` | `/api/wallet/withdraw` | Requests payout to verified bank account | `{ amount: number, bankAccountId: string }` |
| **Verify PIN & Authorize Payout** | `POST` | `/api/wallet/withdraw/authorize` | Authorizes pending withdrawal with encrypted 4-digit security PIN | `{ withdrawalId: string, pin: string }` |
| **Initialize Top-Up Deposit** | `POST` | `/api/wallet/top-up` | Initializes Paystack / Flutterwave deposit link | `{ amount: number, paymentMethod: "card" | "bank_transfer" }` |
| **Set / Change Transaction PIN** | `POST` | `/api/wallet/pin` | Sets or updates the 4-digit wallet security PIN | `{ currentPin?: string, newPin: string, otpCode: string }` |

---

### 2.7 Profile Subpage (`ProfileSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **Cover & Profile Card**:
   - Static images: `IMG-20260704-WA0194.jpg`, `handyman.jfif`.
   - Name: `Samuel Marvelous .O`, Badge: `Pro`, Title: `A professional Plumber with vast years of experience...`, Location: `Lekki Lagos`, Joined: `Jan 2020`.
2. **About Me**:
   - Hardcoded biography paragraph.
3. **Performance Metric Boxes**:
   - Job Success (`100%`), Total Jobs (`186 jobs`), Experience (`8 Yrs`), Avg Response (`78%`).
4. **Skills and Services**:
   - Array: `["Carpentry", "Installation", "Tv console", "Wardrobe", "Chairs", "Tables"]`.
5. **Certifications List**:
   - 3 hardcoded certs (`Certified Master Carpenter`, `Linkprosoft Verified`, `Safety Certified`).
6. **Portfolio Gallery**:
   - 4 hardcoded portfolio items (`Modern Bathroom Sink`, `Bespoke TV Console`, `Custom Bedroom Wardrobe`, `Living Room Cabinet`).
7. **Reviews and Rating**:
   - 2 hardcoded reviews from `"Emily Ogwuche"`.
8. **Edit Profile Action**:
   - Button currently has no modal or form hookup.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Get Full Profile** | `GET` | `/api/profile` | Fetches complete professional profile, bio, badges, ratings, and stats | None |
| **Update Profile Details** | `PUT` | `/api/profile` | Updates full name, bio, title, headline, location, hourly rate | `{ fullName, title, bio, location, yearsExperience }` |
| **Update Avatar / Cover** | `POST` | `/api/profile/media` | Uploads new avatar or cover banner image | `FormData: { avatar?: File, coverImage?: File }` |
| **Get Skills** | `GET` | `/api/skills` | Lists professional's declared skills | None |
| **Add / Update Skills** | `POST` | `/api/skills` | Updates skill tags array | `{ skillNames: string[] }` |
| **Get Certifications** | `GET` | `/api/profile/certifications` | Fetches vetted certifications and badge proof | None |
| **Add Certification** | `POST` | `/api/profile/certifications` | Submits certificate for verification | `FormData: { title, issuer, issueDate, documentFile: File }` |
| **Get Portfolio** | `GET` | `/api/profile/portfolio` | Retrieves portfolio items with images and categories | None |
| **Add Portfolio Item** | `POST` | `/api/profile/portfolio` | Adds a new project case study to portfolio | `FormData: { title, category, description, images: File[] }` |
| **Delete Portfolio Item** | `DELETE` | `/api/profile/portfolio/:id` | Removes portfolio item | None |
| **Get Client Reviews** | `GET` | `/api/profile/reviews` | Paginated reviews & star ratings left by buyers | `page=1`, `limit=5`, `ratingFilter=` |

---

### 2.8 Schedule Subpage (`ScheduleSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **Stats Cards**:
   - Today's Job (`100`), Upcoming (`88`), Pending Deadline (`8`), Rejected (`100`).
2. **Calendar Widget (`CalendarWidget.jsx`)**:
   - Selected date defaulted to `"2026-07-02"`.
3. **Schedule Table**:
   - Filtered from `mockSchedules` in `notificationService.js`.
   - Fields: `orderId`, `jobTitle`, `location`, `client`, `time`, `date`.
4. **Time Filters**:
   - Buttons: `This week`, `This month`.
5. **Row Action**:
   - "View Details" sets `selectedJob` and opens `project-details`.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Schedule KPIs** | `GET` | `/api/schedules/metrics` | Fetches appointment counts for today, upcoming, near-deadline, and cancelled | None |
| **Schedules by Date / Range** | `GET` | `/api/schedules` | Fetches appointments and job milestones for calendar view | `date=YYYY-MM-DD` or `startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` |
| **Calendar Event Indicators** | `GET` | `/api/schedules/calendar-dots` | Returns dates with active bookings for highlighting in calendar widget | `month=YYYY-MM` |
| **Create Custom Schedule / Slot** | `POST` | `/api/schedules` | Sets appointment or marks professional availability slot | `{ title, date, startTime, endTime, jobId?: string }` |
| **Reschedule Appointment** | `PATCH` | `/api/schedules/:id` | Reschedules an existing job site visit | `{ newDate, newTime, reason }` |

---

### 2.9 Chat / Messaging Subpage (`ChatSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **Threads List**:
   - Initialized from `INITIAL_THREADS` in `messagesData.js` (6 mock threads).
   - Tabs: `Unread`, `Archives`, `Blocked`.
   - Search input over sender name and preview text.
2. **Conversation Header & Message Stream**:
   - Messages array (`from: "me" | "them"`, `text`, `time`, `read`).
3. **Send Message Composer**:
   - Local `handleSendMessage` pushes to in-memory React state with fake timestamps.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Get Conversations** | `GET` | `/api/chat/threads` | Fetches all active chat channels with latest message, unread count, and recipient status | `tab=unread|archives|blocked`, `search=` |
| **Get Thread Messages** | `GET` | `/api/chat/threads/:threadId/messages` | Paginated message history for a conversation | `page=1`, `limit=30`, `beforeMessageId=` |
| **Send Message** | `POST` | `/api/chat/threads/:threadId/messages` | Posts a new message (text and/or attachments) | `FormData: { text?: string, files?: File[] }` |
| **Mark Thread as Read** | `PATCH` | `/api/chat/threads/:threadId/read` | Marks unread messages in thread as read | None |
| **Archive / Block Thread** | `PATCH` | `/api/chat/threads/:threadId/status` | Moves conversation to archives or blocks user | `{ status: "active" | "archived" | "blocked" }` |
| **Create Direct Thread** | `POST` | `/api/chat/threads` | Initiates conversation with a client/buyer | `{ recipientId: string, jobId?: string }` |
| **WebSocket Stream** | `WS` | `/ws/chat` | Real-time bi-directional chat socket (events: `message.new`, `user.typing`, `user.online_status`, `message.read_receipt`) | Handshake with auth token |

---

### 2.10 Premium Subpage (`PremiumSubpage.jsx`)

#### Current Mock Data & Hardcoded Items:
1. **New Users Social Proof Badge**: `"Over 2,800 new users joined today"`.
2. **Feature Matrix**: Hardcoded comparisons table for Free vs Pro tiers.
3. **Plan Selector & Pricing**:
   - Free Access: `$0`
   - Linkprosoft PRO: `$10 / Month`
4. **Checkout Action**:
   - `handleContinue` displays static toast.

#### Required Backend Integrations & Endpoints:

| Feature | Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| **Get Subscription Plans** | `GET` | `/api/subscriptions/plans` | Fetches dynamic feature tiers, pricing (NGN / USD), and billing cycles | None |
| **Get Current Subscription** | `GET` | `/api/subscriptions/current` | Returns professional's active subscription tier, renewal date, and perks | None |
| **Initialize Subscription Checkout** | `POST` | `/api/subscriptions/subscribe` | Initializes recurring billing with payment gateway (Paystack / Stripe) | `{ planId: "pro_monthly" | "pro_annual", paymentMethodId?: string }` |
| **Cancel / Downgrade Subscription** | `POST` | `/api/subscriptions/cancel` | Schedules downgrade to free tier at end of billing cycle | `{ reason?: string }` |
| **Subscription Invoices** | `GET` | `/api/subscriptions/invoices` | Downloadable past billing receipts | None |

---

## 3. Comprehensive Master API Specification

Below is the master RESTful API contract matrix covering every subpage in the professional section:

```
AUTHENTICATION & PROFILE
  GET    /api/profile                                -> Fetch professional profile & stats
  PUT    /api/profile                                -> Update professional details & bio
  POST   /api/profile/media                          -> Upload avatar & cover photo
  GET    /api/profile/certifications                 -> List certifications & verifications
  POST   /api/profile/certifications                 -> Upload new certification
  GET    /api/profile/portfolio                      -> List portfolio projects
  POST   /api/profile/portfolio                      -> Add new portfolio project
  DELETE /api/profile/portfolio/:id                  -> Delete portfolio project
  GET    /api/profile/reviews                        -> List client reviews & ratings

DASHBOARD & ANALYTICS
  GET    /api/professionals/dashboard/metrics        -> Overview top KPI stats
  GET    /api/professionals/performance              -> Performance meters (response, success rate)
  GET    /api/notifications                          -> Notification feed
  PATCH  /api/notifications/:id/read                 -> Mark notification as read
  PATCH  /api/notifications/mark-all-read            -> Mark all notifications read

JOBS & APPLICATIONS
  GET    /api/jobs                                   -> Search open jobs (browse jobs)
  GET    /api/jobs/:id                               -> Get single job listing
  POST   /api/jobs/:id/bookmark                      -> Toggle bookmark
  GET    /api/jobs/me                                -> Assigned/contracted jobs (my jobs)
  GET    /api/applications                           -> Submitted proposals & statuses
  POST   /api/applications                           -> Submit new bid / proposal
  GET    /api/applications/:id                       -> Application detail & timeline
  DELETE /api/applications/:id                       -> Retract pending application
  GET    /api/search/filters                         -> Category, location, price filter metadata

PROJECT MANAGEMENT & ESCROW
  GET    /api/assignments/:id                        -> Project workspace detail
  GET    /api/payments/escrow/:assignmentId          -> Escrow balance & milestone release data
  GET    /api/assignments/:id/gallery                -> Progress gallery photos
  POST   /api/assignments/:id/gallery                -> Upload proof-of-work photo
  POST   /api/assignments/:id/submit                 -> Complete project / request fund release
  POST   /api/assignments/:id/cancel                 -> Request contract cancellation
  POST   /api/assignments/:id/dispute                -> Open dispute ticket

WALLET & FINANCIALS
  GET    /api/wallet/summary                         -> Available, pending, total earnings
  GET    /api/wallet/escrows                         -> Active escrow contracts
  GET    /api/wallet/transactions                    -> Transaction history
  GET    /api/wallet/upcoming-payouts                -> Upcoming processing payments
  GET    /api/wallet/bank-accounts                   -> Saved bank destinations
  POST   /api/wallet/bank-accounts/verify            -> Resolve NUBAN bank account details
  POST   /api/wallet/withdraw                        -> Initiate withdrawal payout
  POST   /api/wallet/withdraw/authorize              -> Authorize payout with transaction PIN
  POST   /api/wallet/top-up                          -> Initialize wallet deposit
  POST   /api/wallet/pin                             -> Set or change 4-digit PIN

SCHEDULE & CALENDAR
  GET    /api/schedules                              -> Appointments list by date / range
  GET    /api/schedules/metrics                      -> Schedule KPI metrics
  GET    /api/schedules/calendar-dots                -> Active booking indicator dots for month
  POST   /api/schedules                              -> Create appointment or availability slot
  PATCH  /api/schedules/:id                          -> Reschedule appointment

MESSAGING & REAL-TIME CHAT
  GET    /api/chat/threads                           -> Conversation threads list
  GET    /api/chat/threads/:threadId/messages        -> Thread message history
  POST   /api/chat/threads/:threadId/messages        -> Send message / upload media
  PATCH  /api/chat/threads/:threadId/read            -> Mark messages read
  PATCH  /api/chat/threads/:threadId/status          -> Archive or block thread
  WS     /ws/chat                                    -> Real-time chat socket

SUBSCRIPTIONS
  GET    /api/subscriptions/plans                    -> Feature comparison & pricing tiers
  GET    /api/subscriptions/current                  -> Current subscription status
  POST   /api/subscriptions/subscribe                -> Initialize Pro upgrade
  POST   /api/subscriptions/cancel                   -> Cancel recurring plan
```

---

## 4. State Management & Service Migration Plan

### 4.1 Step 1: Update API Paths (`src/utils/apiPaths.js`)
Add all missing endpoint keys for:
- `WALLET`: `/api/wallet/*`
- `SCHEDULES`: `/api/schedules/*`
- `CHAT`: `/api/chat/*`
- `SUBSCRIPTIONS`: `/api/subscriptions/*`
- `DISPUTES`: `/api/assignments/:id/dispute`
- `PROGRESS_GALLERY`: `/api/assignments/:id/gallery`

### 4.2 Step 2: Remove Hardcoded Fallbacks from Services
- Remove `mockJobs`, `mockApplications`, `mockMessages`, `mockNotifications`, `mockPerformance`, and `mockSchedules` from:
  - `src/api/services/projectService.js`
  - `src/api/services/notificationService.js`
- Create dedicated service modules:
  - `src/api/services/walletService.js`
  - `src/api/services/profileService.js`
  - `src/api/services/chatService.js`
  - `src/api/services/scheduleService.js`
  - `src/api/services/subscriptionService.js`

### 4.3 Step 3: Implement Loading & Error States in UI Components
- Replace in-memory mock initialization with query hooks or Zustand asynchronous actions.
- Ensure all tables and cards use skeleton loaders while awaiting live API responses.
- Implement toast alerts for error handling with server error messages.
