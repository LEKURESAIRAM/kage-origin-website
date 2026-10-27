# KAGE ORIGIN website

The website now uses React, TypeScript, and Vite, with Tailwind CSS, React Three Fiber, Drei, Three.js, GSAP ScrollTrigger, and Lucide React in the application stack. The original page is retained as `legacy-site.html` while its existing content and interactions are migrated into the React shell.

## Run locally

1. Install Node.js 20 or newer.
2. Install dependencies: `npm install`
3. Start Vite: `npm run dev`
4. Open the local URL printed by Vite.

Create and type-check a production build with `npm run build`. Preview that build with `npm run preview`.

## Deploy

Import the project into Vercel, select the Vite preset, set the build command to `npm run build`, and set the output directory to `dist`. The project can also be deployed to any static host that serves Vite's `dist` output.

## Contact form (Formspree)

The enquiry form submits each enquiry to Formspree. Create a form in Formspree, configure its notification recipient, and copy the form endpoint into `VITE_FORMSPREE_ENDPOINT` in `.env.local`. The project includes a safe placeholder in `.env.example`; replace it with your actual endpoint. The endpoint is a public submission URL, not a secret API key.

For local development, create `.env.local` only if one does not already exist, and preserve any existing values. Restart Vite after changing environment variables. In Vercel, set `VITE_FORMSPREE_ENDPOINT` for the environments you use and redeploy. The form displays success only after Formspree responds successfully, and reports a clear error if it does not.

The Formspree email delivery has not been tested as part of this project change. Configure and verify the form using your own Formspree account.

## Assets

Vite serves image URLs from `public`. The page references these deployment-safe paths:

- `/assets/KO.jpeg`
- `/assets/hero-logo-scene.png`
- `/assets/WhatsApp%20Image%202026-10-26%20at%205.13.48%20PM.jpeg`
- `/assets/WhatsApp%20Image%202026-10-26%20at%205.14.24%20PM.jpeg`
- `/assets/WhatsApp%20Image%202026-10-26%20at%205.36.16%20PM.jpeg`

The logo and three founder portraits are already in `public/assets` under the filenames above. Keep the spaces URL-encoded when referencing the founder image names.

The original hero artwork remains at its supplied source attachment path. Copy it to `public/assets/hero-logo-scene.png`; it cannot be served from a local Windows attachment path by Vite. Do not use an unrelated image as a replacement. The original logo and portrait source files should be left unchanged.
