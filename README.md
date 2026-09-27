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
