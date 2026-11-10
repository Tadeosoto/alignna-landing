# Alignna landing

Standalone Alignna waitlist landing (extracted from Caenna with route/form/API parity).

## Routes

| Path | Page |
|------|------|
| `/` | Main landing |
| `/thank-you-page` | Post-submit thank-you |

## Local development

```bash
npm install
cp .env.example .env.local   # fill values as needed
npm run dev
```

Open `http://127.0.0.1:5173/`.

For local subscribe to hit a remote API, set `VITE_NEWSLETTER_ENDPOINT` to that URL. With Vercel CLI (`vercel dev`) the `/api/subscribe` function runs locally.

## Vercel Production

1. Import this GitHub repo in Vercel.
2. Framework preset: Vite (build `vite build`, output `dist`).
3. Add **Production** env vars (same contract as Caenna):

   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `SUBSCRIBE_NOTIFY_EMAIL`
   - `VITE_NEWSLETTER_ENDPOINT=/api/subscribe`
   - Optional: `VITE_NEWSLETTER_NOTIFY_EMAIL`, `NEWSLETTER_ADMIN_TOKEN`, `VITE_GA_MEASUREMENT_ID`

4. Deploy and test:

   - `https://<project>.vercel.app/`
   - Submit the waitlist form → should land on `/thank-you-page` and upsert into the shared `subscribers` table (`source`: `alignna-v2-hero` / `mid` / `final`).

`vercel.json` keeps SPA rewrites; `/api/*` stays as serverless functions.

## Email / Resend

Day 1: reuse the same Resend account and API key as Caenna. When Alignna has its own domain, verify that domain in Resend and update `RESEND_FROM_EMAIL` (e.g. `Alignna <hello@alignna.com>`).

## Follow-ups (not required for first deploy)

- Verify Alignna sending domain in Resend when the domain is ready.
- Cutover redirects from Caenna `/alignna-v2` and `/alignna/thank-you` to this project.
- Optimize large GIFs / consider Git LFS or a CDN (repo media is heavy).
