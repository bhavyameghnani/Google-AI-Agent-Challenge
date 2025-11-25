# SenseAI - Complete Setup Guide

This guide explains each service, how to start the entire system locally, and required environment variables.

---

## 📁 Project Structure Overview

### 1. **`backend/`** - Multimodal Founder Data Analyzer API

**Purpose:** FastAPI service that analyzes pitch decks (PDFs), video/audio files, and transcripts using Google Gemini.

**What it does:**

- Converts PDF pitch decks to images and extracts structured data (Problem, Solution, Team, Market, etc.)
- Transcribes audio/video files (including YouTube URLs) to text
- Analyzes transcripts to extract company information, founders, funding, market data
- Generates embeddings for semantic search
- Outputs structured JSON and Markdown reports

**Key Endpoints:**

- `POST /analyze-pitch-deck/` - Analyze PDF pitch decks
- `POST /analyze-video/` - Analyze video files or YouTube URLs
- `POST /analyze-audio/` - Analyze audio files
- `POST /analyze-text/` - Analyze text transcripts
- `POST /analyze-file/` - Analyze text files

**Port:** Default `8000` (set via `PORT` env var)

---

### 2. **`agents/`** - Company Research & Analysis Agents

**Purpose:** Main API service using Google ADK (Agent Development Kit) for comprehensive company research, competitor analysis, fact-checking, and evaluation scoring.

**What it does:**

- **Research Agent:** Extracts comprehensive company profiles with citations (financial data, leadership, market position, reputation)
- **Competitor Analysis Agent:** Finds and analyzes competitors with scoring
- **Fact Check Agent:** Verifies claims from PDFs/documents against web sources
- **Evaluation Score Agent:** Calculates 4-dimensional SenseAI scores (Revenue Growth, Financial Strength, Industry Health, Founder Background)
- Stores results in Firebase Firestore with caching

**Key Endpoints:**

- `POST /extract` - Extract company data with citations
- `POST /competitor-analysis` - Analyze competitors
- `POST /fact-check` - Fact-check PDF documents
- `GET /companies` - List all cached companies
- `GET /company/{company_name}` - Get cached company data
- `GET /stats` - Get database statistics

**Port:** Default `8080` (set via `PORT` env var)

---

### 3. **`document_upload_service/`** - Firebase File Storage Service

**Purpose:** FastAPI service for uploading, storing, and retrieving files (podcasts, newsletters, reports) from Firebase Storage.

**What it does:**

- Uploads audio files (English/Hindi), markdown reports, and PDFs
- Stores metadata in Firestore
- Provides download/stream endpoints with Range request support for audio playback
- CRUD operations for records

**Key Endpoints:**

- `POST /records` - Upload new record (audio files + reports)
- `GET /records` - List all records
- `GET /records/{record_id}` - Get specific record
- `PUT /records/{record_id}` - Update record
- `DELETE /records/{record_id}` - Delete record
- `GET /records/{record_id}/stream/{key}` - Stream audio files

**Port:** Default `8080` (set via `PORT` env var)

---

### 4. **`newsletter_podcast_generator/`** - Newsletter & Podcast Generator

**Purpose:** Generates investment-grade startup analysis podcasts and sector newsletters using ADK agents, with bilingual audio (English + Hindi).

**What it does:**

- Generates startup analysis podcasts from company names or PDFs
- Creates sector newsletters for 13+ sectors (Fintech, SaaS, E-commerce, etc.)
- Produces bilingual audio files (English + Hindi) using text-to-speech
- Uploads generated content to Firebase
- Uses ADK agents for research and content generation

**Key Endpoints:**

- `POST /analyze-startup` - Generate startup analysis podcast
- `POST /generate-newsletter` - Generate sector newsletter
- `POST /analyze-from-pdf` - Analyze PDF and generate podcast
- `GET /sectors` - List available sectors
- `GET /analysis-list` - List all generated sessions
- `GET /firebase-records` - List Firebase records

**Port:** Default `8080` (set via `PORT` env var)

---

### 5. **`ui/`** - Next.js Frontend Application

**Purpose:** React/Next.js web application providing the user interface for all services.

**What it does:**

- Company dashboard with research results
- Pitch deck analyzer interface
- Fact-checking results viewer
- Podcast/newsletter generator UI
- Company chat interface
- Verification/editing interface

**Port:** Default `3000` (Next.js default)

---

## 📊 Service Comparison & UI Mapping

### Service Differences: `backend/` vs `document_upload_service/`

| Aspect              | `backend/`                                               | `document_upload_service/`         |
| ------------------- | -------------------------------------------------------- | ---------------------------------- |
| **Primary Purpose** | AI-powered analysis of founder materials                 | File storage and retrieval         |
| **Technology**      | Google Gemini (multimodal AI), PyMuPDF, librosa          | Firebase Storage, Firestore        |
| **Processing**      | Analyzes PDFs, videos, audio, transcripts                | Stores and serves files            |
| **AI Features**     | ✅ Yes - Extracts structured data, transcribes, analyzes | ❌ No - Pure file management       |
| **Output**          | Structured JSON/Markdown reports, embeddings             | File URLs, metadata                |
| **Use Case**        | "What does this pitch deck say?"                         | "Where is my podcast file stored?" |
| **Data Flow**       | Input → AI Processing → Structured Output                | Upload → Storage → Retrieve        |

