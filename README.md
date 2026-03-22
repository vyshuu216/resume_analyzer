# ◈ ResumeAI — MERN Stack Resume Analyser

An AI-powered resume analyser built with **MongoDB, Express, React, and Node.js**. Upload a PDF resume and get instant AI-driven feedback including a score, strengths, weaknesses, keyword analysis, and actionable improvement suggestions.

---

## ✨ Features

- 📊 **Resume Score** — 0–100 quality score
- 💪 **Strengths & Weaknesses** — AI-detected pros and cons
- 🔍 **Keyword Analysis** — Found and missing industry keywords
- ✅ **Section Checklist** — Contact, Experience, Education, Skills, etc.
- 💡 **AI Suggestions** — Specific, actionable improvement tips
- 🗂 **History** — View and manage all past analyses
- 🎨 **Modern Dark UI** — Sleek editorial design with animated score ring

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, custom CSS              |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| AI         | Anthropic Claude API (Sonnet)     |
| PDF Parse  | pdf-parse npm package             |
| File Upload| multer (memory storage)           |

---

## 📁 Project Structure

```
resume_analyser/
├── client/                  ← React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── UploadPage.js / .css
│   │   │   ├── ResultsPage.js / .css
│   │   │   └── HistoryPage.js / .css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── server/                  ← Express backend
│   ├── controllers/
│   │   └── resumeController.js
│   ├── models/
│   │   └── Resume.js
│   ├── routes/
│   │   └── resume.js
│   ├── index.js
│   ├── .env.example
│   └── package.json
│
├── package.json             ← Root (run both together)
├── .gitignore
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### 1. Clone / extract the project

```bash
cd resume_analyser
```

### 2. Install all dependencies

```bash
npm run install-all
```

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/resume_analyser
PORT=5000
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

### 4. Run the app (development)

From the root directory:
```bash
npm run dev
```

This starts:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

---

## 🔌 API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | /api/resume/upload    | Upload & analyse a PDF       |
| GET    | /api/resume           | Get all analyses (history)   |
| GET    | /api/resume/:id       | Get single analysis          |
| DELETE | /api/resume/:id       | Delete an analysis           |
| GET    | /api/health           | Health check                 |

---

## 📦 Dependencies

### Server
- `express` — HTTP server
- `mongoose` — MongoDB ORM
- `multer` — File upload handling
- `pdf-parse` — PDF text extraction
- `node-fetch` — HTTP requests to Anthropic API
- `cors` — Cross-origin resource sharing
- `dotenv` — Environment variables

### Client
- `react` — UI framework
- `axios` — API requests

---

## 🚀 Deployment

### Frontend (Vercel / Netlify)
```bash
cd client && npm run build
```
Deploy the `client/build` folder.

### Backend (Railway / Render / Fly.io)
Set environment variables and deploy the `server/` folder.

---

## 📜 License

MIT — open source and free to use.
