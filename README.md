# skillforge-academy
Official website for SkillForge Digital Academy

## Overview

This repository contains the SkillForge Academy static website and a Node.js backend for payment handling and Supabase integration.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Populate `.env` with your values:

   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `PORT` (optional)

## Run locally

```bash
npm start
```

The backend listens on the configured `PORT` or `3000` by default.

## Frontend deployment

Update `js/config.js` with your backend URL before deploying the static site. The frontend uses `window.BACKEND_URL` for payment integration.

## Deployment notes

- The frontend can be hosted as static files (GitHub Pages, Netlify, Vercel, etc.).
- The backend should be deployed to a Node.js hosting service with the environment variables set.
- Ensure the checkout flow uses the backend URL in `js/payment.js` and `success.html`.

## API routes

- `POST /initialize-payment` — start Paystack payment initialization
- `POST /verify-payment` — verify Paystack payment and save the student record
- `GET /students` — retrieve saved student records
