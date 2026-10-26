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

## Contact form (Supabase and Formspree)

The enquiry form sends email notifications through Formspree and, when configured, also inserts submissions into `public.customer_enquiries` using the official `@supabase/supabase-js` client. A success message is shown only when Formspree succeeds and any configured Supabase insert succeeds. If one service succeeds and the other fails, the form reports the partial result; retrying the unchanged form data retries only the failed service to avoid duplicate records or notifications.

1. In Supabase, open the project's SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql). Its final query reports whether RLS is enabled, `anon` can insert, anonymous/authenticated roles cannot read, and the insert-only policy exists. Confirm those results before accepting submissions.
2. Create a form in Formspree, configure its notification recipient as your desired email address, then copy its form endpoint (for example, the endpoint shown on the Formspree form integration page) into `VITE_FORMSPREE_ENDPOINT` in `.env.local`. Replace the `.env.example` placeholder with your own endpoint; do not add private API keys to frontend environment variables.
3. For local development, copy `.env.example` to `.env.local` only if you do not already have a local environment file, and preserve existing values. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` using the project URL and **publishable/anon** key from Supabase, and set `VITE_FORMSPREE_ENDPOINT` to the actual Formspree endpoint. Restart Vite after changing environment variables.
4. In Vercel, add the Supabase variables and `VITE_FORMSPREE_ENDPOINT` under the project's Environment Variables for Production, Preview, and Development, then redeploy.
5. View database submissions in Supabase under **Table Editor → customer_enquiries**. Formspree email delivery can be inspected in the Formspree dashboard. Access those dashboards only with your accounts.

The publishable/anon key is intended for browser use and is protected by the table's insert-only policy. **Never put a Supabase `service_role` or secret key in a `VITE_` variable or browser code.** The Formspree endpoint is a public submission URL, not a secret API key. The form reports errors and partial failures rather than claiming all configured services succeeded.

If the Supabase dependency was added after dependencies were installed, run `npm install` before starting Vite or running the production build.

The public form can still receive automated spam. For a production launch with high traffic or sensitive data, add server-side rate limiting and CAPTCHA verification (for example, through a Supabase Edge Function and Turnstile) before opening public submissions.

## Assets

Vite serves image URLs from `public`. The page references these deployment-safe paths:

- `/assets/KO.jpeg`
- `/assets/hero-logo-scene.png`
- `/assets/WhatsApp%20Image%202026-10-26%20at%205.13.48%20PM.jpeg`
- `/assets/WhatsApp%20Image%202026-10-26%20at%205.14.24%20PM.jpeg`
- `/assets/WhatsApp%20Image%202026-10-26%20at%205.36.16%20PM.jpeg`

The logo and three founder portraits are already in `public/assets` under the filenames above. Keep the spaces URL-encoded when referencing the founder image names.

The original hero artwork remains at its supplied source attachment path. Copy it to `public/assets/hero-logo-scene.png`; it cannot be served from a local Windows attachment path by Vite. Do not use an unrelated image as a replacement. The original logo and portrait source files should be left unchanged.
