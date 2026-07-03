# Panda Farm House — PRD

## Problem Statement
Premium, modern, fully responsive landing page for "Panda Farm House" — a sustainable farm in Banaparia, Balasore, Odisha (756056) specializing in Fresh Fish, Organic Vegetables, Mushroom Cultivation and Poultry. Goal: showcase the farm, build trust, attract customers/wholesalers/visitors, and drive inquiries.

## User Personas
- Local family shoppers looking for fresh, chemical-free produce
- Restaurants / wholesalers sourcing consistent supply
- Farm visitors / agri-tourism enthusiasts

## Core Requirements (static)
- Sections: Hero (parallax), About, Services (Fish/Vegetables/Mushrooms/Poultry), Why Choose Us, Gallery (masonry + lightbox), Reviews (4.8/5 Google), Farming Process (Seed → Grow → Harvest → Deliver), Stats (animated counters), Visit (address + hours + embedded Google Map), Contact Form, Footer.
- Floating WhatsApp (+91 8328830796), Call (+91 98614 48443), Back-to-Top.
- Palette: Forest Green #2E7D32, Leaf Green #4CAF50, Earth Brown #6D4C41, Cream #FDFBF7, Golden Yellow #FBC02D.
- Fonts: Cormorant Garamond (headings) + Outfit (body).
- Fully responsive, sticky navbar, smooth scroll, scroll reveal animations, glassmorphism.

## Architecture & Tasks Done (Dec 2025)
- Backend (FastAPI + MongoDB, `/app/backend/server.py`)
  - `POST /api/contact` — creates a ContactSubmission, sends email via Emergent-managed Resend proxy, persists to MongoDB. Never fails on email error (returns `email_sent=false`).
  - `GET /api/contact` — list submissions (newest first, with limit).
  - `GET /api/health` and `GET /api/`.
  - Env: `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME="Panda Farm House"`, `CONTACT_RECIPIENT_EMAIL=lumenxo70@gmail.com`.
- Frontend (React 19 + Tailwind + framer-motion + lucide-react + sonner)
  - `pages/LandingPage.jsx` composes all sections.
  - Components: `Navbar`, `Hero` (parallax + ken-burns), `About`, `Services`, `WhyChooseUs`, `Gallery` (masonry + lightbox), `Reviews`, `Process`, `Stats` (framer-motion useInView counters), `Visit` (embedded Google Map iframe), `ContactForm`, `Footer`, `FloatingButtons`.
  - Custom `Logo.jsx` emblem (leaf + panda eyes).
  - Test IDs in `constants/testIds/farm.js`.
  - SEO title + description + OG in `public/index.html`.

## What's Been Implemented (Dec 2025)
- Full landing page + working contact form with email + Mongo persistence.
- All accessibility & data-testid coverage verified by testing agent (backend 100%, frontend 100%).

## Backlog
- P1: Add newsletter signup / seasonal produce mailer.
- P1: Multilingual support (Odia + Hindi + English).
- P2: Product catalog with real prices + Razorpay/UPI checkout.
- P2: Blog / Journal ("From the Farm" stories) for SEO.
- P2: Wholesaler login area with saved orders.

## Next Tasks
- Awaiting real farm photos & final logo asset from owner.
- Optionally: instrument analytics events for CTA clicks + form submissions.
