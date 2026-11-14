# Linkprosoft: First-Launch User Flow & Onboarding Recommendations

## Goal

Get a newly registered person to their first meaningful action quickly, without hiding the trust and safety steps that make Linkprosoft valuable.

- **Employer (hiring):** publish a job or contact a suitable professional.
- **Professional (offering skills):** complete a credible profile/verification and apply for a suitable job.

The product should use progressive onboarding: ask only for information needed for the next action, then return the user to the task. Do not present every popup at once.

## Recommended first-session flow

```text
Landing page
  -> Sign up / Google sign-in
  -> Choose intent: Hire | Offer skills
  -> (Professional only) choose professional type
  -> Create account -> verify email
  -> Role-aware welcome screen
  -> First-action checklist + contextual walkthrough
  -> Browse/post/apply/message
  -> Verification, wallet, and escrow at the point they become necessary
```

### 1. Account creation and email verification

Keep the current selection sequence:

1. “What brings you here today?” — **I’m looking to hire** or **I’m offering my skills**.
2. For professionals, select digital, non-digital, or government-recognised.
3. Create account or continue with Google.
4. Confirm email with OTP.

After successful OTP verification, show a short success screen, but change its single CTA based on role:

| Role | Heading | CTA | Destination |
|---|---|---|---|
| Employer | “You’re ready to find the right professional” | `Find professionals` | `/home` |
| Professional | “Let’s get your first opportunity” | `Set up my profile` | Profile/verification starting point |

The success screen should also contain a secondary, low-emphasis `Explore first` link. This prevents forced onboarding while keeping the primary path clear.

## Employer flow (hiring)

### First login destination

Send a new employer to **Browse Professionals** (`/home`) rather than the analytics dashboard. It immediately demonstrates marketplace value. Returning employers can continue to land on **Employer Overview** (`/employer/dashboard`).

### First-session checklist

Place a compact, dismissible card at the top of the browse page or dashboard. Persist completion on the server per user.

1. **Tell us what you need** — search by service and location.
2. **Choose how to hire** — contact a professional or post a job.
3. **Fund safely when you hire** — explain that escrow protects both parties.

Use one primary CTA at a time:

| State | Primary CTA | Secondary path |
|---|---|---|
| No search or posted job | `Find a professional` | `Post a job instead` |
| Search results shown | `View profile` | Refine search |
| Profile viewed | `Message` or `Request a quote` | Save professional |
| No active job | `Post your first job` | Browse professionals |
| Job posted | `Review applicants` | Share job |
| Candidate accepted | `Fund escrow` | Message professional |

### Employer walkthrough: only three tooltips

Show this tour once, after the page has loaded and only if the user has no search, message, or job activity:

1. Point to the search bar: “Start with the service you need and your location.”
2. Point to a professional card: “Review skills, verification and ratings before you contact someone.”
3. Point to the post-job entry point: “Need several quotes? Post a job and receive applications.”

End with `Got it` and `Skip tour`. Do not use a modal for every step; a spotlight/tooltip is enough.

### Job-posting flow

The existing three-step job wizard is a good first conversion path. Improve its finish state:

1. Job details and skill.
2. Budget, location and timing.
3. Review and publish.
4. Success modal: “Your job is live.” Primary CTA `View applications`; secondary CTA `Browse professionals`.

If there are no applicants after a sensible period, send an in-app notification (and optional email) with a single action: `Edit job` or `Browse suggested professionals`.

## Professional flow (offering skills)

### First login destination

Do not send a brand-new professional directly into a full dashboard. Send them to a lightweight **profile readiness** screen, then to matched jobs (`/professional/home`).

The screen should show a clear progress bar, estimated time, and a `Browse jobs first` escape hatch:

1. Add name, photo, location and short introduction.
2. Add at least one service/skill and experience level.
3. Add work samples/credentials where relevant.
4. Start verification.

For launch, require steps 1–2 before applying. Make portfolio and full verification strongly encouraged, not a surprise block until the user reaches an action that requires them.

### First-session checklist

On matched jobs, show:

1. **Complete your profile** — needed for good matches.
2. **Verify your identity** — builds client trust and is required before payment.
3. **Apply to your first job** — choose a role that suits your skills.

The existing verification banner is a good pattern. Its dismissal should be persisted and it should return at high-intent moments (attempting to apply, accepting an offer, or receiving payment), rather than appearing repeatedly on every visit.

### Professional walkthrough: three tooltips

Show only when the person has no applications:

1. Skills selector: “Choose a skill to see the most relevant openings.”
2. Filter/search: “Narrow results by location, budget or job type.”
3. Job card CTA: “Open a job to review the brief and apply.”

On the first application, guide the user through a short proposal: greeting, relevant experience, availability, expected price, and optional attachment. Save drafts automatically.

