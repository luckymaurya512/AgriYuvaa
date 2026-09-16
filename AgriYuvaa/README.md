# AgriYuvaa - React + Tailwind CSS Web Application

This project is a modern **React + Vite + Tailwind CSS** implementation of the Stitch UI under the **Agri-Tech Catalyst** design system.

---

## ⚡ Tech Stack

- **React 18** (Modern functional components with Hooks)
- **React Router DOM v6** (Client-side multi-page routing)
- **Tailwind CSS v3** with PostCSS and Autoprefixer
- **Vite** (Next-generation ultra-fast frontend tooling)
- **Google Fonts** (`Outfit`, `Inter`, `Space Grotesk`) & **Material Symbols**

---

## 📁 Project Structure

```
AgriYuvaa/
├── index.html                   # Vite HTML entry point
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── postcss.config.js            # PostCSS with Tailwind & Autoprefixer
├── tailwind.config.js           # Exact Agri-Tech Catalyst theme & color tokens
├── DESIGN_SYSTEM.md             # Color tokens, typography, and spacing specifications
├── src/
│   ├── main.jsx                 # React root mounting with BrowserRouter
│   ├── App.jsx                  # Main App with Route definitions & ScrollToTop
│   ├── index.css                # Tailwind directives & global utility styling
│   ├── components/
│   │   ├── Navbar.jsx           # Responsive top navigation with active indicators
│   │   └── Footer.jsx           # Deep canopy footer with navigation & copyright
│   └── pages/
│       ├── LandingPage.jsx      # Desktop Landing page (Hero collage, metrics, pillars, workshops)
│       ├── AboutPage.jsx        # Story, Live Network status, Mission/Vision, Advisory Board
│       ├── WorkshopsPage.jsx    # Category filtering, live search, sort selector, FAQ accordions
│       ├── BlogPage.jsx         # Search filter, topic chips, featured card, articles, newsletter
│       ├── ContactPage.jsx      # Form state, contact channels, location map, FAQs
│       └── MobileLandingPage.jsx# 390px mobile viewport view with snap carousels & drawer
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd AgriYuvaa
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🧭 Routes

- **`/`**: Homepage / Main Landing Page
- **`/about`**: About AgriYuvaa, Leadership, Advisory Board & Timeline
- **`/workshops`**: Upskilling Workshops Directory with filters & interactive FAQ
- **`/blog`**: AgriTech Insights, Career Guides & Newsletter
- **`/contact`**: Contact Us, Inquiry Form & Campus Partnerships
- **`/mobile`**: Mobile Viewport Showcase (390px iPhone frame)
