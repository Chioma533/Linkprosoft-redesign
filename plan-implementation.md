# Community Mobile View Implementation Plan

## Objective and scope

Create a mobile-only Community screen that matches the provided mockup while preserving the existing desktop layout and visual system. The work is intentionally scoped to the mobile viewport and must not modify desktop behavior, desktop breakpoints, or shared layout logic.

## Design-analysis summary

The supplied mobile reference shows a simplified mobile feed layout with:

- a slim top bar with a menu icon, page title, and profile chip
- a compact composer card for post creation
- a grouped action row for Video / Photos / Write Article
- a feed stack with author metadata, follower CTA, long-form text, and reaction counts
- a full-width, single-column card arrangement on mobile
- no decorative shadows or heavy visual effects

The layout is intentionally flat, minimal, and highly readable on narrow screens. The desktop version stays unchanged, while the mobile version uses a compact composition and narrower spacing scale to preserve the original product language without adding visual noise.

## Mobile layout decisions and measurements

- Use a centered mobile viewport width of approximately 420px with explicit max-width constraints.
- Reduce the header height and tighten title/icon sizing to keep the layout balanced on a phone-sized screen.
- Collapse the three-column desktop composition into a single-column stack for screens under the desktop breakpoint.
- Keep the composer and feed cards rounded but visually minimal, avoiding shadows or heavy border emphasis.
- Use a tighter but still readable spacing rhythm: 12px to 18px spacing in cards and 6px to 10px internal gaps.
- Preserve the icon-led interaction pattern with small, tap-friendly controls and minimal labels.
- Keep the right-side messages column hidden on mobile, because the mobile mockup focuses on the feed and composer only.

## Component inventory and required changes

### Community page
- convert the desktop composition to a mobile-only branch using a desktop/mobile conditional render pattern
- hide the left profile panel and right message panel below the desktop breakpoint
- keep the mobile top navigation compact and minimal
- preserve the author card structure but reduce typography and spacing for phone-sized screens
- maintain the feed card structure and reactions row with smaller icon sizing

### Implementation details
- use `lg:hidden` and `hidden lg:block` to isolate mobile-only rendering
- keep all existing desktop code intact under the desktop branch
- apply mobile styling through the small-screen render path only
- avoid introducing custom shadows or global CSS changes

## Hidden vs displayed elements

| Element | Mobile behavior | Reason |
| --- | --- | --- |
| Left profile summary | Hidden | Not present in the mobile reference |
| Right message panel | Hidden | The reference focuses on the feed and composer only |
| Desktop top search bar | Hidden | Mobile uses a compact top bar with menu and avatar |
| Wide desktop grid layout | Hidden | Converted to single-column vertical flow |
| Feed cards | Visible | Core content of the mobile community view |
| Composer card | Visible | Required for creating a post |
| Post actions (Video, Photos, Article) | Visible | Present in the mobile mockup |
| Reaction counts | Visible | Preserved to match feed functionality |
| Follow / Following button | Visible | Matches the author metadata pattern |

## Implementation order

1. Review the desktop Community page and preserve it as the desktop version.
2. Create a mobile-only render branch for the Community page.
3. Remove the side profile and message columns below the desktop breakpoint.
4. Reduce and reflow the post composer and feed card spacing to phone proportions.
5. Match the mockup’s top bar, feed copy density, and reaction icon sizing.
6. Validate that the desktop branch remains visually and functionally unchanged.

## Design-system considerations

- The project already uses neutral grays, soft blue accents, and rounded surfaces; the mobile view follows that system.
- No shadows, hover effects, or extra decorative styling were introduced.
- The implementation remains within the existing Tailwind utility approach and does not require global CSS changes.
- The change is isolated to the mobile branch, preserving desktop fidelity.

## Acceptance criteria and QA checklist

- The mobile Community screen matches the provided reference composition and hierarchy.
- The desktop Community screen remains unchanged at larger breakpoints.
- Sidebars are hidden on mobile while the feed and composer remain visible.
- Cards stay flat, with border-based separation instead of shadows.
- Text remains readable and compact without overflow or clipping.
- Tap-target sizing remains comfortable and visually consistent.
- No global spacing or layout rules were modified outside the mobile branch.

## Known risks, assumptions, and follow-up items

- The source image provides a mobile design reference, but not pixel-perfect asset data for every icon or typography metric; UI decisions were aligned to the existing app design language.
- The mockup does not include an explicit mobile messages panel or drawer; the implementation intentionally hides it while keeping the feed prominent.
- A live device review may still suggest minor refinement in spacing, but the structure and design intent are already aligned with the reference.
