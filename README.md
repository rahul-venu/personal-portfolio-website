# Personal Engineering Portfolio & Agentic RAG Platform

[![Live Portfolio](https://img.shields.io/badge/Live-Portfolio-000000.svg?style=flat&logo=vercel)](https://rahulvenu.vercel.app/)
[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Vector DB - ChromaDB](https://img.shields.io/badge/Vector%20DB-ChromaDB-blue.svg)](https://www.trychroma.com/)
[![LLM - Groq LPU](https://img.shields.io/badge/LLM-Groq%20LPU%20(gpt--oss--20b)-green.svg)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A decoupled, production-grade personal portfolio engineered for a **Data Scientist & Generative AI Engineer**, featuring custom 3D neural voxel simulations, an in-memory RAG-powered digital twin ("Zoe"), and a gradient-descent mathematical verification system.

---

## 🏗 Architecture Overview

The system is architected as two decoupled, independently deployable modules:

```
                ┌────────────────────────────────────────────────────────┐
                │                   CLIENT APPLICATION                   │
                │   (Vercel Global Edge CDN • Native JS Modules & CSS)   │
                └──────────────┬──────────────────────────┬──────────────┘
                               │                          │
                            (1) Contact Form           (2) Chatbot API
                            (Anti-Spam Pipeline)       (Conversational RAG)
                               │                          │
                               ▼                          ▼
                    ┌──────────────────────────┐    ┌───────────────────────────────────┐
                    │     Web3Forms Service    │    │       FASTAPI BACKEND SERVICE     │
                    │  - Honeypot Trap         │    │       (Render Cloud Container)    │
                    │  - Real-Time Google DNS  │    ├───────────────────────────────────┤
                    │  - Temp-Mail Blocker     │    │ • ChromaDB (In-Memory Vector DB)  │
                    └──────────────────────────┘    │ • Micro-Chunking (<200 tokens)    │
                                                    │ • Query Contextualizer (Memory)   │
                                                    └─────────────────┬─────────────────┘
                                                                      │
                                                               (3) Low-Latency
                                                            Inference (~1000 tps)
                                                                      │
                                                                      ▼
                                                          ┌───────────────────────┐
                                                          │       Groq LPU        │
                                                          │  (openai/gpt-oss-20b) │
                                                          └───────────────────────┘

 ```       

## ✨ Core Engineering Features

1. Conversational RAG Digital Assistant ("Zoe")
In-Memory Vector Search: ChromaDB indexes knowledge base sections into micro-chunks (<200 tokens) using the all-MiniLM-L6-v2 embedding model at startup.
Conversational Memory: Preserves multi-turn conversation history in-memory and enriches contextual pronouns ("it", "that") using sliding query windows.
Strict Anti-Hallucination Guardrails: Low-temperature inference (temperature=0.3) anchored against retrieved context with deterministic fallback handlers and automatic sentence-snapping.
Live Markdown Parser: Client-side engine rendering raw URLs, emails, bold, italics, and custom bullet arrays into interactive HTML.
2. Machine Learning-Themed Loss Minimization Captcha
Interactive Optimization: Users slide an interactive optimizer puck to minimize an active loss function from 0.892 to convergence (0.009), unlocking the submit trigger.
Real-Time DNS/MX Filtering: Queries Google DNS-over-HTTPS (8.8.8.8) to reject invalid domains, disposable burner addresses, and automated bots before hitting the mail service.
3. Procedural 3D Neural Manifold
An interactive HTML5 canvas simulating a 3D asymmetric topological manifold (3,200 particle voxels).
Features physics-based mouse disturbance, 4-tier staggered elastic spring-back dynamics, dynamic depth sorting, and real-time synaptic electric arcs.
4. Obsidian Dark Theme
Pure pitch-black canvas (#000000) paired with matte charcoal alternating section bands (#141416) and deep obsidian cards (#0a0a0d).
Cascading staggered reveals, mechanical rotary odometer title counters, and single-pass horizontal AI token shimmer waves.

## 📁 Repository Structure
```
portfolio-web/
├── assets/
│   └── images/                 # Favicons, avatars, and visual assets  
│
├── css/
│   ├── chatbot.css             # Chatbot drawer, bubbles, and animations
│   ├── cursor.css              # Custom interactive concentric cursor
│   └── style.css               # Global obsidian theme, 3D lights, & transitions
│
├── js/
│   ├── animations.js           # IntersectionObserver scroll trigger manager
│   ├── bike-anim.js            # Interactive vector scooter path & smoke emitter
│   ├── chatbot.js              # Chat state manager, multi-turn history, markdown parser
│   ├── cursor.js               # Smooth lerp-following cursor tracker
│   ├── main.js                 # Global application orchestrator & click-to-copy handler
│   ├── neural.js               # 3D procedural particle manifold engine
│   ├── rotary.js               # Mechanical odometer slot-machine reel animation
│   └── verification.js         # Gradient descent loss slider & real-time DNS validator
│
├── backend/
│   ├── data/
│   │   ├── rahul_profile.example.md  # Public template for RAG vectorization
│   │   └── rahul_profile.md          # [Ignored by Git] Private knowledge base
|   |
│   ├── .env.example            # Environment template for API keys
│   ├── .gitignore              # Python/venv cache & secret exclusions
│   ├── main.py                 # FastAPI application, CORS, and Groq inference routes
│   ├── pyproject.toml          # PEP 621 dependency specifications (uv-managed)
│   ├── rag_engine.py           # In-memory ChromaDB vectorizer, chunker, & retrieval
│   ├── requirements.txt        # Production pip dependency manifest for Render
│   └── uv.lock                 # Deterministic dependency resolution lockfile
│
├── index.html                  # Accessible, responsive semantic SPA markup
├── LICENSE                     # MIT License
└── README.md                   # System documentation
```

## 🛠 Tech Stack

Layer	Technologies
Frontend UI	HTML5, Tailwind CSS, Lucide Icons, Vanilla ES6+ Modules
Visual Computing	HTML5 Canvas API, 3D Projection Math, CSS Transforms
Backend API	Python 3.10+, FastAPI, Uvicorn, Pydantic v2
Vector Engine	ChromaDB (In-Memory Ephemeral Engine), all-MiniLM-L6-v2
LLM Inference	Groq LPU (openai/gpt-oss-20b), Low-Latency RAG
Package Management	uv (Astral), Pip
Deployment	Vercel (Frontend Global Edge), Render (Backend Container)

## 🚀 Local Development Setup

### 1. Prerequisites
Python 3.10+
uv (recommended) or pip
A free Groq API Key

### 2. Backend Setup

```
# Navigate to backend
cd backend

# Copy environment variables
cp .env.example .env

# Add your Groq API Key inside .env:
# GROQ_API_KEY="gsk_your_key_here"

# Install dependencies and sync environment
uv sync

# Run the backend development server
uv run uvicorn main:app --reload
```

The RAG API will initialize and index chunks in RAM at http://127.0.0.1:8000.

### 3. Frontend Setup
Open index.html using Live Server in VS Code, or launch a simple local HTTP server:
```
# From project root
python -m http.server 5500
```

Visit http://localhost:5500 to interact with the full experience.

## 🔒 Security & Privacy Architecture

Zero-Leak Profile Ingestion: Private knowledge base data (rahul_profile.md) is excluded from version control via .gitignore. Cloud deployments ingest knowledge base vectors via an encrypted base64 environment variable (PROFILE_MD_BASE64).
Honeypot Shield: Contact forms implement hidden field traps that drop automated bot requests before reaching backend queues.
Domain DNS Validation: Pre-validates email sender MX records over Google's 8.8.8.8 DNS endpoints to eliminate disposable burner mail networks.

## 📜 License

Distributed under the MIT License. See LICENSE for details.
                      