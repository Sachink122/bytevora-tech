# My Agency

Production-ready React + TypeScript admin and marketing site built with Vite.

## Requirements

- Node.js 20.19.0 or newer
- npm 10 or newer

## Local Development

```bash
npm install
npm run dev
```

## Auth API (Required For Admin Login)

1. Copy `.env.example` to `.env` and set secure credentials.
2. Start the API server:

```bash
npm run server:dev
```

3. Start the frontend in a separate terminal:

```bash
npm run dev
```

The frontend reads `VITE_API_BASE_URL` from `.env`.

Authentication flow:

- Access token is returned by `/api/auth/login` and stored client-side.
- Refresh token is set as an httpOnly cookie and rotated by `/api/auth/refresh`.
- Admin session logout clears refresh cookie via `/api/auth/logout`.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment Notes

- Admin and dashboard data are persisted in browser local storage.
- Default admin datasets are empty (no seeded demo records).
- Update branding and contact details from Admin Settings before going live.
