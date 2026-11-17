# Smart Campus Assistant 🎓
> **"Ask the campus. Get the official answer."**  
> Aarambhathon 2.0 — Theme: AI, Automation & Intelligent Systems

---

## 📌 Project Overview

Campus information is often scattered across paper notices, departmental circulars, complex handbooks, and fragmented social channels. Students repeatedly ask identical questions regarding examination registration, fees, attendance requirements, and venue locations.

The **Smart Campus Assistant** is a verified institutional query-and-action platform engineered to deliver authoritative, evidence-backed answers strictly from official university documents. 

### Core Architecture:
1. **RETRIEVE:** Matches student natural language queries against official campus handbooks, ordinances, fee schedules, and bylaws.
2. **VERIFY (75% Confidence Floor):** Generates responses strictly based on retrieved evidence and calculates an application-side evidence confidence score.
   - **Score $\ge 75\%$:** Renders official verified answer with exact citations (`Document Title`, `Clause/Section`, `Page Number`, `Quotation Excerpt`).
   - **Score $< 75\%$:** Does not guess or hallucinate. Automatically logs original wording and escalates to the **Staff Inbox**.
3. **ACT:** Immediately directs students to the exact next step:
   - 📄 **FORM:** Previews and downloads the relevant digital form.
   - 🌐 **PORTAL:** Direct single-click redirect to university ERP or payment gateway.
   - 🏢 **OFFICE:** Displays in-charge contact person, physical room number, phone extension, and office hours.
   - 🗺️ **MAP:** Highlights the target venue on the offline drawn campus plan.

---

## 🧭 Four-Page Student Navigation

In accordance with the project presentation (Slide 15), the student interface consists of **exactly four primary pages**:

1. **Home (`/`)**: Hero headline, search bar, project statistics (33 indexed documents, 6 mapped buildings, 75% confidence floor), 6 sample questions, and the 3-step explanation.
2. **Assistant (`/assistant`)**: AI query interface with live retrieval visualization, 75% floor check, official citation badges, and direct actions.
3. **Campus Map (`/map`)**: Custom-drawn, offline SVG architectural campus plan featuring 6 university blocks with venue search and dynamic highlighting. No external Google Maps API dependencies.
4. **My Questions (`/questions`)**: Private student history showing query timestamps, answer statuses (`VERIFIED`, `WAITING FOR STAFF`, `RESOLVED`), and full past citations.

### 🛡️ Protected Staff Dashboard (`/staff`)
Accessible separately via the **[Staff Portal]** button:
- **Overview:** Inquiry trends and system metrics.
- **Staff Inbox:** Low-confidence escalations below the 75% threshold.
- **Answer-Once Workflow (Slide 13):** When staff answers an escalated question once, it automatically resolves the student's ticket AND indexes the verified answer into the campus knowledge base, so future students receive instant cited responses.
- **Knowledge Base Manager:** Review, activate/deactivate, and ingest campus documents across 5 categories (*Examinations*, *Fees*, *Hostel*, *Academics*, *Directory*).
- **Staff Analytics:** Visual breakdown of inquiry volume and top-cited documents.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, JavaScript, Tailwind CSS
- **Backend:** Python, FastAPI, Uvicorn, Google Gemini API
- **Database & Auth:** Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Deployment:** Vercel (Frontend), Render / Railway / Docker (Backend)

---

## ⚡ Quick Start (Local Development)

### 1. Frontend Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd "Smart Campus Assistant"

# Install dependencies
npm install

# Start local frontend dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 2. Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Copy and run the contents of [`supabase/schema.sql`](file:///c:/Users/Dell/Desktop/New%20folder%20(2)/supabase/schema.sql) to create tables, indexes, and Row Level Security policies.
4. Copy and run [`supabase/seed.sql`](file:///c:/Users/Dell/Desktop/New%20folder%20(2)/supabase/seed.sql) to populate the 33 campus documents, 6 demo buildings, and action registry.
5. Create `.env` in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   VITE_API_BASE_URL=http://localhost:8000
   ```

---

### 3. Python FastAPI Backend & Gemini API Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Create backend/.env file
cp .env.example .env
```

Configure `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=8000
```

Start the FastAPI backend:
```bash
uvicorn backend.main:app --reload --port 8000
```
Interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🚀 Production Deployment

### Frontend (Vercel)
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `VITE_API_BASE_URL`: URL of your deployed Python backend
4. Deploy! The included [`vercel.json`](file:///c:/Users/Dell/Desktop/New%20folder%20(2)/vercel.json) handles client-side routing automatically.

### Backend (Render / Railway / Fly.io)
Deploy the `backend/` folder using the included [`backend/Dockerfile`](file:///c:/Users/Dell/Desktop/New%20folder%20(2)/backend/Dockerfile) or [`backend/Procfile`](file:///c:/Users/Dell/Desktop/New%20folder%20(2)/backend/Procfile). Set `GEMINI_API_KEY` and `SUPABASE_URL` in the hosting environment variables.
