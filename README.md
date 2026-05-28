# ✦ Guraka Kalyan | Full-Stack Developer Portfolio

Welcome to the official repository for **Guraka Kalyan's Developer Portfolio**. This is a high-performance, single-page application built on a premium, high-aesthetic vanilla tech stack with smooth scroll physics and robust backend integrations.

This document serves as the master guide for developers, collaborators, or future maintainers to fully understand, customize, and operate this portfolio.

---

## 🚀 Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Core Architecture** | **HTML5 / ES6 JavaScript** | Semantic structure and high-performance vanilla scripting. |
| **Styling & System** | **Vanilla CSS3** | Customized layout engine with responsive designs and fluid sizing. |
| **Bundler & Server** | **Vite** | Modern, fast frontend toolchain and dev server. |
| **Animations** | **GSAP (GreenSock) + ScrollTrigger** | Hardware-accelerated, high-fidelity scroll-bound page interactions. |
| **Scroll Engine** | **Lenis Scroll** | Ultra-smooth inertial scroll engine for consistent feel across devices. |
| **Backend API** | **Vercel Serverless Functions (Node.js)** | Serverless endpoints handling contact inquiries. |
| **Database** | **MongoDB Atlas + Mongoose** | Document store saving inquiries with structured schemas. |
| **Email Service** | **Resend SDK** | Double-sided automated notification delivery. |

---

## 🗂️ Project Architecture & File Structure

Here is a map of the codebase and the role of each directory/file:

```
GK-portfolio/
├── .env                  ← Environment variables (local credentials)
├── .env.local            ← Local environment variables backup
├── index.html            ← The entrypoint (markup, structural sections, SEO)
├── package.json          ← Project metadata, scripts, and npm dependencies
├── vite.config.js        ← Vite environment config
├── vercel.json           ← Vercel serverless configurations & route rewrites
├── api/
│   └── contact.js        ← serverless endpoint (/api/contact) for form submissions
├── css/                  ← Modular Stylesheets
│   ├── globals.css       ← Custom variables, reset styles, font families
│   ├── home.css          ← Core home page visual layout styles
│   ├── menu.css          ← Navigation overlay styling & hover micro-animations
│   ├── about.css         ← About section layout & profile card styles
│   ├── project.css       ← Portfolio items styling
│   ├── contact.css       ← Form validation & responsive contact grids
│   ├── footer.css        ← Copyright layouts & aesthetic symbols
│   └── transition.css    ← Page load animations & fade systems
├── js/                   ← Interactive JavaScript Modules
│   ├── hero.js           ← Cycles hero flipbook & manages GSAP scroll hero scale
│   ├── featured-work.js  ← Generates 3D layout, updates horizontal scroll trigger
│   ├── services.js       ← Handles hover cards & grid scroll transforms
│   ├── menu.js           ← Fullscreen navigation menu open/close transitions
│   ├── lenis-scroll.js   ← Boots smooth scroll physics & Lenis updates
│   ├── transition.js     ← Multi-overlay loading page transits
│   ├── about.js          ← Bio section slide-ins & portrait controls
│   └── footer.js         ← Special floating animations & copyright updates
└── public/               ← Static Assets (Directly served at root /)
    ├── Guraka_Kalyan_Resume.pdf
    └── images/
        ├── global/       ← Logo emblems, loading site icons, floating assets
        ├── hero/         ← Intended hero-specific animation assets (img1.jpg - img10.jpg)
        ├── services/     ← Tech categories & backgrounds
        ├── services-header/
        └── work-items/   ← Project screenshots & media items (work-item-1.jpg - work-item-10.jpg)
```

---

## 🎬 Core Interaction Engines

This portfolio relies on elegant micro-animations and scroll-driven visuals. Here is how they operate:

### 1. The Hero Flipbook Carousel (`/js/hero.js` & `index.html`)
* **Initial State:** In `index.html`, the hero section loads inside the `section.hero-img-holder` under a container `.hero-img`.
* **Rapid Cycling Animation:** To make the hero interactive, the JS boots an interval running every **250ms**. It loops an index from `1` to `10` and swaps the image source:
  `/images/work-items/work-item-${currentImageIndex}.jpg`
