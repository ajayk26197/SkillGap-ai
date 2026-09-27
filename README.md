# SkillGap AI 🎯

Upload your resume and paste any job description. Our AI instantly scores your match, identifies missing skills, and gives you a personal action plan.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TailwindCSS, Recharts |
| Backend | Node.js, Express, MongoDB Atlas |
| AI | Google Gemini API |
| Auth | Google OAuth 2.0 + JWT |
| OCR | Tesseract.js |
| Deploy | Vercel |

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/skillgap-ai.git
cd skillgap-ai
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your real values
```

**Frontend:**
```bash
# frontend/.env is already set for local dev (points to localhost:5001)
# No changes needed for local development
```

### 4. Run locally

```bash
npm run dev
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:5001

---

## Deployment on Vercel

### Step 1 — Deploy the Backend

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import this GitHub repo
3. Set **Root Directory** to `backend`
4. Framework Preset: **Other**
5. Build Command: *(leave empty)*
6. Output Directory: *(leave empty)*
7. Add these **Environment Variables** in Vercel dashboard:

```
MONGODB_URI          = your MongoDB Atlas connection string
JWT_SECRET           = a long random string (min 32 chars)
SESSION_SECRET       = another long random string
GEMINI_API_KEY       = your Gemini API key
GOOGLE_CLIENT_ID     = your Google OAuth client ID
GOOGLE_CLIENT_SECRET = your Google OAuth client secret
FRONTEND_URL         = https://YOUR-FRONTEND.vercel.app
NODE_ENV             = production
```

8. Deploy → copy the backend URL (e.g. `https://skillgap-ai-backend.vercel.app`)

### Step 2 — Update Google OAuth Redirect URIs

In [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → your OAuth app:
- Add Authorized redirect URI: `https://skillgap-ai-backend.vercel.app/api/auth/google/callback`

### Step 3 — Deploy the Frontend

1. Create another Vercel project from the same repo
2. Set **Root Directory** to `frontend`
3. Framework Preset: **Create React App**
4. Add Environment Variable:

```
REACT_APP_API_URL = https://skillgap-ai-backend.vercel.app/api
```

5. Deploy → done! ✅

---

## Security Checklist

- [x] `.env` files are in `.gitignore` — never committed
- [x] `.env.example` files provided as safe templates
- [x] JWT used for API authentication
- [x] CORS restricts requests to known frontend origins only
- [x] Cookies are `httpOnly` and `secure` in production
- [x] File uploads limited to 10MB
- [x] Input validation on all routes

---

## Project Structure

```
skillgap-ai/
├── backend/
│   ├── config/         # DB + Passport config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── utils/          # AI, PDF, OCR helpers
│   ├── .env.example    # ← copy to .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── .env            # local dev (localhost)
│   ├── .env.production # production (Vercel URL)
│   └── .env.example
├── vercel.json         # Vercel deployment config
└── package.json        # Root scripts (dev, install:all)
```
