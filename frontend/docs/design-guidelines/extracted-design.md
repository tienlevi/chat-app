# Extracted Design — signup-option.png reference

Source: `docs/inspiration/signup-option.png` (login card, "start learning" product)

## Layout
- Full-viewport light-gray canvas, single card centered both axes (no split panel, no hero image).
- Card: white fill, ~24px corner radius, 1px hairline border, soft ambient shadow, generous internal padding (~48px).
- Vertical rhythm: heading block → field stack (label above input) → CTA button → divider gap → bottom link line.

## Typography
- Display heading ("Log in"): heavy/bold rounded geometric sans, large size (~40px), tight tracking.
- Subheading ("to start learning"): same family, regular weight, ~20px, sits directly under heading with minimal gap.
- Field labels: regular weight, small (~14px), muted gray.
- Input text: bold-ish rounded sans, ~16-18px.
- Bottom line: two weights in one sentence — regular gray question, bold dark call-to-action.

## Color (source)
- Canvas: near-white gray (#f5f5f5).
- Card: white (#ffffff), border #e5e5e5.
- Default input: white bg, border #e0e0e0.
- **Validated input state**: pale green bg (#eafbf0), green border (#1a7f37-ish), green text, green checkmark icon — this is the one distinctive interaction detail worth preserving.
- Primary button: medium blue (#1a73e8), white bold label, trailing arrow icon, rounded ~12px.
- Secondary text: mid gray (#6b7280).

## What we're keeping vs. recoloring
Keeping: the centered single-card structure, bold-heading + light-subheading pairing, label-above-input fields, the "validated field" success treatment (border + tint + check icon), pill/rounded primary button with trailing arrow, two-weight bottom sentence.

Recoloring entirely to the existing **Fireside** brand system already defined in `src/assets/css/index.css` (warm terracotta primary `oklch(0.58 0.16 40)`, Fraunces display serif + Plus Jakarta Sans body, paper-warm neutrals) instead of the source's blue/green/gray palette. The reference's green "validated" state becomes a new moss/sage `--success` token that reads as warm rather than corporate-blue-green, and the reference's blue CTA becomes the brand terracotta primary.
