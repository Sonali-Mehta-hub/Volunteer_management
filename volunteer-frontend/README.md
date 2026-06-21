# NayePankh — Volunteer Management Frontend

A React (Vite) frontend for the Volunteer Information Management System backend.
Built for demoing the backend — login, registration, volunteer dashboard, and admin panel.

## Setup

1. **Make sure your backend is running first** (`uvicorn app.main:app --reload`) at `http://127.0.0.1:8000`.

2. **Add CORS to your backend** if you haven't already — in `app/main.py`, right after `app = FastAPI()`:
   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the dev server:**
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

## What's included

- **Login / Register** — split-screen auth pages
- **Volunteer Dashboard** — shows the logged-in volunteer's profile and approval status
- **Admin Panel** — list of all volunteers with filters by status, approve/reject, promote/demote
  role, and delete actions — all calling your backend's admin APIs directly

## Notes

- The API base URL is set in `src/api.js` (`BASE_URL`) — change it if your backend runs on a
  different port.
- Auth token is stored in `localStorage` so refreshing the page doesn't log you out.
- To log in as admin, you still need to manually set a user's `role` to `"admin"` in MongoDB
  the first time (same as in the backend) — after that, you can promote/demote other users
  directly from the Admin Panel UI.
