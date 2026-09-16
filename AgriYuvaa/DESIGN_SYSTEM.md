# AgriYuvaa Design System (Stitch Export)

**Design System Theme**: "Agri-Tech Catalyst" (Tactile High-Tech Eco-Modernism)  
**Tone & Vibe**: Grounded, authoritative yet vibrant, modern precision agriculture. Deep rich forest greens contrasted with energetic bio-lime accents, clean crisp cards, and clear typography.

---

## 1. Typography

| Role | Font Family | Weights | Usage |
| :--- | :--- | :--- | :--- |
| **Headings & Display** | `Outfit`, sans-serif | `600`, `700`, `800` | Section titles, hero headlines, card titles |
| **Body & UI** | `Inter`, sans-serif | `400`, `500`, `600` | Descriptions, paragraphs, form labels, buttons |
| **Metrics & Badges** | `Space Grotesk`, monospace/sans | `500`, `600`, `700` | Counters, stats (`5,000+`), tags, chips, status pills |

### Google Fonts Link
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

---

## 2. Color Palette & Tokens

### Primary & Core Greens
- **Primary / Deep Forest**: `#003527` (Tailwind: `primary`) — Core brand headings, major containers
- **Primary Container**: `#064e3b` (Tailwind: `primary-container`) — Cards, hero chips, dark accents
- **Deep Canopy (Dark Backgrounds)**: `#022C22` (Tailwind: `deep-canopy`) — Footers, CTA bridge banners
- **Secondary / Forest Accent**: `#006c49` (Tailwind: `secondary`) — Subheadings, links, active borders
- **Secondary Fixed Dim**: `#4edea3` — Glows, badges

### Electric High-Tech Accents
- **Electric Lime**: `#A3E635` (Tailwind: `electric-lime`) — High-converting CTAs, active badges, telemetry highlights
- **Tertiary Fixed / Bio-Green**: `#acf847` (Tailwind: `tertiary-fixed`) — Hover states
- **Mint Surface (Soft Background)**: `#F0FDF4` (Tailwind: `mint-surface`) — Pill chips, subtle card accents

### Neutrals & Backgrounds
- **Base Surface / Background**: `#faf8ff` (Tailwind: `bg-surface`, `bg-background`) — Crisp, light clean backing
- **Lowest Container (Pure White)**: `#ffffff` (Tailwind: `surface-container-lowest`) — Card canvas
- **Card Border**: `#E2E8F0` (Tailwind: `card-border`) — Subtle card borders
- **Text on Surface (Dark Charcoal)**: `#131b2e` (Tailwind: `on-surface`) — High-readability body text
- **Muted Slate**: `#64748B` (Tailwind: `slate-muted`) — Subtitles, metadata, timestamps

### Warning & Status
- **Sun Amber**: `#F59E0B` (Tailwind: `sun-amber`) — Rating stars, 'Popular' tags
- **Error**: `#ba1a1a` — Required field flags, validation

---

## 3. Tailwind Configuration Snippet

```javascript
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#003527",
        "primary-container": "#064e3b",
        "deep-canopy": "#022C22",
        "secondary": "#006c49",
        "secondary-fixed": "#6ffbbe",
        "secondary-fixed-dim": "#4edea3",
        "electric-lime": "#A3E635",
        "mint-surface": "#F0FDF4",
        "sun-amber": "#F59E0B",
        "card-border": "#E2E8F0",
        "slate-muted": "#64748B",
        "surface": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#131b2e",
        "outline-variant": "#bfc9c3"
      },
      fontFamily: {
        "headline-hero": ["Outfit", "sans-serif"],
        "headline-lg": ["Outfit", "sans-serif"],
        "headline-md": ["Outfit", "sans-serif"],
        "headline-sm": ["Outfit", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-interactive": ["Inter", "sans-serif"],
        "label-badge": ["Space Grotesk", "monospace"],
        "label-metric": ["Space Grotesk", "sans-serif"]
      }
    }
  }
}
```

---

## 4. Screens & Exported UI Files

| File | Screen Name | Description |
| :--- | :--- | :--- |
| [`index.html`](file:///d:/AgriYuvaa/AgriYuvaa_FullStack_Project/agriyuvaa/AgriYuvaa/index.html) | Landing Page (Desktop) | Complete homepage with hero, 4 pillars, workshops showcase, testimonials, blog, job portal banner & contact. |
| [`about.html`](file:///d:/AgriYuvaa/AgriYuvaa_FullStack_Project/agriyuvaa/AgriYuvaa/about.html) | About Us (Desktop) | Story & vision, mission card, 4 core pillars bento grid, 2023-2026 timeline, mentors & ICAR advisory council. |
| [`workshops.html`](file:///d:/AgriYuvaa/AgriYuvaa_FullStack_Project/agriyuvaa/AgriYuvaa/workshops.html) | Workshops Directory (Desktop) | Interactive workshop catalog with live JS filters, category pills, sort dropdown, and collapsible FAQ accordion. |
| [`blog.html`](file:///d:/AgriYuvaa/AgriYuvaa_FullStack_Project/agriyuvaa/AgriYuvaa/blog.html) | Blogs & Insights (Desktop) | Editorial hub with search input, topic chips, featured editor's pick, article cards, and newsletter box. |
| [`contact.html`](file:///d:/AgriYuvaa/AgriYuvaa_FullStack_Project/agriyuvaa/AgriYuvaa/contact.html) | Contact Us (Desktop) | Office HQ card with GPS coords, phone/email cards, interactive inquiry form with SLA guarantee, campus outreach. |
| [`mobile-landing.html`](file:///d:/AgriYuvaa/AgriYuvaa_FullStack_Project/agriyuvaa/AgriYuvaa/mobile-landing.html) | Landing Page (Mobile) | 390px mobile-first responsive viewport with sliding nav drawer, 2x2 metric tiles, horizontal snap carousels, and quick CTA cards. |
