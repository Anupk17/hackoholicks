# Design System Specification: High-End AI Assistant

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Intelligence"**

This design system moves away from the rigid, industrial layouts of traditional SaaS and towards a "Digital Curator" aesthetic. The goal is to create an experience that feels less like a tool and more like an intelligent, ambient presence. We achieve this through **Organic Layering**—rejecting hard lines and grids in favor of depth, luminescence, and intentional asymmetry. The UI should feel as though it is composed of suspended layers of light and frosted glass, floating within a deep, infinite indigo space.

## 2. Colors & Surface Philosophy
The palette is rooted in a high-contrast dark mode that utilizes deep indigos to provide immense tonal depth, allowing vibrant purples and pastels to "glow" as if light-emitting.

### The Palette (Core Tokens)
*   **Deep Base:** `background` (#0c0c1f) / `surface` (#0c0c1f)
*   **Vibrant Accents:** `primary` (#bf81ff) / `primary_container` (#9c42f4)
*   **Soft Highlights:** `secondary` (#d2bcfb) / `tertiary` (#ffc4e0)
*   **Functional Signals:** `error` (#fd6f85)

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Conventional borders create visual noise and "trap" the AI's intelligence. Instead:
*   **Tonal Transitions:** Use `surface_container_low` vs. `surface_container_high` to define areas.
*   **Negative Space:** Use the spacing scale to let elements breathe.
*   **Ghost Borders:** If a container requires a boundary (e.g., input fields), use `outline_variant` at **10-20% opacity**. Never use 100% opaque lines.

### Glass & Gradient Soul
To ensure the interface feels "High-Tech," main CTAs and floating panels must utilize:
*   **Linear Gradients:** Transition from `primary` to `primary_container` (angled 135°) to add dimension.
*   **Glassmorphism:** For floating AI chat bubbles or overlay cards, use `surface_variant` with a 12px-20px `backdrop-blur`. This allows the deep indigo background to bleed through, creating a "frosted" high-end finish.

---

## 3. Typography: The Editorial Scale
We utilize a pairing of **Plus Jakarta Sans** for high-impact displays and **Manrope** for technical readability. This combination balances the friendly "intelligence" of the assistant with precise geometric clarity.

*   **Display (Plus Jakarta Sans):** Used for "Aha!" moments and hero greetings. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to feel authoritative yet modern.
*   **Headline & Title (Plus Jakarta Sans):** Establishes clear hierarchy. `headline-md` (1.75rem) should be used for card titles to create an editorial, "magazine" feel.
*   **Body (Manrope):** The workhorse for AI responses. `body-lg` (1rem) provides the breathing room necessary for long-form content.
*   **Labels (Manrope):** Use `label-md` (0.75rem) in `secondary` or `on_surface_variant` colors for metadata/tags to ensure they don't compete with primary content.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too heavy for this "Ethereal" aesthetic. We define hierarchy through light and stacking.

*   **The Layering Principle:** 
    *   **Level 0 (Base):** `surface` (#0c0c1f)
    *   **Level 1 (Sections):** `surface_container_low` (#111128)
    *   **Level 2 (Cards):** `surface_container_high` (#1c1c3d)
    *   **Level 3 (Popovers):** `surface_bright` (#272752)
*   **Ambient Shadows:** For floating elements, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 15px rgba(191, 129, 255, 0.05);`. The subtle purple tint mimics the glow of the screen light.

---

## 5. Components

### Buttons & Interaction
*   **Primary Action:** Fully rounded (`full`: 9999px). Background: `primary_container` gradient. High-contrast `on_primary_container` text.
*   **Secondary/Glass:** Background: `surface_variant` at 40% opacity with `backdrop-blur`. This creates a sophisticated "Control Center" look.
*   **States:** On `Pressed`, scale the button to 96% and increase the glow (shadow) intensity.

### AI Chat Bubbles (The Signature Component)
*   **User Bubbles:** Subtle `surface_container_highest` with right-aligned asymmetric rounding (e.g., `top-left: 2rem`, `bottom-left: 2rem`, `top-right: 2rem`, `bottom-right: 0.5rem`).
*   **Assistant Bubbles:** A soft `glassmorphic` surface with a 1px "Ghost Border" (10% white) to catch the light at the edges.

### Cards & Chips
*   **Cards:** Forbid dividers. Use `title-md` for headers and `body-sm` for content, separated by `1.5rem` of vertical space. 
*   **Chips:** Use `tertiary_fixed` (#fdb0d7) for AI tags or "Suggestions." They should be pill-shaped and small (`label-md`), acting as soft "jewels" in the dark interface.

### Input Fields
*   **Style:** `surface_container_lowest` background (pure black) to create a "recessed" feel.
*   **Focus State:** Instead of a thick border, use a soft outer glow (`surface_tint`) and transition the "Ghost Border" opacity to 40%.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place secondary actions or metadata slightly off-grid to create a custom, bespoke feel.
*   **Embrace the Glow:** Use `primary_dim` for icons to make them feel like they are powered by the AI.
*   **Prioritize Breathing Room:** When in doubt, add `1rem` more padding than you think you need.

### Don’t:
*   **Don't use Grey:** Avoid neutral greys (#888). Use `outline` (#72719c) or `on_surface_variant` which are tinted with indigo to keep the palette "vibrant."
*   **Don't use Sharp Corners:** Never use a radius smaller than `sm` (0.5rem). The brand is "Friendly" and "Accessible"; sharp corners feel aggressive.
*   **Don't Over-Saturate:** Use the vibrant `primary` purple sparingly. If everything glows, nothing is important. Keep it for CTAs and active states only.