**Key Difference:**

- `backend/` = **AI Analysis Engine** (processes content with Gemini)
- `document_upload_service/` = **File Storage Service** (manages file uploads/downloads)

---

### UI Pages and Service Mapping

| UI Page                         | Service(s) Used                                              | Purpose                                        | Key Endpoints                                                                                                      |
| ------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/founder-data-analyzer`        | `backend/` + `agents/`                                       | Analyze pitch decks, videos, audio; fact-check | `POST /analyze-pitch-deck/`, `POST /analyze-video/`, `POST /analyze-audio/`, `POST /fact-check`                    |
| `/dashboard`                    | `agents/`                                                    | Company research, competitor analysis          | `POST /extract`, `POST /competitor-analysis`, `GET /companies`                                                     |
| `/podcast`                      | `document_upload_service/`                                   | List all podcast records                       | `GET /records`                                                                                                     |
| `/podcast/[id]`                 | `document_upload_service/`                                   | View/play specific podcast                     | `GET /records/{id}`, `GET /records/{id}/stream/{key}`                                                              |
| `/newsletter-podcast-generator` | `document_upload_service/` + `newsletter_podcast_generator/` | Generate podcasts/newsletters, manage files    | `POST /records`, `POST /analyze-startup`, `POST /generate-newsletter`, `PUT /records/{id}`, `DELETE /records/{id}` |
| `/verification`                 | `agents/`                                                    | Edit/verify company data                       | `POST /verified_company_data`, `GET /raw_companies`                                                                |
| `/chat`                         | `agents/`                                                    | Company chat interface                         | Chat endpoints                                                                                                     |

---

### Complete Service Architecture Summary

| Service                         | Port | Technology               | Primary Function                      | Used By UI Pages                                                 |
| ------------------------------- | ---- | ------------------------ | ------------------------------------- | ---------------------------------------------------------------- |
| `backend/`                      | 8000 | Gemini, PyMuPDF, librosa | Multimodal analysis (PDF/video/audio) | `/founder-data-analyzer`                                         |
| `agents/`                       | 8080 | Google ADK, Firebase     | Company research, fact-check, scoring | `/dashboard`, `/founder-data-analyzer`, `/verification`, `/chat` |
| `document_upload_service/`      | 8081 | Firebase Storage         | File storage/retrieval                | `/podcast`, `/podcast/[id]`, `/newsletter-podcast-generator`     |
| `newsletter_podcast_generator/` | 5007 | Google ADK, Firebase     | Generate podcasts/newsletters         | `/newsletter-podcast-generator`                                  |
| `ui/`                           | 3000 | Next.js, React           | Frontend interface                    | All pages                                                        |

---

## 🚀 How to Start Everything Locally

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- Firebase account (for storage features)
- Google Cloud account with API keys

### Step 1: Clone and Navigate

```bash
cd Google-AI-Agent-Challenge
```

### Step 2: Set Up Backend Service

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Create `backend/.env`:**

```env
GOOGLE_API_KEY=your_google_api_key_here
PORT=8000
```

**Start backend:**

```bash
python main.py
# Or: uvicorn main:app --host 0.0.0.0 --port 8000
```

---

### Step 3: Set Up Agents Service

```bash
cd ../agents
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Create `agents/.env`:**

```env
GOOGLE_API_KEY=your_google_api_key_here
LOCAL_RUN=true
PORT=8080
```

**Place Firebase credentials:**

- Copy `ai-agent-company-data-firebase-adminsdk-creds.json` to `agents/` folder
- Or set `GOOGLE_APPLICATION_CREDENTIALS` env var pointing to your Firebase service account JSON

**Start agents service:**

```bash
python main.py
# Or: uvicorn main:app --host 0.0.0.0 --port 8080
```

---

### Step 4: Set Up Document Upload Service

```bash
cd ../document_upload_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Create `document_upload_service/.env`:**

```env
LOCAL_RUN=true
PORT=8081
STORAGE_BUCKET=senseai-podcast.firebasestorage.app
```

**Place Firebase credentials:**

- Copy `serviceAccountKey.json` to `document_upload_service/` folder

**Start document upload service:**

```bash
python main.py
# Or: uvicorn main:app --host 0.0.0.0 --port 8081
```

---

### Step 5: Set Up Newsletter/Podcast Generator

```bash
cd ../newsletter_podcast_generator
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Create `newsletter_podcast_generator/.env`:**

```env
GOOGLE_API_KEY=your_google_api_key_here
LOCAL_RUN=true
PORT=5007
STORAGE_BUCKET=senseai-podcast.firebasestorage.app
```

