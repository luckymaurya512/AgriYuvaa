# AgriYuvaa Landing Page (`agriyuvaa.com`)

Standalone React + Vite + Tailwind CSS landing website for AgriYuvaa.

## Features
- **Hero & Mission**: Dynamic counters, brand vision, youth empowerment highlights.
- **Workshops & Trainings**: Live catalog of skill development workshops (Drone tech, Hydroponics, Beekeeping, Biofloc, Mushroom farming).
- **Testimonials**: Student success stories with dynamic carousel.
- **Agri News & Blogs**: Up-to-date agricultural news, modern farming guides, and career articles with pagination & search.
- **Job Portal Bridge**: Direct CTA redirection to the AgriYuvaa Job Portal (`job.agriyuvaa.com`).
- **Contact & Enquiries**: Interactive inquiry form & office contact info.

## Getting Started Locally

1. **Install dependencies:**
   ```bash
   cd landing
   npm install
   ```

2. **Run dev server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5174`.

3. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables
Create a `.env` file (optional for development as Vite proxies `/api` to `http://localhost:5000`):
```env
VITE_API_BASE_URL=https://<your-backend-domain>/api
```
