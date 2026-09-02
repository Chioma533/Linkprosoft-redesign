# Mobile View Implementation Plan: Employer and Professional Dashboard Subpage Skeletons

## Objective & Scope
Create a mobile-specific skeleton treatment for the dashboard subpage preloaders used by the employer and professional flows, while preserving the current desktop skeletons exactly. This work applies to the dashboard-level preloader system used behind the real dashboard pages and is limited to responsive layout changes for screens under 768px.

## Design-analysis summary
The existing dashboard implementation already contains a desktop-first shell and subpage skeleton system in `src/components/common/preloader/dashboard/`. The real apps use a mobile layout with:
- collapsed or hidden desktop sidebar
- a compact header with menu, title, and avatar
- stacked content cards instead of wide tables or three-column grids
- horizontal pill rows for filters/search
- a fixed bottom navigation bar on mobile
- reduced paddings and tighter spacing to fit smaller viewport heights

The skeletons should mirror those structural changes without affecting desktop behavior. The existing `DashboardLayout` already enforces the mobile navbar and bottom nav in the live app, so the skeletons should align to that same shell structure.

## Mobile layout decisions and measurements
- Breakpoint: `window.innerWidth < 768`
- Shell: hide desktop sidebar, keep only mobile header and bottom nav placeholder
- Main padding: roughly `16px` horizontal, `14px` top/bottom on initial content blocks
- Card radius: keep in the current design language (`14px`–`20px`)
- Content gaps: space cards in `10px`–`16px` ranges to keep vertical density comfortable
- Table/list cards: convert tabular desktop content into stacked card blocks with smaller bars and tight sections
- Search/filter rows: render as horizontally scrollable pills instead of wrapped multi-width bars
- Stats area: collapse to a two-column grid on mobile
- Empty states: keep white bordered cards with compact bars and no wide desktop table columns

## Component inventory and required changes
- `src/components/common/preloader/dashboard/DashboardShellSkeleton.jsx`
  - detect mobile viewport and switch to a compact header + bottom-nav shell
- `src/components/common/preloader/dashboard/OverviewSkeleton.jsx`
  - convert overview content to compact stacked cards for mobile
- `src/components/common/preloader/dashboard/TablePageSkeleton.jsx`
  - convert table layouts to mobile list cards with simplified rows
- `src/components/common/preloader/dashboard/GridPageSkeleton.jsx`
  - convert browse grid to a single-column card stack
- `src/components/common/preloader/dashboard/ProfileSkeleton.jsx`
  - convert profile layout to mobile-friendly stacked sections

## Hidden versus conditional display

| Element | Desktop | Mobile | Requirement |
|---|---|---|---|
| Desktop sidebar skeleton | Visible | Hidden | Desktop-only chrome |
| Desktop sidebar navigation stubs | Visible | Hidden | Mobile shell uses compact header instead |
| Desktop navbar search + actions | Visible | Hidden | Mobile header strips to icon + title + avatar |
| Wide table rows | Visible | Hidden | Replaced by stacked mobile cards |
| 3-column/4-column grids | Visible | Collapsed to 2-col or 1-col | Matches mobile viewport density |
| Bottom navigation placeholder | Hidden | Visible | Mobile-only shell behavior |
| Large portrait card sections | Visible | Reduced/stacked | Keep mobile reading flow compact |

## Implementation order
1. Add mobile viewport detection to the shared dashboard shell.
2. Convert overview skeleton to compact mobile stack.
3. Convert table skeleton to card-stack list layout.
4. Convert browse grid skeleton to mobile single-column cards.
5. Convert profile skeleton to compact mobile layout.
6. Validate desktop output remains identical and mobile skeletons remain readable.

## Design-system considerations
- Preserve current color palette, radius, and soft border usage.
- Reuse existing shimmer tokens and inline skeleton primitive components.
- Avoid introducing new global CSS; use inline styles and viewport-aware rendering.
- Keep the desktop structure untouched and isolated behind a mobile branch.

## Acceptance criteria and QA checklist
- [ ] The desktop layout is unchanged at `>= 768px`.
- [ ] The mobile layout at `< 768px` shows compact stacked content instead of desktop tables/grids.
- [ ] Header, bottom nav, and content padding match the real dashboard shell behavior.
- [ ] Filter/search pills remain horizontally scrollable on small screens.
- [ ] No overflow or broken shimmer animation occurs.
- [ ] Employer and professional subpages both render their skeletons in the correct mobile structure.

## Known risks and follow-up items
- Real content density varies between roles, so some mobile cards are intentionally simplified rather than a literal pixel copy of each page.
- The skeleton is scoped to layout and spacing only; it does not invent color or decorative visual styling.
- If a live subpage is later redesigned, the skeleton should be re-checked against the actual mobile implementation and updated as needed.
