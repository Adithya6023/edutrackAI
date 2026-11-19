---
name: EduTrack AI
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  margin-mobile: 1rem
  gutter-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-clarity, utility-first workspace tailored for higher education workflows. Serving students balancing assignments, faculty orchestrating coursework, and administrators evaluating institution-wide metrics, the platform prioritizes cognitive ease over decorative indulgence.

The visual style blends modern academic minimalism with crisp structural precision:
- **Tone:** Academic, focused, dependable, and quietly intelligent.
- **Visual Stance:** Zero decorative clutter, zero skeuomorphism, and absolute rejection of noisy gradients or blur effects. Content and structural rhythm drive engagement.
- **Primary Goal:** Eliminate cognitive friction during intensive academic planning and analysis through disciplined typography, generous negative space, and unambiguous semantic color states.

## Colors

The palette is engineered around high contrast, functional legibility, and unmistakable feedback loops.

### Primary Accents
- **Primary (`#4F46E5`):** Reserved for focal calls to action, active navigation destinations, and confirmed interactive states.
- **Primary Hover (`#4338CA`):** State transitions for interactive elements.
- **Primary Surface / Tint (`#EEF2FF`):** Light wash for active list items, selected chips, and primary status backgrounds.

### Neutrals & Surfaces
- **Canvas Background (`#F8FAFC`):** A soft, eye-resting slate tint that recedes behind content surfaces.
- **Surfaces & Cards (`#FFFFFF`):** Pure white container surfaces providing clean contrast against the canvas.
- **Main Text (`#0F172A`):** Deep slate providing optimal optical density for sustained academic reading.
- **Muted Text (`#64748B`):** Supporting hierarchy for metadata, timestamps, captions, and secondary labels.
- **Structural Borders (`#E2E8F0`):** Crisp 1px perimeter definition throughout all modular cards and input regions.

### Semantic Status Indicators
- **Success / Active / Completed (`#10B981`):** Signals course completion, passing thresholds, and on-track milestones. Accompanying surface: `#ECFDF5`.
- **Warning / Pending / Due Soon (`#F59E0B`):** Alerts users to pending assignments, review queues, and approaching deadlines. Accompanying surface: `#FFFBEB`.
- **Critical / Overdue / High Priority (`#EF4444`):** Strictly reserved for blockers, overdue coursework, and critical administrative notices. Accompanying surface: `#FEF2F2`.

## Typography

The typography system relies entirely on Inter to ensure clean geometric proportions, high x-height clarity, and systematic rendering consistency across operating systems.

- **Legibility Over Stylization:** Avoid exaggerated stylistic alternates. Maintain balanced negative tracking (`-0.01em` to `-0.02em`) for large headers to preserve optical density, while switching to neutral or slightly positive tracking on smaller metadata tags.
- **Leading & Rhythm:** Body text maintains open line heights (`1.5` to `1.6x`) to facilitate effortless scanning through dense syllabi, student records, and feedback notes.
- **Hierarchy Enforcement:** Section views must preserve strict level stepping. Screen titles apply `headline-lg`, module headers use `headline-md`, and metric descriptions deploy `label-md` or `body-sm`.

## Layout & Spacing

The layout is built upon an 8pt architectural rhythm, utilizing a fluid grid model that structures data-rich dashboards cleanly without visual overcrowding.

### Grid Architecture
- **Desktop (>= 1280px):** 12-column layout with `24px` (`1.5rem`) gutters and `32px` (`2rem`) outer margins. Side navigation occupies a fixed `260px` rail, allowing the core content canvas to expand dynamically up to an optimal max-width of `1600px`.
- **Tablet (768px - 1279px):** 8-column layout with `24px` gutters and `24px` margins. Side navigation collapses into an icon bar or overlay drawer.
- **Mobile (< 768px):** 4-column layout with `16px` (`1rem`) gutters and `16px` (`1rem`) margins. Content cards stack vertically into a single-column sequence.

### Spacing Principles
- **Generous Interior Padding:** Functional cards maintain `1.5rem` (`space-lg`) of internal clearance to decouple labels from container boundaries.
- **Component Clustering:** Micro-elements (e.g., status badges next to titles, input labels above fields) maintain tight `0.25rem`–`0.5rem` relations (`space-xs` to `space-sm`), while larger analytical modules separate using `1.5rem`–`2rem` (`space-lg` to `space-xl`).

## Elevation & Depth

Visual hierarchy in this design system avoids heavy shadows, layered drop offsets, or glass-like transparency in favor of crisp boundaries and gentle ambient separation.

