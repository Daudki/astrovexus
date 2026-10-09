# AstroVexus

A new software studio in Mbeya, Tanzania. Two founders, a programmer and a designer, building real software, honest brands, and the products we wish existed here.

## Structure

- `frontend/`: the studio site (deployed on Vercel)
- `backend/`: the API (Node + Express + TypeScript), starting with email signup and autoresponder

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Motion for animations
- React Router
- Lucide icons
- Web3Forms for the contact form
- Express 5 + Zod + Resend for the API (newsletter signup and autoresponder)

## Local development

```bash
# frontend (http://localhost:5173)
cd frontend && cp .env.example .env && npm install && npm run dev

# backend (http://localhost:4000), runs in dry-run mode without a Resend key
cd backend && cp .env.example .env && npm install && npm run dev
```

## Deployment

- **Frontend (Vercel):** set the project's Root Directory to `frontend`. Env vars: `VITE_WEB3FORMS_KEY`, `VITE_API_URL` (public URL of the backend). Redeploy after changing them.
- **Backend (Render, Railway or Fly):** root directory `backend`, build `npm install && npm run build`, start `npm start`. Env vars: see `backend/.env.example`. Set `FRONTEND_ORIGIN` to the site URL so CORS allows it.

## Contact

astrovexus@gmail.com · +255 625 596 269

Built in Mbeya.
