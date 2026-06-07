---
name: SafeScan Design System
description: Quiet, typography-driven minimalism inspired by Apple and Toss UI.
colors:
  primary: "#3182f6"
  neutral-bg: "#f2f4f6"
  neutral-card: "#ffffff"
  text-ink: "#191f28"
  text-muted: "#8b95a1"
  border-light: "#e5e8eb"
  safe-bg: "#eef9f2"
  safe-text: "#2b8f56"
  caution-bg: "#fff5ec"
  caution-text: "#e07300"
  danger-bg: "#fdf3f4"
  danger-text: "#e54249"
rounded:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-card}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  button-secondary:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
---

# Design System: SafeScan

## 1. Overview

**Creative North Star: "Toss Canvas"**

Toss Canvas is a design system optimized for high readability, spacious layout density, and zero cognitive load. It rejects the saturated, high-contrast, and neon-primary styling of generic AI generators in favor of soft-tinted neutrals, subtle borders, and generous whitespace. Designed primarily for mobile users scanning products in active, fast-paced retail settings, the visual design steps aside to let the user's primary task and safety verdict take absolute precedence.

**Key Characteristics:**
- **Quiet Canvas:** Pure white cards hovering over a soft gray-blue canvas, defined by hairline borders rather than drop shadows.
- **Toss Typography:** Strong hierarchy driven by bold type sizing and high contrast in weights rather than loud colors.
- **Frictionless Flow:** Soft rounded corners and subtle micro-interactions that respond dynamically to user action.

## 2. Colors

The color palette is characterized by soft, desaturated neutrals and highly specific functional states that provide guidance without visual shouting.

### Primary
- **Soft Toss Blue** (`#3182f6`): Used sparingly as the single action accent. Restricted to active primary actions and toggles.

### Neutral
- **Toss Gray** (`#f2f4f6`): The body background. A clean, cooling, desaturated light neutral that keeps the page calm.
- **Toss Ink** (`#191f28`): The body and header text. A dark, premium charcoal that provides high legibility without the harshness of pure black.
- **Toss Muted Gray** (`#8b95a1`): Used for secondary helper labels, captions, and deactivated actions.
- **Toss Border** (`#e5e8eb`): Thin hairline separator used for card boundaries and dividers.
- **White** (`#ffffff`): Card background. Surfaces stand out strictly by contrast against Toss Gray.

### Functional States
- **Safe** (Bg: `#eef9f2` / Text: `#2b8f56`): Indication that a product matches a user's health profile perfectly.
- **Caution** (Bg: `#fff5ec` / Text: `#e07300`): Alert that a product contains elements requiring moderate attention.
- **Danger** (Bg: `#fdf3f4` / Text: `#e54249`): High alert for contraindicated ingredients or specific allergens.

**The Ten Percent Rule.** Saturated colors (including Soft Toss Blue, Safe Green, Caution Orange, and Danger Red) must never occupy more than 10% of any screen. Color is a tactical indicator, not decoration.

## 3. Typography

**Display Font:** Inter (with system-ui, -apple-system, sans-serif fallbacks)
**Body Font:** Inter (with system-ui, -apple-system, sans-serif fallbacks)
**Mono Font:** JetBrains Mono (for codes, systems, and telemetry)

**Character:** Clean, structural, and neutral. The pairing relies on bold weight variations and high font-size scale ratios to establish typographic hierarchy.

### Hierarchy
- **Display** (800, `clamp(2rem, 5vw, 3rem)`, 1.1): App header and primary safety status titles.
- **Headline** (700, `1.5rem` / `24px`, 1.25): Card titles and main section titles.
- **Title** (600, `1.125rem` / `18px`, 1.3): Field labels and sub-section headers.
- **Body** (400, `1rem` / `16px`, 1.5): Primary copy, details text, and descriptions. Cap lines at `65ch`.
- **Label** (600, `0.75rem` / `12px`, 1.2): Eyebrow text, badge indicators, and button text.

## 4. Elevation

The Toss Canvas system is flat-by-default. Depth is conveyed strictly through layering white cards over the light Toss Gray background, separated by hair-thin borders. Heavy, dark drop shadows are forbidden.

**The Ambient Hover Rule.** Surfaces are flat at rest. A soft, diffuse shadow (`0 8px 24px rgba(25, 31, 40, 0.04)`) appears strictly on interactive elements as a hover or focus response, never statically.

## 5. Components

### Buttons
- **Shape:** Soft rounded corners (16px radius).
- **Primary:** Soft Toss Blue background with white text. Padding: `16px 24px` (touch targets are always large and clickable).
- **Secondary:** Light Toss Gray background with Toss Ink text. Padding: `16px 24px`.
- **Hover/Focus:** Smooth scale-down press effect (`scale(0.98)`) and high-speed transition (`transition: all 0.2s ease-out`).

### Cards / Containers
- **Corner Style:** Large rounded corners (24px radius for main cards, 32px for header panels).
- **Background:** Pure White (`#ffffff`).
- **Border:** Thin Toss Border (`#e5e8eb`, 1px solid).
- **Internal Padding:** Generous padding (`24px` on mobile, `32px` on desktop) to ensure content breathes.

### Inputs / Fields
- **Style:** Background Toss Gray (`#f2f4f6`), rounded corners (16px radius), padding `16px 20px`.
- **Focus:** Subtle Soft Toss Blue outline ring or border transition.
- **Error:** Smooth border transition to Danger Red.

## 6. Do's and Don'ts

### Do:
- **Do** use large, spacious margins and generous vertical padding (minimum `24px` between cards).
- **Do** style danger, caution, and safe cards with their specific desaturated functional backgrounds (`bg-red-50`, `bg-orange-50`, `bg-green-50`) to keep the interface soft.
- **Do** use scale-down micro-interactions on button click (`active:scale-[0.98]`) for tactile feedback.
- **Do** keep font weights bold for headings (`font-extrabold` / `font-bold`) to create clean contrast against body text.

### Don't:
- **Don't** use strong, high-contrast black borders or saturated background highlights.
- **Don't** use cards within cards. Group related information with spatial layout dividers instead.
- **Don't** use neon gradients or multi-colored display headers. The header must remain a clean, quiet anchor.
- **Don't** animate image scale or rotate on hover. Focus on background scale, color transitions, or shadow elevations.