### Gated actions and explanations

| Moment | Requirement | Message / CTA |
|---|---|---|
| Trying to apply without skills/profile basics | Complete profile basics | `Complete profile` |
| Trying to receive/withdraw earnings | Identity and payment verification | `Verify account` |
| Receiving an offer | Review scope and amount | `Review offer` |
| Accepting an offer | Confirm scope and escrow terms | `Accept offer` |

Always explain *why* an action is blocked and provide the next action in the same dialog. Avoid dead ends such as a disabled Apply button with no reason.

## Returning-user routing

Replace a single role-only post-login redirect with a small decision table based on saved onboarding state. The intended route should be calculated after session restoration, not inferred solely from whether a user is authenticated.

| User state | Employer route | Professional route |
|---|---|---|
| Email unverified | Email verification | Email verification |
| New; profile essentials missing | Browse professionals with checklist | Profile readiness |
| Essentials complete; no first conversion | `/home` browse professionals | `/professional/home` matched jobs |
| Has active work | `/employer/dashboard` overview | Applications/work dashboard |
| Has unread conversation or required action | Destination remains above; show notification badge/card | Destination remains above; show notification badge/card |

Do not automatically redirect an established user to verification simply because it is incomplete. Use contextual prompts instead, except for actions that legally or operationally require verification.

## Popup and notification rules

Use four message types consistently:

| Type | When | Example |
|---|---|---|
| Full-screen step | Irreversible or essential setup | Email OTP, profile readiness |
| Modal | A decision needs attention | Accept offer, fund escrow, submit verification |
| Spotlight tooltip | Introduce a feature in context | Search, filters, post-job button |
| Toast/in-app notification | Confirm a completed event | “Job published”, “New application received” |

Rules:

- Never display more than one blocking modal in a session unless the user completes the first one.
- Every tour must have `Skip` and be reopenable from Help/Settings.
- Remember dismissal, completion, and last-shown time across devices.
- Do not show tours while a user is in a wizard, writing a message, or completing verification.
- Respect reduced motion and keyboard navigation; move focus into modals and return it on close.

## Lifecycle engagement

Use in-app notifications first, with email/push only where consent exists:

- **Employer:** profile viewed/saved (if supported), new applicant, new message, quote received, escrow needs funding, professional marked work complete, review reminder.
- **Professional:** profile incomplete reminder, relevant job match, application viewed, new message, offer received, verification approved/rejected, payment released, review reminder.

Each notification should state the event and contain one direct destination. Batch low-priority job-match alerts so they do not become noise.

## Product data needed to make this reliable

Persist a small `onboarding` object with the user/profile, for example:

```json
{
  "emailVerified": true,
  "profileEssentialsComplete": false,
  "verificationStatus": "not_started",
  "firstSearchCompleted": false,
  "firstJobPosted": false,
  "firstApplicationSubmitted": false,
  "tourCompleted": { "employerBrowse": false, "professionalJobs": false },
  "checklistDismissed": false
}
```

Track funnel events with role and acquisition source: account created, OTP verified, profile essentials completed, verification started/completed, first search, first profile view, first job posted, first application, first conversation, offer accepted, escrow funded, and work completed. Review drop-off by role weekly during launch.

## Launch-priority implementation order

1. Fix/verify the successful-signup redirect, then route using the saved onboarding state.
2. Add the role-specific welcome copy and first-session checklist.
3. Implement the two three-step walkthroughs with persistent `Skip`/completion state.
4. Add clear contextual gating for application, payments and escrow.
5. Add lifecycle notifications and funnel analytics.

## Pre-launch acceptance checks

- A new employer can verify email, discover professionals, post a job, review applicants, message, and reach escrow without a confusing redirect.
- A new professional can verify email, add skills, browse matched jobs, understand why verification matters, apply, message, accept an offer, and receive payment.
- Google and email sign-up result in the same onboarding-state decision, not different defaults.
- Skipping a tour never blocks core actions; the tour can be replayed.
- On mobile, every CTA, modal, progress step, and close/skip action remains reachable.
- Existing users are not re-shown first-time onboarding after it has been completed or skipped.

## Current implementation notes

The current app already has strong ingredients for this flow: role selection, professional-type selection, OTP verification, a welcome screen, verification UI, browse pages, the post-job wizard, notifications, messaging, wallet, and escrow-related screens. The main launch work is to connect these with saved onboarding state and role-aware destinations.

Before launch, test the sign-up completion path carefully: `SignupPage` currently calls `showPreloader` and reads `response.data.user.role` inside the OTP handler without defining either there. The redirect should use the verified user returned/stored by the auth flow (as the success button already does), then apply the onboarding routing rules above.
