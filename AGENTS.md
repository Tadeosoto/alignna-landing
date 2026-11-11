# Alignna landing

Marketing site for Alignna (posture awareness). One Vite app, two routes, one waitlist API.

## Stack

React 19, JSX, Vite 8, React Router 7, Tailwind CSS 4, Framer Motion, Supabase, Resend. Deployed on Vercel.

Do not add TypeScript, shadcn/ui, Zustand, TanStack Query, or React Hook Form unless the user asks. State is local `useState`. Server data goes through `api/`.

## Map

- `src/App.jsx` — routes: `/` is the landing; thank-you is `/thank-you-page`; unknown paths redirect to `/`
- `src/pages/AlignnaV2.jsx` and `AlignnaV2.css` — landing. Copy the patterns in this file
- `src/pages/AlignnaThankYou.jsx` — post-signup page
- `src/landingPage/components/WaitlistForm.jsx` — email form
- `api/subscribe.js` — save subscriber and notify
- `api/send-launch-broadcast.js` — admin-only launch email
- `.env.example` — env names. Never commit real secrets

## Commands

- `npm run dev` — http://127.0.0.1:5173
- `npm run build`
- `npm run lint`

## How to work

- Match the file you are editing: double quotes, 2-space indent, default export for pages and `WaitlistForm`.
- Do not add comments unless asked.
- After a UI change, open the affected route in the browser and use it. Check a narrow viewport when layout changed.
- Keep each chat on one task. Start a new chat when the task changes.
