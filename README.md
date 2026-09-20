# Nirmaan — Crowdsourced Social Innovation Network
### Smart India Hackathon • Problem Statement SIH26043 • Government of Jharkhand
**"From Rural Problems to Real-World Solutions"**

[![SIH26043](https://img.shields.io/badge/SIH-SIH26043-10b981.svg)](https://sih.gov.in)
[![Government of Jharkhand](https://img.shields.io/badge/Ministry-Govt%20of%20Jharkhand-15803d.svg)](https://jharkhand.gov.in)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20TypeScript%20%2B%20Vite%20%2B%20Leaflet-blue.svg)]()
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-13%2F13%20Passed-emerald.svg)]()

---

## What is Nirmaan?
Nirmaan is a fully functioning, end-to-end civic-tech prototype engineered for the Government of Jharkhand. It bridges the gap between fragmented rural challenges and state university research institutions through a verified loop:

$$\textbf{REPORT} \longrightarrow \textbf{UNDERSTAND} \longrightarrow \textbf{MATCH} \longrightarrow \textbf{RESOLVE} \longrightarrow \textbf{VERIFY} \longrightarrow \textbf{REWARD}$$

The system is built without fake mockups, broken diagrams, or hardcoded UI states. Every visible module is backed by functioning REST APIs, database schemas, vector math, and an automated zero-config setup.

---

## Key Differentiators & Highlights

1. **Multilingual Audio & Script Support**:
   - Native UI and AI processing for **English, Hindi, Telugu, Santhali (Ol Chiki), Mundari, and Ho**.
   - Removes linguistic and literacy barriers for rural villagers.

2. **Native Mobile Camera Access (`getUserMedia`)**:
   - Browser and phone camera viewfinder with live preview, photo snapshot, retake, and file upload fallback.
   - Built to work seamlessly on smartphones during field inspections.

3. **Semantic Vector Deduplication**:
   - Employs cosine vector similarity on normalized 64-dimensional embeddings.
   - Merges multiple reports of the same incident (e.g., *"Bridge near village is broken"* vs *"The same bridge cannot be used after the damage"*) into a single consolidated cluster ($>90\%$ similarity).

4. **Transparent Smart University Matching**:
   - Connects civic challenges to engineering departments, student teams, and faculty mentors using a transparent scoring formula:
     $$\text{MatchScore} = 0.55 \cdot \text{sem} + 0.20 \cdot \text{dom} + 0.10 \cdot \text{kw} + 0.10 \cdot \text{dept} + 0.05 \cdot \text{exp}$$

5. **Milestone Verification & Impact Tracking**:
   - Real-time project collaboration workspaces with Socket.IO.
   - District Authority Evaluators physically review specimen test reports, approve milestones, and certify impact.

6. **Interactive Leaflet GIS Mapping**:
   - Centered on Jharkhand with markers across Ranchi, Bokaro, Dhanbad, Hazaribagh, Dumka, Deoghar, Gumla, and Simdega.

7. **10-Slide Hackathon Jury Presentation Deck**:
   - Integrated into `/presentation`, covering Problem Definition, Architecture, Tech Stack, AI Innovation, Gamification, Feasibility, Roadmap, and Future Scope.

8. **Zero-Config Hackathon Demo Mode**:
   - Automatic fallback to an embedded in-memory MongoDB database and deterministic AI pipeline if external cloud credentials are not supplied.

---

## Quick Start Guide

### 1. Run Backend Server
```bash
cd server
npm.cmd install
npm.cmd run dev
```
Starts API server on `http://localhost:5000` with auto-seeded Jharkhand civic reports and embedded database.

### 2. Run Frontend Client
```bash
cd client
npm.cmd install
npm.cmd run dev
```
Access the application on `http://localhost:5173`.

### 3. Run Automated Tests
```bash
cd server
npm.cmd test
```

---

## Demo Accounts (Password: `Demo@123`)
Use the **"Try Demo As"** bar at the top of the screen to switch roles with a single click:
- **Citizen:** `citizen@demo.com`
- **Student Lead:** `student@demo.com` (BIT Mesra Civil Engineering)
- **Professor:** `professor@demo.com` (Dr. Rameshwar Mahto)
- **Authority Evaluator:** `evaluator@demo.com` (Pooja Soren, Ranchi)
- **State Admin:** `admin@demo.com`

---

## Project Structure
```
SIH pragati-jharkhand/
├── client/                     # React 18 + Vite + TypeScript frontend
│   ├── src/
│   │   ├── api/                # API client with JWT interceptor
│   │   ├── components/         # Camera, MapView, AI Cards, DemoSwitcher
│   │   ├── context/            # AuthContext, LanguageContext, SocketContext
│   │   ├── hooks/              # useCamera, useOfflineDraft
│   │   ├── i18n/               # EN, HI, TE, Santhali, Mundari, Ho
│   │   ├── layouts/            # MainLayout
│   │   └── pages/              # Landing, Report, Discover, Workspace, Evaluator, Admin, Pitch Deck
├── server/                     # Express + TypeScript + Mongoose backend
│   ├── src/
│   │   ├── config/             # DB connector with in-memory Mongo fallback
│   │   ├── controllers/        # Auth, Problems, AI, Projects, Collaboration, Admin, Rewards
│   │   ├── middleware/         # JWT, RBAC, Multer, ErrorHandler
│   │   ├── models/             # 14 Mongoose models
│   │   ├── routes/             # REST endpoints
│   │   └── services/           # AI provider abstraction, deduplication, matching, translation
│   ├── scripts/                # Seed script with 20+ Jharkhand reports & duplicate clusters
│   └── tests/                  # Vitest unit tests (13/13 passing)
└── docs/
    ├── architecture.md         # Technical architecture documentation
    ├── demo-script.md          # 18-step Hackathon jury presentation sequence
    └── setup.md                # Deployment and configuration instructions
```
