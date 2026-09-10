# Coastal Portfolio Template 🏖️🌊

An interactive portfolio website template combining a coastal theme with modern neo-brutalist design. It features a real-time 2D canvas ocean simulation, dynamic motion physics, interactive beach characters, and a clean React 19, TypeScript, and Vite architecture.

The template is fully **open source under the MIT License** and ready to customize for a personal portfolio.

---

## Key Features

- **Real-Time Canvas Water Physics**: HTML5 2D Canvas-powered ocean waves, floating bubbles, swimming fish, and click-responsive ripples without a heavy WebGL dependency.
- **Interactive Beach Characters**: A draggable rubber duck, beach crab, and flying seagull with playful, connected dialogue.
- **Flagship Project Showcase**: Interactive project cards with detailed case-study modals and technical metrics.
- **Technology Pipeline Visualization**: An interactive architecture pipeline for presenting tools, technologies, and engineering workflows.
- **Milestone Timeline**: An experience and education timeline with a scroll-responsive vertical progress indicator.
- **Contact Bento Dock**: An interactive contact panel featuring a 3D card flip and developer note.
- **Coastal Neo-Brutalist Design**: A tropical ocean palette, warm sand tones, bold monospace typography, and solid drop shadows.

---

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Motion**: Framer Motion
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React & Simple Icons

---

## Using This Template

### 1. Clone the Repository
```bash
git clone https://github.com/ryhndastra/template-porto-pantai.git
cd template-porto-pantai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Customize Your Content

All portfolio copy, projects, contact details, and skills are centralized in one data file:

- Open `src/data/portfolioData.ts`.
- Replace the name, biography, education, social links, and experience history with your own information.
- To replace the profile image, add your photo to `public/` and update `avatarUrl` in `src/data/portfolioData.ts`.
- To replace the CV, add your PDF resume to `public/cv.pdf`.

### 4. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build for Production
```bash
npm run build
```
The deployable production build will be generated in `dist/`.

---

## Project Structure

```text
template-porto-pantai/
├── public/              # Static assets, icons, profile image, and CV
├── src/
│   ├── components/      # Modular interface components
│   │   ├── contact/     # Contact section, bento dock, and ocean canvas
│   │   ├── hero/        # Hero section, physics stage, and beach characters
│   │   ├── journey/     # Experience history and progress timeline
│   │   ├── navigation/  # Floating navigation bar
│   │   ├── profile/     # Technical profile and architecture stage
│   │   ├── projects/    # Project showcase, filters, and case-study modal
│   │   ├── tech/        # Technology pipeline and beach decorations
│   │   └── ui/          # Tactile buttons and notification components
│   ├── data/            # Centralized portfolio data (portfolioData.ts)
│   ├── hooks/           # Custom hooks for scrolling, card tilt, and more
│   ├── types/           # TypeScript definitions
│   ├── App.tsx          # Main page component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Tailwind CSS v4 configuration
├── package.json
└── vite.config.ts
```

---

## Deploying to Vercel or Netlify

This website is a Vite-powered single-page application. Connect the repository directly to Vercel or Netlify without additional server configuration.

---

## License

Released under the [MIT License](LICENSE). You may use, modify, and distribute this template for personal or commercial projects. Originally created by [Reyhand Astra](https://github.com/ryhndastra).