**Place Firebase credentials:**

- Copy `serviceAccountKey.json` to `newsletter_podcast_generator/` folder

**Start newsletter generator:**

```bash
python main.py
# Or: uvicorn main:app --host 0.0.0.0 --port 5007
```

---

### Step 6: Set Up Frontend (UI)

```bash
cd ../ui
npm install
```

**Create `ui/.env.local`:**

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_PITCH_URL=http://localhost:8000
NEXT_PUBLIC_RECORDS_API=http://localhost:8081
NEXT_PUBLIC_LVX_API=http://localhost:5007
```

**Start frontend:**

```bash
npm run dev
```

---

## 🔑 Environment Variables Summary

### `backend/.env`

```env
GOOGLE_API_KEY=your_google_api_key_here
PORT=8000
```

### `agents/.env`

```env
GOOGLE_API_KEY=your_google_api_key_here
LOCAL_RUN=true
PORT=8080
GOOGLE_APPLICATION_CREDENTIALS=./ai-agent-company-data-firebase-adminsdk-creds.json
```

### `document_upload_service/.env`

```env
LOCAL_RUN=true
PORT=8081
STORAGE_BUCKET=senseai-podcast.firebasestorage.app
```

### `newsletter_podcast_generator/.env`

```env
GOOGLE_API_KEY=your_google_api_key_here
LOCAL_RUN=true
PORT=5007
STORAGE_BUCKET=senseai-podcast.firebasestorage.app
```

### `ui/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_PITCH_URL=http://localhost:8000
NEXT_PUBLIC_RECORDS_API=http://localhost:8081
NEXT_PUBLIC_LVX_API=http://localhost:5007
```

---

## 🎯 Quick Start Script

Create a `start_all.sh` script to start all services:

```bash
#!/bin/bash

# Start Backend (Port 8000)
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!

# Start Agents (Port 8080)
cd ../agents
source venv/bin/activate
python main.py &
AGENTS_PID=$!

# Start Document Upload (Port 8081)
cd ../document_upload_service
source venv/bin/activate
python main.py &
UPLOAD_PID=$!

# Start Newsletter Generator (Port 5007)
cd ../newsletter_podcast_generator
source venv/bin/activate
python main.py &
NEWSLETTER_PID=$!

# Start Frontend (Port 3000)
cd ../ui
npm run dev &
UI_PID=$!

echo "All services started!"
echo "Backend: http://localhost:8000"
echo "Agents: http://localhost:8080"
echo "Upload Service: http://localhost:8081"
echo "Newsletter Generator: http://localhost:5007"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $BACKEND_PID $AGENTS_PID $UPLOAD_PID $NEWSLETTER_PID $UI_PID; exit" INT
wait
```

Make it executable:

```bash
chmod +x start_all.sh
./start_all.sh
```

---

## 📋 Service Ports Summary

| Service                  | Port | URL                   |
| ------------------------ | ---- | --------------------- |
| Backend (Pitch Analyzer) | 8000 | http://localhost:8000 |
| Agents (Research API)    | 8080 | http://localhost:8080 |
| Document Upload Service  | 8081 | http://localhost:8081 |
| Newsletter Generator     | 5007 | http://localhost:5007 |
| Frontend (UI)            | 3000 | http://localhost:3000 |

---

## 🔧 Additional Setup Notes

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Firebase Storage
4. Generate service account key (JSON) from Project Settings > Service Accounts
5. Place the JSON file in respective service folders

### Google API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Enable required APIs:
   - Generative Language API
   - Google Search API (for ADK agents)

### Dependencies

- **ffmpeg**: Required for video/audio processing (install via `brew install ffmpeg` on macOS)
- **Python 3.11+**: Required for all Python services
- **Node.js 18+**: Required for frontend

---

## 🐛 Troubleshooting

### Port Already in Use

Change the `PORT` environment variable in the respective `.env` file.

### Firebase Connection Issues

- Ensure `LOCAL_RUN=true` is set for local development
- Verify service account JSON file path is correct
- Check Firebase project permissions

### Missing Dependencies

- Run `pip install -r requirements.txt` in each Python service folder
- Run `npm install` in the `ui/` folder

### API Key Issues

- Verify `GOOGLE_API_KEY` is set in all `.env` files
- Check API key has required permissions enabled

---

## 📚 API Documentation

Once services are running, visit:

- Backend API docs: http://localhost:8000/docs
- Agents API docs: http://localhost:8080/docs
- Upload Service docs: http://localhost:8081/docs
- Newsletter Generator docs: http://localhost:5007/docs

---

## ✅ Verification Checklist

- [ ] All Python virtual environments created and activated
- [ ] All `.env` files created with correct values
- [ ] Firebase credentials placed in correct folders
- [ ] All services start without errors
- [ ] Frontend connects to all backend services
- [ ] API documentation accessible at `/docs` endpoints

---

**Happy Coding! 🚀**
