# GramUtthan — Hackathon Jury Demo Script (18-Step Walkthrough)
**Problem Statement:** SIH26043 — Government of Jharkhand  
**Scenario Duration:** ~3 to 4 Minutes  

---

### Prerequisites
1. Ensure both server (`http://localhost:5000`) and client (`http://localhost:5173`) are running.
2. Open `http://localhost:5173` in Google Chrome or Microsoft Edge.
3. Notice the **"Hackathon Jury Demo Mode"** quick-switcher bar pinned at the very top of every page.

---

### Step-by-Step Execution Sequence

#### Step 1: Login as Citizen
- Look at the top bar labeled **"Try Live Role As:"**
- Click the **Citizen** button (or sign in with `citizen@demo.com` / `Demo@123`).
- You are now logged in as **Birsa Munda (Citizen)** from Ranchi.

#### Step 2: Open "Report a Problem"
- Click **"Report Problem"** in the main navigation bar or the green **"Report a Problem"** hero button.

#### Step 3: Choose Telugu / Hindi / Local Language
- In the top navigation bar, open the Language dropdown (Globe icon) and choose **हिन्दी (Hindi)**, **తెలుగు (Telugu)**, or **ᱥᱟᱱᱛᱟᱲᱤ (Santhali)**.
- Notice the UI labels immediately adapt.

#### Step 4: Use Camera to Capture a Photo
- Under **Visual Proof / Camera Capture**, click **"Start Camera Viewfinder"**.
- Allow camera permissions in the browser to view the real-time webcam/phone video feed.
- Click **"Snap Photo"** (or click **"Upload File Fallback"** if no physical webcam is connected).
- Notice the captured photo is attached with a green badge. Click **"Retake Photo"** to verify the retake workflow.

#### Step 5: Enter or Speak a Problem
- In the **Demo Preset** toolbar above the form, click **"हिन्दी पुल"** (or type manually):
  > *"हमारे गाँव के पास का पुल टूट गया है और बच्चे सुरक्षित रूप से पार नहीं कर सकते।"*
- Or in English:
  > *"The bridge near our village has been damaged and children cannot safely cross it."*
- Optionally tap the **"Tap to Speak (Voice Input)"** microphone button to dictate.

#### Step 6: Submit the Report
- Click the green **"Submit Problem Report"** button.

#### Step 7: Inspect AI Processing Results
- Watch the instant AI card render:
  - **Detected Language:** `हिन्दी (Hindi)` / `English` (96%+ confidence).
  - **Normalized English Translation:** *"The bridge near our village has been damaged and children cannot safely cross it."*
  - **Classified Category:** `Broken bridge`
  - **Assessed Severity:** `HIGH`
  - **Affected Population:** `~450 citizens`
  - **Recommended Domains:** `Civil Engineering`, `Structural Engineering`
  - **Honest Status Badge:** `Deterministic SIH Engine` / `Gemini Cloud LLM`.

#### Step 8 & 9: Semantic Deduplication Cluster Alert
- Scroll to the amber alert box:
  > **"Likely same issue — 94% similarity with existing cluster: Damaged Wooden-Concrete Bridge over Subarnarekha Tributary."**
- The system shows that 7 existing citizen complaints in Angara have been consolidated rather than duplicating the ticket!
- Click **"View Details & Smart Matches"**.

#### Step 10: Switch to Student Account
- In the top demo switcher bar, click **"Student"** (Aarav Sharma — Pre-final Civil Engineering at BIT Mesra).

#### Step 11: Inspect "Recommended for You" AI Matching
- Navigate to **"Projects & Matching"** (`/student`).
- Highlight the blue banner: **"Recommended For You — AI Match: 94%"**.
- Explain to the jury: The system proactively matched the broken culvert bridge to Aarav because his academic profile is Civil Engineering at BIT Mesra.

#### Step 12: Claim Problem
- Click on the recommended bridge problem.
- Scroll down to the Smart University Matching box showing the transparent formula:
  $$\text{MatchScore} = 0.55 \cdot \text{sem} + 0.20 \cdot \text{dom} + 0.10 \cdot \text{kw} + 0.10 \cdot \text{dept} + 0.05 \cdot \text{exp}$$
- Click **"Claim Problem & Form Team"**.

#### Step 13: Create Project / Team
- In the claim modal, enter project title:
  > *"Pre-stressed Modular Culvert Bridge for Angara Village Stream"*
- Click **"Confirm Claim & Launch"**.
- The student is redirected directly to the dedicated **Project Workspace** (`/workspace/:id`).

#### Step 14: Upload Milestone with Evidence
- Click **"Upload Milestone Evidence"**.
- Enter title: *"Structural assessment completed & Concrete Specimen Testing"*.
- Note: *"7-day compression tests on fly-ash blended concrete blocks showed 32 MPa strength."*
- Click **"Submit to Authority (+30 Pts)"**.
- Notice the milestone appears in `SUBMITTED` state.

#### Step 15: Switch to Evaluator & Verify Milestone
- In the top demo bar, click **"Evaluator"** (Pooja Soren — District Evaluator, Govt of Jharkhand).
- Navigate to **"Authority Verifier"** (`/evaluator`).
- Under **Project Milestone & Final Verification Queue**, locate Aarav Sharma's project.
- Click **"Verify Milestone (+30 Pts)"**.
- The milestone changes to `Verified by Authority` with green checkmark.

#### Step 16: Mark Project VERIFIED
- In the same evaluator dashboard, click **"Mark Project VERIFIED (+100 Pts)"**.
- The project status updates to `VERIFIED`, and the rural problem is marked `RESOLVED`.

#### Step 17: Show Impact Dashboard & GIS Map
- Click **"Explore Map & Problems"** (`/explore`).
- Filter by district **"Ranchi"** or severity **"High"**.
- Click the pin at Hesal/Angara to see the resolved and consolidated status.
- Switch to the **Admin** role (`/admin`) to show the state telemetry:
  - Active vs. Resolved problems
  - Problems by district and category
  - Operational health of the AI Vector engine.

#### Step 18: Show University Leaderboard & Rewards
- Click **"Leaderboard"** in the navigation bar.
- Point out **BIT Mesra** holding #1 position with 1,240+ impact points, followed by IIT (ISM) Dhanbad and NIT Jamshedpur!
- Conclude: *"In under 4 minutes, GramUtthan took a raw village complaint in a local dialect, translated it, eliminated duplicate noise with vector math, mobilized an engineering team, verified the field deliverable, and closed the loop with state honors."*
