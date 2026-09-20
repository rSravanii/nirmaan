# GramUtthan — Technical Architecture Specification
**Smart India Hackathon Problem Statement:** SIH26043  
**Ministry:** Government of Jharkhand  
**Project:** GramUtthan — Crowdsourced Social Innovation Network  

---

## 1. System Overview & The Central Civic Loop
GramUtthan links rural communities, academic research institutions, and state governance authorities through a closed-loop civic pipeline:

$$\text{REPORT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{MATCH} \longrightarrow \text{RESOLVE} \longrightarrow \text{VERIFY} \longrightarrow \text{REWARD}$$

---

## 2. Logical Architecture Diagram

```
+-------------------------------------------------------------------------+
|                      COMMUNITY / NGO / RURAL CITIZEN                    |
|   • Multilingual UI (EN, HI, TE, Santhali, Mundari, Ho)                |
|   • Live Camera / getUserMedia with instant snapshot & retake           |
|   • Audio voice input & browser GPS coordinates                         |
|   • Offline draft resilience via localStorage                           |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                  REACT 18 + VITE RESPONSIVE WEB APP                     |
|   • Role Dashboards: Citizen, Student Lead, Professor, Evaluator, Admin |
|   • Leaflet / OpenStreetMap GIS problem visualizer                      |
|   • 1-Click "Try Demo As" Quick Access Switcher                         |
|   • 10-Slide Built-in Hackathon Jury Pitch Deck                         |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                     EXPRESS.JS REST & REAL-TIME GATEWAY                 |
|   • JWT Bearer Authentication & RBAC Authorization Middleware           |
|   • Helmet HTTP headers, CORS configuration, Multer file handler        |
|   • Real-Time notifications and project chat via Socket.IO              |
|   • Automated PII Scrubbing (Aadhaar / phone numbers)                   |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                            CORE BUSINESS LOGIC                          |
|   • Crowdsourcing CRM & Civic Issue Tracking                            |
|   • Milestone Evidence Lifecycle & Project Workspaces                   |
|   • Authority Field Verification & Evaluation                           |
|   • Impact Points Gamification & University Leaderboards                |
+-------------------------------------------------------------------------+
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
+-----------------------------------+ +-----------------------------------+
|      MONGODB DATABASE TIER        | |      AI ORCHESTRATION PIPELINE    |
| • 14 Normalized Mongoose Schemas  | | • Provider Abstraction Interface  |
| • Zero-config embedded memory     | | • Gemini 1.5 Flash Cloud Provider |
|   server fallback (hackathon ready| | • Deterministic SIH NLP Fallback  |
| • Indexes on district, category,  | | • Multilingual Lexicon Gateway    |
|   status, coordinates, embeddings | | • 64-Dim Normalized Vector Cosine |
+-----------------------------------+ +-----------------------------------+
                  │                                   │
                  └─────────────────┬─────────────────┘
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                 SEMANTIC DEDUPLICATION & SMART MATCHING                 |
|   • Cosine vector similarity clustering (>= 80% threshold)              |
|   • Merges multi-citizen reports into single high-impact clusters       |
|   • Transparent Student/Professor Matching Formula:                     |
|     Score = 0.55*sem + 0.20*dom + 0.10*kw + 0.10*dept + 0.05*exp       |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|               DISTRICT AUTHORITY VERIFICATION & IMPACT REWARDS          |
|   • On-ground milestone verification with evaluator remarks             |
|   • Final state certification & problem marked RESOLVED                 |
|   • Live University & Student Leaderboard update                        |
+-------------------------------------------------------------------------+
```

---

## 3. Component Details & Design Decisions

### 3.1 AI Provider Abstraction
To ensure demo reliability during live presentations, AI logic is encapsulated behind the `IAIProvider` interface in `server/src/services/ai/types.ts`:
- **`GeminiProvider`**: Utilizes Google Gemini 1.5 Flash API when `AI_API_KEY` is configured.
- **`DemoFallbackProvider`**: High-precision deterministic NLP pipeline analyzing keywords, language scripts (Devanagari, Telugu, Ol Chiki), entity recognition across 24 Jharkhand districts, and 64-dimensional normalized vector embeddings.
- **Honest Status Badges**: The UI explicitly discloses whether cloud LLM or deterministic fallback engine is active.

### 3.2 Semantic Deduplication Engine
When rural citizens submit reports with disparate phrasing (e.g., *"Bridge near village is broken"* vs *"The same bridge cannot be used after damage"*):
1. The text is normalized into English.
2. Normalized 64-D embeddings are generated.
3. Cosine similarity is computed against existing issues in the district.
4. If similarity $\ge 80\%$, the report is consolidated into a `ProblemCluster`, incrementing supporter count and affected population while preserving distinct photographic evidence.

### 3.3 Smart Matching Engine
The system ranks academic researchers and student engineering teams based on a transparent scoring model:
$$\text{MatchScore} = 0.55 \cdot \text{Sim} + 0.20 \cdot \text{Domain} + 0.10 \cdot \text{Keywords} + 0.10 \cdot \text{Dept} + 0.05 \cdot \text{PastExp}$$
Every match displays an explainable rationale (e.g. *"Skills in Bridge Inspection & AutoCAD align with Broken bridge"*).
