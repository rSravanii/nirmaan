# Nirmaan — Local Setup & Deployment Guide
**Smart India Hackathon Problem Statement:** SIH26043  
**Ministry:** Government of Jharkhand  

---

## 1. Quickstart (Zero-Config Hackathon Mode)

GramUtthan includes an automatic embedded in-memory MongoDB runner and deterministic AI engine, allowing it to start out-of-the-box without manual database or API key setup.

### Prerequisites
- Node.js v18+ (Tested on Node.js v24.19)
- npm v10+

### Step 1: Start Backend Server
```bash
cd server
npm install
npm run dev
```
*Note for Windows PowerShell users:* If script execution policy restrictions appear, execute using `npm.cmd`:
```powershell
cd server
npm.cmd install
npm.cmd run dev
```
The server will initialize the embedded MongoDB database, run the seed script automatically if empty, and begin listening on `http://localhost:5000`.

### Step 2: Start Frontend Client
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
*Windows PowerShell:*
```powershell
cd client
npm.cmd install
npm.cmd run dev
```
Open `http://localhost:5173` in your browser.

---

## 2. Environment Configuration

### Backend (`server/.env`)
```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Leave empty to use auto-fallback embedded MongoMemoryServer
MONGODB_URI=

# JWT Secrets
JWT_SECRET=gramutthan_super_secret_jwt_key_sih26043_2026
JWT_EXPIRES_IN=7d

# Demo Mode Configuration
DEMO_MODE=true
DEMO_AI_LATENCY_MS=500

# AI Provider ('demo' or 'gemini')
AI_PROVIDER=demo
AI_API_KEY=
AI_MODEL=gemini-1.5-flash

# Deduplication Threshold (0.0 to 1.0)
DEDUP_SIMILARITY_THRESHOLD=0.80
```

### Frontend (`client/.env`)
```ini
VITE_API_URL=/api
VITE_SOCKET_URL=http://localhost:5000
VITE_DEMO_MODE=true
```

---

## 3. Seed Data & Demo Accounts

To re-seed or wipe database with fresh Jharkhand reports:
```bash
cd server
npm run seed
```

### Pre-seeded Demo Accounts (Password: `Demo@123`)
| Role | Email | Name / Institution |
| :--- | :--- | :--- |
| **Citizen** | `citizen@demo.com` | Birsa Munda (Ranchi Villager) |
| **Student** | `student@demo.com` | Aarav Sharma (BIT Mesra, Civil Engg) |
| **Professor** | `professor@demo.com` | Dr. Rameshwar Mahto (BIT Mesra, Structural) |
| **Evaluator** | `evaluator@demo.com` | Pooja Soren (District Authority, Ranchi) |
| **Admin** | `admin@demo.com` | State Administrator (Govt of Jharkhand) |

*(You can also use the 1-click **"Try Demo As"** bar pinned to the top of the app).*

---

## 4. Running Automated Tests
```bash
cd server
npm test
```
Runs Vitest unit tests verifying language detection, translation, cosine vector similarity, smart matching weights, and PII privacy masking.

---

## 5. Production Deployment Instructions

### Frontend (Vercel)
1. Push repository to GitHub.
2. Link the `/client` directory to Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Configure environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend (Render / Railway)
1. Link the `/server` directory to Render or Railway Web Service.
2. Build command: `npm run build`
3. Start command: `npm start`
4. Configure MongoDB Atlas connection string in `MONGODB_URI`.
5. Set `CLIENT_URL=https://your-frontend.vercel.app`.
