# Mobile Verification Banner Implementation Plan

## Objective and scope

Refine the mobile-only hero section and verification notice on the professional landing page so it more closely matches the supplied reference design without altering the desktop experience.

## Design-analysis summary

The current mobile layout is structurally correct, but it is visually compressed and too generic for the reference. The main issues are:

- the title is too small and lacks strong mobile hierarchy
- the banner is too narrow and compressed vertically
- the CTA appears small and underweighted relative to the reference
- the internal alignment of icon, text, button, and dismiss control is tighter than the mockup
- the illustration feels visually bolted on rather than integrated into the composition

## Mobile layout decisions and measurements

- Keep the default mobile layout in a vertical, stacked flow with stronger spacing.
- Use a more generous headline scale and line-height for small screens.
- Expand the verification card width and padding to feel like a deliberate mobile notice instead of a compact default alert.
- Keep the action as a clear primary CTA, with a larger tap target and stronger visual emphasis.
- Preserve existing desktop proportions by using mobile-first defaults and restoring the current desktop layout with `sm:` classes.

## Component inventory and required changes

### Professional home hero section
- update the hero wrapper layout to stack vertically on mobile
- enlarge the heading and subheading for stronger mobile hierarchy
- widen the verification notice and improve internal spacing
- increase CTA prominence and align the dismiss button more cleanly
- scale the illustration for mobile while keeping it decorative and compact

## Hidden vs displayed elements

| Element | Mobile behavior | Reason |
| --- | --- | --- |
| Headline | Visible | Primary hero copy must remain dominant |
| Subheading | Visible | Supports headline and matches mockup intent |
| Verification banner | Visible | Core requirement for the mobile conversion |
| Complete Verification button | Visible | Primary CTA must remain clear and tappable |
| Dismiss button | Visible | Required for user control and matches mockup |
| Illustration | Visible but reduced | Provides supporting visual balance without overpowering the banner |

## Implementation order

1. Update the hero wrapper to stack cleanly on mobile.
2. Increase heading and subheading scale and spacing.
3. Refine the verification banner geometry and text rhythm.
4. Increase CTA prominence and align the close control.
5. Adjust the illustration size and placement for mobile.
6. Validate desktop behavior remains unchanged via the `sm:` breakpoint restoration.

## Design-system considerations

- Preserve existing brand colors and spacing conventions.
- Do not add decorative treatments outside the current product language.
- Keep the change localized to the professional mobile layout only.
- Avoid global CSS or shared resets that could affect desktop rendering.

## Acceptance criteria and QA checklist

- The professional home page reads as a stronger mobile hero on screens under the desktop breakpoint.
- The banner is more prominent and better aligned than the current compact implementation.
- The CTA is easier to tap and visually clearer.
- The dismiss control remains functional.
- Desktop layout remains intact at larger breakpoints.
- No broken spacing, overflow, or clipping is introduced.

## Known risks and follow-up items

- The reference design may not perfectly match the available asset or existing app typography; when needed, the nearest system-aligned approximation should be used.
- Small adjustments may still be required after a live review on device-sized viewports.
- The mobile refinement should remain intentionally scoped and reversible.
