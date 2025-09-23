# SenseAI - AI-Powered Business Intelligence Platform

## 🚀 Problem Statement

In today's fast-paced business environment, investors, analysts, and entrepreneurs struggle with:

- **Fragmented Information**: Company data scattered across multiple sources
- **Time-Consuming Analysis**: Manual research taking hours or days
- **Lack of Real-Time Insights**: Outdated information leading to poor decisions
- **Complex Data Processing**: Difficulty analyzing multimedia content (videos, PDFs, presentations)
- **Inconsistent Scoring**: No standardized way to evaluate company potential

## 💡 Solution

SenseAI is a comprehensive AI-powered business intelligence platform that leverages Google's Gemini AI to provide:

- **Unified Company Profiles**: Automated extraction and analysis of company data
- **Multimodal AI Analysis**: Process text, video, audio, and PDF content
- **Real-Time Intelligence**: Up-to-date company information with caching
- **Intelligent Chat Interface**: Ask questions about any company using natural language
- **Proprietary SenseAI Score**: AI-driven company evaluation and scoring
- **Competitor Analysis**: Comprehensive competitive landscape insights

## ✨ Key Features

### 🏢 Company Intelligence

- **Automated Data Extraction**: Pull comprehensive company information from multiple sources
- **Financial Analysis**: Funding rounds, valuations, revenue insights
- **Team & Leadership**: Key personnel and organizational structure
- **Market Position**: Industry analysis and competitive landscape

### 🤖 AI-Powered Chat

- **Context-Aware Conversations**: Chat about specific companies with full data context
- **Multimodal Support**: Upload and analyze documents, videos, presentations
- **Real-Time Responses**: Powered by Google Gemini 2.5 Flash/Pro models
- **File Processing**: Support for PDF, video, audio, and text files

### 📊 Advanced Analytics

- **Pitch Deck Analysis**: AI-powered analysis of startup presentations
- **Transcript Processing**: Convert and analyze video/audio content
- **Competitor Scoring**: Comprehensive competitive analysis with scoring
- **Market Intelligence**: Industry trends and insights

### 🔄 Smart Caching

- **Firebase Integration**: Persistent data storage and caching
- **Freshness Management**: Automatic data refresh when information becomes stale
- **Performance Optimization**: Fast retrieval of previously analyzed companies

## 🛠 Technology Stack

### Frontend (UI)

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: JavaScript (React 19.1.0)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **AI Integration**: AI SDK (@ai-sdk/google, @ai-sdk/react)
- **Icons**: Lucide React

### Backend (API Services)

- **Primary API**: FastAPI (Python 3.11+)
- **AI Models**: Google Gemini 2.5 Flash/Pro
- **File Processing**: PyMuPDF, librosa, yt-dlp
- **Video/Audio**: Transcription and analysis capabilities

### AI Agents

- **Framework**: LangChain + LangGraph
- **Agent System**: Multi-agent company research system
- **Database**: Firebase Firestore
- **Caching**: Intelligent data freshness management

### Key Dependencies

```json
{
  "frontend": {
    "next": "15.5.3",
    "react": "19.1.0",
    "@ai-sdk/google": "^2.0.14",
    "@ai-sdk/react": "^2.0.44",
    "ai": "^5.0.44"
  },
  "backend": {
    "fastapi": "0.116.2",
    "google-generativeai": "0.8.5",
    "PyMuPDF": "1.26.4",
    "librosa": "0.11.0",
    "yt-dlp": "2025.9.5"
  },
  "agents": {
    "langchain-core": "0.3.74",
    "langgraph": "0.6.5",
    "firebase-admin": "latest"
  }
}
```

## 📁 Project Structure

