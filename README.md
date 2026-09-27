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
| Deploy | Vercel (single project — frontend + backend together) |

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

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your real values
```

> The frontend `.env` already points to `localhost:5001` for local dev — no changes needed.

### 4. Run locally
```bash
npm run dev
```
- Frontend → http://localhost:3000  
- Backend  → http://localhost:5001

---

## Deploy to Vercel (Frontend + Backend Together)

Both frontend and backend deploy as a **single Vercel project** from the repo root.

```
https://your-app.vercel.app/          → React frontend (static)
https://your-app.vercel.app/api/*     → Express backend (serverless)
```

### Step 1 — Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/skillgap-ai.git
git push -u origin main
```

### Step 2 — Create Vercel Project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. **Root Directory**: leave as `.` (repo root)
4. **Framework Preset**: Other
5. **Build Command**: `npm run build --prefix frontend`
6. **Output Directory**: `frontend/build`
7. **Install Command**: `npm run install:all`

### Step 3 — Add Environment Variables in Vercel Dashboard

| Variable | Value |
|---|---|
| `MONGODB_URI` | `mongodb+srv://...` (your Atlas connection string) |
| `JWT_SECRET` | a long random string (min 32 chars) |
| `SESSION_SECRET` | another long random string |
| `GEMINI_API_KEY` | your Gemini API key |
| `GOOGLE_CLIENT_ID` | your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | your Google OAuth client secret |
| `FRONTEND_URL` | `https://your-app.vercel.app` (your Vercel URL) |
| `NODE_ENV` | `production` |
| `VERCEL` | `1` |

### Step 4 — Update Google OAuth Redirect URI

In [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → your OAuth 2.0 app:

Add **Authorized redirect URI**:
```
https://your-app.vercel.app/api/auth/google/callback
```

### Step 5 — Deploy 🚀

Click **Deploy** in Vercel. Done!

---

## Security

- ✅ All `.env` files are git-ignored — never committed
- ✅ `.env.example` files provided as safe templates
- ✅ JWT auth on all protected routes
- ✅ CORS configured for known origins only
- ✅ `httpOnly` + `secure` cookies in production
- ✅ File uploads limited to 10MB
- ✅ Input validation on all API routes

---

## Project Structure

```
skillgap-ai/
├── backend/
│   ├── config/         # DB + Passport OAuth
│   ├── controllers/    # Route logic
│   ├── middleware/     # JWT auth guard
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── utils/          # Gemini AI, PDF, OCR
│   ├── .env.example    ← copy to .env
│   └── server.js       # Entry point (also Vercel handler)
├── frontend/
│   ├── src/
│   │   ├── components/ # Navbar, FileUpload, etc.
│   │   ├── pages/      # Home, Dashboard, Login
│   │   ├── context/    # Auth context
│   │   └── services/   # Axios API client
│   ├── .env            # Local dev (localhost:5001)
│   ├── .env.production # Production (/api relative path)
│   └── .env.example    ← reference
├── vercel.json         # Single-project Vercel config
├── package.json        # Root scripts
└── README.md
```