- **Base Canvas:** The foundation layer sits flat at `#F8FAFC`.
- **Card Surfaces:** Cards and containers sit on `#FFFFFF` elevated solely by a subtle structural perimeter (`1px solid #E2E8F0`) and an ambient, whisper-light shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
- **Interactive State Elevation:** On hover, clickable cards do not lift heavily; instead, their border deepens slightly to `#CBD5E1` accompanied by a refined transition to `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Overlays & Drawers:** Modal sheets and context popovers use `#FFFFFF` with a clean `1px solid #E2E8F0` border and a soft ambient drop shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`. Backdrop scrims use a non-blurred `#0F172A` with `40%` opacity.

## Shapes

The geometric identity is defined by a balanced `12px` (`0.75rem` / `rounded-xl`) corner curvature, striking an approachable yet disciplined aesthetic.

- **Standard Cards, Panels & Modals:** Standardized at `12px` corner radii, matching the crisp `1px` outer border.
- **Form Controls & Buttons:** Default to `8px` (`0.5rem`) for compact structural integrity, ensuring inputs feel stable and form-fitted.
- **Status Tags & Badges:** Use either `6px` for small indicators or full pill `9999px` radii for high-level priority tags and quick-filter chips.
- **Nested Curvature Rule:** When elements are nested inside a card, the inner element radius must not exceed the outer radius (e.g., `8px` controls inside `12px` cards).

## Components

### Buttons
- **Primary Button:** Background `#4F46E5`, text `#FFFFFF`, font weight `500`. Hover state `#4338CA`. Height `40px` (desktop), padding `0 16px`, corner radius `8px`. Each view must emphasize exactly one primary CTA.
- **Secondary / Neutral Button:** Surface `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`. Hover: background `#F8FAFC`, border `#CBD5E1`.
- **Destructive Button:** Surface `#FEF2F2`, border `1px solid #FCA5A5`, text `#EF4444`. Hover: background `#EF4444`, text `#FFFFFF`.

### Chips & Badges
- **Status Badges:** Compact labels displaying assignment or enrollment status. Height `24px`, padding `0 8px`, border radius `6px`.
  - *Completed / Active:* `#ECFDF5` background, `#065F46` text, optional `6px` `#10B981` leading dot indicator.
  - *In Progress / Due Soon:* `#FFFBEB` background, `#92400E` text, optional `#F59E0B` dot indicator.
  - *Overdue / Critical:* `#FEF2F2` background, `#991B1B` text, optional `#EF4444` dot indicator.
- **Filter Chips:** Height `32px`, border `1px solid #E2E8F0`, background `#FFFFFF`, text `#64748B`. Active state: background `#EEF2FF`, border `#4F46E5`, text `#4F46E5`.

### Lists & Data Tables
- **Table Structure:** Flat `#FFFFFF` container with `1px solid #E2E8F0`. Header row uses `#F8FAFC`, text `#64748B` (`label-md`), height `44px`.
- **Table Rows:** Height `56px`, bottom border `1px solid #F1F5F9`. Hover state shifts background to `#F8FAFC` smoothly.
- **List Items:** Divided by subtle `1px` lines without extra border margins.

### Checkboxes & Radio Buttons
- **Checkboxes:** Size `18px`, border `1.5px solid #CBD5E1`, border radius `4px`. Checked state uses `#4F46E5` fill with a crisp white checkmark icon.
- **Radio Buttons:** Size `18px`, circular, border `1.5px solid #CBD5E1`. Checked state displays `#4F46E5` ring with an inner `#4F46E5` dot (`8px`).

### Input Fields
- **Text Inputs:** Height `40px`, background `#FFFFFF`, border `1px solid #E2E8F0`, corner radius `8px`, text `#0F172A`. Placeholder text in `#94A3B8`.
- **Focus State:** Border color switches to `#4F46E5` accompanied by a crisp `0 0 0 3px rgba(79, 70, 229, 0.15)` focus ring.
- **Field Labels:** Positioned directly above the field using `label-lg`, color `#0F172A`, bottom margin `6px`.

### Cards & Analytical Widgets
- **Course & Metric Cards:** White surface, border `1px solid #E2E8F0`, radius `12px`, padding `24px`.
- **Internal Card Sections:** Delineated using horizontal borders (`#F1F5F9`) or neutral container fills (`#F8FAFC`) rather than nested heavy shadows.

### Specialized Academic Modules
- **Assignment Milestone Tracker:** Linear progress rail (`6px` height, `#E2E8F0` fill) with `#4F46E5` completion fill and inline semantic milestones.
- **Iconography Standard:** Minimal 1.5px or 2px stroke outline icons (e.g., Lucide style) using `#64748B` default and `#4F46E5` active states. Solid or multi-color icons are forbidden.