```
senseai/
├── ui/                          # Next.js Frontend
│   ├── app/
│   │   ├── api/                # API routes
│   │   │   ├── chat/          # General chat endpoint
│   │   │   └── company-chat/  # Company-specific chat
│   │   ├── chat/              # Chat interface
│   │   ├── dashboard/         # Company dashboard
│   │   └── page.js           # Landing page
│   ├── components/
│   │   ├── ai-elements/      # AI chat components
│   │   └── ui/               # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   └── package.json
│
├── backend/                    # FastAPI Backend
│   ├── main.py               # Main FastAPI application
│   ├── modules/
│   │   ├── pitch_deck_analysis.py
│   │   ├── transcript_analysis.py
│   │   ├── transcribe_generator.py
│   │   └── video_transcribe.py
│   └── requirements.txt
│
└── agents/                    # AI Agent System
    ├── app.py                # Main agent application
    ├── appv2.py             # Enhanced agent features
    ├── research_agent/      # Company research agents
    └── requirements.txt
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: 18.0 or higher
- **Python**: 3.11 or higher
- **Google API Key**: For Gemini AI access
- **Firebase**: For data persistence (optional)

### 1. Frontend Setup

```bash
cd ui
npm install

# Create environment file
cat > .env.local << EOF
GOOGLE_API_KEY=your_google_api_key_here
EOF

# Start development server
npm run dev
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create environment file
cat > .env << EOF
GOOGLE_API_KEY=your_google_api_key_here
EOF

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 5006 --reload
```

### 3. AI Agents Setup

```bash
cd agents
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Add Firebase credentials (if using caching)
# Place your Firebase service account key as:
# ai-agent-company-data-firebase-adminsdk-creds.json

# Start agents server
python appv2.py
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)

```bash
GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:5006
NEXT_PUBLIC_AGENTS_URL=http://localhost:5005
```

#### Backend (.env)

```bash
GOOGLE_API_KEY=your_google_api_key_here
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Agents (.env)

```bash
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_APPLICATION_CREDENTIALS=ai-agent-company-data-firebase-adminsdk-creds.json
```

### Firebase Setup (Optional)

1. Create a Firebase project
2. Enable Firestore database
3. Generate service account credentials
4. Place credentials file in the agents directory

## 📖 API Documentation

### Backend Endpoints

#### Transcript Analysis

```bash
POST /analyze-text/
Content-Type: application/json
{
  "transcript": "Your transcript text here"
}
```

#### File Upload Analysis

```bash
POST /analyze-file/
Content-Type: multipart/form-data
file: transcript.txt
```

#### Video/Audio Processing

```bash
POST /transcribe-video/
Content-Type: multipart/form-data
file: video.mp4
# OR
youtube_url: https://youtube.com/watch?v=...
```

### Agents API Endpoints

#### Company Extraction

```bash
POST /extract
Content-Type: application/json
{
  "company_name": "OpenAI"
}
```

#### Competitor Analysis

```bash
POST /competitors
Content-Type: application/json
{
  "company_name": "OpenAI"
}
```

## 🎯 Usage Examples

### 1. Analyze a Company

```javascript
// Frontend usage
const response = await fetch("/api/company-extract", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ company_name: "OpenAI" }),
});
const companyData = await response.json();
```

### 2. Chat About Company Data

```javascript
import { useChat } from "@ai-sdk/react";

const { messages, sendMessage } = useChat({
  api: "/api/company-chat",
  body: { companyData: yourCompanyData },
});

sendMessage({
  role: "user",
  parts: [{ type: "text", text: "What is the company valuation?" }],
});
```

### 3. Process Pitch Deck

```bash
curl -X POST "http://localhost:5006/analyze-pitch-deck/" \
  -F "file=@pitch_deck.pdf"
```

## 🔍 Features Deep Dive

### SenseAI Score Algorithm

The proprietary scoring system evaluates companies based on:

- **Financial Health**: Revenue, funding, burn rate
- **Market Position**: Competition, market size, differentiation
- **Team Strength**: Leadership experience, team composition
- **Growth Trajectory**: User adoption, revenue growth, expansion
- **Technology Innovation**: IP, technical differentiation

### Multimodal Processing

- **PDFs**: Extract and analyze pitch decks, reports
- **Videos**: Transcribe and analyze presentation content
- **Audio**: Convert speeches, calls to insights
- **Text**: Process reports, articles, transcripts

### Intelligent Caching

- **7-day freshness**: Data refreshed automatically after 7 days
- **Performance optimization**: Sub-second retrieval for cached data
- **Selective updates**: Only fetch new information when needed

## 🚀 Deployment

### Production Environment

```bash
# Frontend (Vercel recommended)
npm run build
npm start

# Backend (Docker)
FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Agents (Cloud Run recommended)
FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "appv2.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Google Gemini AI, Next.js, and FastAPI**
