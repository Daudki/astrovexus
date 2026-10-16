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

# database (PostgreSQL 16 in Docker), then the backend (http://localhost:4000)
# Emails run in dry-run mode without a Resend key. The first admin is created from ADMIN_* in .env.
cd backend && docker compose up -d && cp .env.example .env
# set ADMIN_PASSWORD in .env (10+ characters), then:
npm install && npm run dev

# optional end-to-end check of login, users and insights against the running API
API=http://localhost:4000 ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run smoke
```

## Insights and the admin area

- `/insights` is public: a social-style feed of short posts (up to 2000 characters, links and #hashtags highlighted). Each post has its own page at `/insights/:id`.
- `/admin` is for the team only, so there is no public link to it. People sign in at `/admin/login`.
- **Admin** can add people, make someone an Admin or a User, reset passwords, disable accounts, and delete any post. **User** can write, edit and delete their own posts.
- New people get a one-time temporary password and must choose their own at first sign-in.
- Posts can have up to 4 images (JPG, PNG, WebP or GIF). Photos are shrunk in the browser before upload and stored on Cloudinary, so set the `CLOUDINARY_*` variables on the backend. Without them everything else works and image uploads are simply off.

## Deployment

- **Frontend (Vercel):** set the project's Root Directory to `frontend`. Env vars: `VITE_WEB3FORMS_KEY`, `VITE_API_URL` (public URL of the backend). Redeploy after changing them.
- **Backend (Render, Railway or Fly):** root directory `backend`, build `npm install && npm run build`, start `npm start`. Use build command `npm ci --include=dev && npm run build` on Render. Env vars: see `backend/.env.example`. Set `FRONTEND_ORIGIN` to the site URL so CORS allows it, `DATABASE_URL` to a PostgreSQL database, and a long random `JWT_SECRET`. Tables are created automatically on start.

## Contact

astrovexus@gmail.com · +255 625 596 269

Built in Mbeya.
