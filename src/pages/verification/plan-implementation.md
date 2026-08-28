# Verification Flow Mobile Plan

## Objective

Implement the attached verification experience for both unverified employers and professionals. The feature is shared at `/verification` and preserves the existing Satoshi/Manrope typography, Linkprosoft blue action color, light borders, and compact rounded controls.

## Design Analysis

- Desktop: centered white workspace, 960px maximum width, generous outer padding, three-step progress indicator, two-column form and preview panels.
- Mobile: one-column page with 12px outer padding, 16px internal panel padding, stacked form/preview regions, full-width primary actions, and no horizontal overflow.
- Actions remain reachable after every step; secondary actions appear above the primary action on narrow screens.
- The success state is an overlay with a single primary profile action and a lightweight return action.

## Component Inventory

- `VerificationPage`: owns step state and shared role-neutral flow.
- `VerificationProgress`: responsive step indicator.
- `VerificationHeader`: title, helper copy, and contextual icon.
- `Field`: consistent accessible form control.
- `PreviewPanel`: identity/payment preview content.
- `ActionBar`: responsive navigation actions.

## Mobile Visibility Matrix

| Element                | Desktop           | Mobile                                  |
| ---------------------- | ----------------- | --------------------------------------- |
| Context icon           | Visible           | Hidden to preserve width                |
| Form and preview       | Two columns       | Stacked vertically                      |
| Action controls        | Right-aligned row | Full-width vertical stack               |
| Identity ID thumbnails | Visible           | Horizontally clipped within preview     |
| Success overlay        | Centered modal    | Full viewport overlay with padded modal |

## Implementation Order

1. Add the shared verification page and step state.
2. Register `/verification` for both private user roles.
3. Link the existing employer and professional verification banners to the page.
4. Validate production build and inspect narrow viewport behavior.

## Acceptance Criteria

- Employer and professional users can open the same verification route while authenticated.
- Identity, face, payment, and review states match the supplied screen hierarchy.
- Mobile view stacks content without horizontal page overflow.
- File selection and selfie capture controls provide visible state feedback.
- Confirm displays a verification success modal.
- No unnecessary shadows are added to sections or cards.
- Existing dashboard desktop layout remains unchanged.
