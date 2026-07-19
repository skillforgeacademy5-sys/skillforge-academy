# SkillForge Academy

Official website and backend API for SkillForge Digital Academy.

## Stack

- **Frontend**: Static HTML/CSS/JS pages
- **Backend**: Node.js 22 + Express 5
- **Database**: Supabase (PostgreSQL)
- **Payments**: Paystack
- **Runtime**: Node.js 22

## Running the project

The `Start application` workflow runs `npm start`, which starts the Express server on port 5000.

```bash
npm start
```

## Environment variables / Secrets

The following secrets must be set (stored as Replit Secrets):

| Key | Description |
|-----|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin access) |
| `PAYSTACK_SECRET_KEY` | Paystack secret key for payment processing |

`PORT` is set to `5000` via a shared environment variable.

## API routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/initialize-payment` | Start a Paystack payment |
| `POST` | `/verify-payment` | Verify payment and save student record |
| `GET` | `/students` | List saved student records |

## Frontend

The static HTML files (`index.html`, `courses.html`, `contact.html`, etc.) are served separately. Update `js/config.js` with the backend URL before deploying the frontend.

## User preferences

- Keep the existing project structure and stack.