* **GSAP Scroll Scaling:** When a user scrolls down, GSAP's `ScrollTrigger` tracks `.hero-img-holder` (height `100vh`). It translates the image container upward, scales it up from `0.25` to `1.0`, and rotates it back from `-15deg` to `0deg`, producing an organic "expanding into view" effect.

### 2. The Horizontal Scroll Gallery (`/js/featured-work.js` & `index.html`)
* **3D Horizontal Movement:** Large screens map vertical scroll to horizontal slide movement. It pins the container `.featured-work` and slides the title block across the viewport.
* **Fading 3D Cards:** While sliding, it pre-generates 3D card entities in perspective space (`z-depth` shifting from `-1500px` forward to `1500px` scaling onto the page) mapping to progress metrics.

---

## 🖼️ Guide to Manually Updating Portfolio Images

The developer can manually swap these assets with real, high-resolution project screenshots. 

### 1. Hero Section Flipbook
* **Asset Location:** `public/images/work-items/` (Or `public/images/hero/`)
* **Required Count:** **10 images**
* **Filename Pattern:** `work-item-1.jpg` to `work-item-10.jpg`
* **Optimal Aspect Ratio:** `4:5` (or a tall `3:4` vertical aspect ratio).
* **Recommended Resolution:** `800px x 1000px` (keep compression high for instant loading).
* **How to update:** Replace the files `work-item-1.jpg` through `work-item-10.jpg` with your own images. *Note: Since the script cycles through all 10, ensure you replace all 10 files to keep the animation smooth.*

### 2. Featured Projects Section
The **Featured Projects** section showcases **all 6 of your main projects** split into categories (Freelance vs. Other). The text descriptions are hardcoded in `index.html`, while the horizontal slider pulls the images from `work-item-1.jpg` to `work-item-6.jpg`.

#### Currently Mentioned Projects in the Code:

| Filename | Project | Category | Display Title in Portfolio |
| :--- | :--- | :--- | :--- |
| **`work-item-1.jpg`** | VentureMond Website | Freelance | **VentureMond** |
| **`work-item-2.jpg`** | Stacli Website | Freelance | **Stacli Website** |
| **`work-item-3.jpg`** | Pinaka Retail | Freelance | **Pinaka Retail** |
| **`work-item-4.jpg`** | Pinaka Farm | Freelance | **Pinaka Farm** |
| **`work-item-5.jpg`** | Lead Management System | Other | **Lead Management** |
| **`work-item-6.jpg`** | Insight AI | Other | **Insight AI** |

#### How to update:
1. **Prepare screenshots:** Prepare high-quality screenshots for these six projects named `work-item-1.jpg` through `work-item-6.jpg`.
2. **Save to folder:** Place them in `public/images/work-items/`.
3. **Edit project text/labels:** If you want to change any titles or sub-labels, edit the featured projects wrapper inside `index.html`.

---

## 📥 Backend Contact Inquiry System (`/api/contact.js`)

The contact form is powered by a high-performance serverless Node.js function integrated directly into Vercel's hosting pipeline.

### Submission Flow:
```
[Contact Page Form] → POST Request → [/api/contact]
                                          │
                  ┌───────────────────────┴────────────────────────┐
                  ▼                                                ▼
     [Mongoose (MongoDB Atlas)]                       [Resend SDK Emailer Dispatch]
   Saves contact details under                        1. Transmits alert to Admin.
   collection 'portfolio_leads'                       2. Sends HTML auto-reply to client.
```

### Necessary Credentials (Environment Variables):
Ensure these are configured in `.env` (local testing) and Vercel dashboard (production):

* **`MONGODB_URI`**: The connection string to your MongoDB Atlas cluster.
* **`RESEND_API_KEY`**: Your API key from Resend.com to dispatch transactional emails.
* **`ADMIN_EMAIL`**: The email address where you want to receive new leads notifications (e.g., `kalyangk777@gmail.com`).

---

## 🛠️ Local Development & Commands

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
Clone the repository, navigate to the folder, and install the dependencies:
```bash
npm install
```

### Run Locally
Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
To generate a production-ready bundle inside the `dist/` directory:
```bash
npm run build
```
This output is optimized and ready to be served statically on Vercel, Netlify, or Github Pages.
