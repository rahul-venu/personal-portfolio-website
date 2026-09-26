# Personal Portfolio Website feat: a RAG-powered AI Assistant ("Zoe") 

[![Live Portfolio](https://img.shields.io/badge/Live-Portfolio-8B5CF6.svg?style=flat&logo=vercel&logoColor=white)](https://rahulvenu.vercel.app/)
[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Vector DB - ChromaDB](https://img.shields.io/badge/Vector%20DB-ChromaDB-blue.svg)](https://www.trychroma.com/)
[![LLM - Groq LPU](https://img.shields.io/badge/LLM-Groq%20LPU%20(gpt--oss--20b)-green.svg)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A personal portfolio and AI project showcase built for a **Data Scientist & Generative AI Specialist**. It includes a fast web interface, an in-memory RAG chatbot/assistant, a gradient-descent CAPTCHA, and real-time DNS/MX email verification.

---

## 🏗 System Architecture

The platform operates as a decoupled client-server microservice model designed for sub-second global latency, dynamic memory efficiency, and strict network perimeter security:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT FRONTEND                                      │
│                (Vercel Global Edge Network • Native ES6+ Modules • CSS3)               │
└──────────────────────────┬─────────────────────────────────┬───────────────────────────┘
                           │                                 │
                 (1) Form Submission              (2) Conversational Query
              (Loss Minimized + Validated)          (HTTP Stream & History)
                           │                                 │
                           ▼                                 ▼
        ┌────────────────────────────────────┐    ┌──────────────────────────────────────┐
        │       VERIFICATION PIPELINE        │    │       FASTAPI BACKEND SERVICE        │
        ├────────────────────────────────────┤    │       (Render Cloud Container)       │
        │ • 1D Gradient Descent Captcha      │    ├──────────────────────────────────────┤
        │ • RFC 5322 Regex Validation        │    │ • Ephemeral ChromaDB Instance        │
        │ • Disposable Domain Blocklist      │    │ • Semantic Contextualizer (Memory)   │
        │ • Real-Time Google DoH (8.8.8.8)   │    │ • Sub-200 Token Hierarchical Chunks  │
        └──────────────────┬─────────────────┘    └──────────────────┬───────────────────┘
                           │                                         │
                    (Passed Checks)                            (3) RAG Prompt
                           │                                   (Grounded Chunks)
                           ▼                                         │
              ┌──────────────────────────┐                           ▼
              │     Web3Forms Gateway    │                ┌─────────────────────┐
              │  - Silent Honeypot Trap  │                │    Groq LPU Node    │
              │  - TLS Mail Delivery     │                │ (openai/gpt-oss-20b)│
              └──────────────────────────┘                └──────────┬──────────┘
                                                                     │
                                                           (4) Real-Time Token
                                                               Stream (~1000 tps)
                                                                     │
                                                                     ▼
                                                          ┌─────────────────────┐
                                                          │ Client Paced Buffer │
                                                          │ (Typewriter Engine) │
                                                          └─────────────────────┘
```

---

## 🧠 Deep-Dive: Generative AI & RAG Pipeline

The conversational assistant **"Zoe"** is powered by a custom-engineered, multi-turn Retrieval-Augmented Generation pipeline designed to eliminate hallucinations, handle pronoun ambiguity, and stream grounded responses with near-zero latency.

### 1. In-Memory Vectorization & Semantic Chunking
* **Ephemeral Vector Store:** Leverages an in-memory `chromadb.Client()` running directly in RAM. Eliminates database I/O bottlenecks and disk dependencies, allowing startup vectorization in `<180ms`.
* **Dense Vector Embeddings:** Uses the `all-MiniLM-L6-v2` transformer model (384-dimensional dense vector space) to compute cosine similarities.
* **Hierarchical Token-Safe Chunking:** Document parsing uses regex-based dual-boundary splitting (`\n(?=#{2,3}\s)`) across Markdown H2 and H3 boundaries. This keeps chunks under **200 tokens**, safely inside the model's 256-token hard truncation limit and eliminating information loss.

### 2. Contextual Query Disambiguation (Sliding Memory Window)
Traditional RAG fails when users ask conversational follow-up questions containing pronouns (e.g., *"What model does it use?"* or *"Can you tell me more about that?"*). 
* **Linguistic Heuristic Engine:** The backend analyzes incoming queries for ambiguous pronouns (`it`, `that`, `this`, `they`, `why`, `how`) or short token counts ($\le 2$ words).
* **Dynamic Query Expansion:** When an ambiguous follow-up is detected, the search term is synthesized with the previous user turn (`f"{last_user_query} {user_query}"`), steering ChromaDB to the correct vector coordinates while preventing query pollution on independent questions.
* **Multi-Turn Context Injection:** The last 4 conversational turns are injected directly into the LLM's message sequence, ensuring contextual continuity.

### 3. Strict Grounding & Anti-Hallucination Framework
```text
Raw Query ──► Contextual Search ──► Top-K Chunks ──► Grounded Prompt ──► Groq LPU
```
* **Strict Parameterization:** Uses low-temperature generation (`temperature=0.4`) anchored against the retrieved context.
* **Conversational Logic Gates:** System instructions explicitly differentiate between:
  1. *Factual inquiries:* Strictly grounded in retrieved context with fallbacks for unmentioned facts.
  2. *Nuanced/Personal inquiries:* Conversational and witty handling of profile nuances (e.g., hobbies, relationship status, cinema tastes).
  3. *Actionable scheduling guardrails:* Hardcoded constraints that prevent the model from fabricating real-world commitments, calendar events, or meetings.

### 4. Low-Latency Streaming & Client-Side Adaptive Pacing
* **Backend Anti-Buffering:** Emits an asynchronous HTTP stream via FastAPI's `StreamingResponse`, explicitly passing `X-Accel-Buffering: no` and `Cache-Control: no-cache` to prevent cloud proxies from buffering chunks.
* **Client-Side Typewriter Engine:** Powered by Groq's high-speed inference (~1,000 tokens/sec), text can outpace human reading speed. The client processes incoming `ReadableStream` chunks through an adaptive buffer (`setTimeout` pacer running at ~18ms/char), dynamically scaling character delivery based on network queue depth to produce a smooth, readable typewriter effect.
* **Live Markdown & Link Parser:** Custom regex engine transforms raw URLs, emails, bold syntax, and single-asterisk italics (`*text*` $\rightarrow$ `<em>`) into interactive DOM nodes in real time without external parser libraries.

---

## 🛡 Security, Anti-Abuse & Contact Verification Pipeline

The contact infrastructure eliminates bot spam, burner emails, and invalid transmissions before any third-party APIs are executed.

```text
[User Form Input] 
       │
       ▼
(1) Interactive Loss Minimization ──[Loss > 0.009]──► [Submit Blocked / Locked]
       │ (Loss Converged: 0.009)
       ▼
(2) RFC 5322 Schema Regex
       │ (Valid Syntax)
       ▼
(3) Disposable Domain Filter ───────[Matches Burner List]──► [Rejection Alert]
       │ (Clean Domain)
       ▼
(4) Google DNS-over-HTTPS (8.8.8.8) ──[Status != 0 or No MX]──► [Rejection Alert]
       │ (Active MX Records Verified)
       ▼
(5) Silent Honeypot Check ──────────[Bot Filled Field]───► [Silently Dropped]
       │ (Clean Submission)
       ▼
[Web3Forms TLS Transmission]
```

### 1. Interactive 1D Gradient Descent Captcha
Replaces third-party tracking captchas with an in-house machine learning optimization slider:
* The submit trigger is cryptographically locked while an active loss function displays an unoptimized score ($L = 0.892$).
* Users manually drag a physical optimization puck along the loss gradient. As the puck approaches convergence ($L \le 0.009$), the state transitions to `isVerified = true`, unlocking the submission trigger.
* Features a 10-second automatic decay timer that resets the optimizer to an unverified state if left untouched.

### 2. Multi-Tier Real-Time Email Authentication
1. **Tier 1 (Syntax Enforcement):** Strict client-side regex validation verifying standard username, domain, and top-level domain structures (`.com`, `.org`, `.in`, etc.).
2. **Tier 2 (Disposable Domain Heuristics):** Screens input against known disposable temporary email networks (e.g., Temp-Mail.org pools, Mailinator, GuerrillaMail, 10MinuteMail).
3. **Tier 3 (Real-Time DNS/MX over Google 8.8.8.8):** Non-standard business/custom domains trigger an asynchronous query to Google's public DNS-over-HTTPS (`https://dns.google/resolve?type=MX`). If the domain lacks active Mail Exchange (MX) records or routes to known self-referential disposable hosts, the submission is rejected with clean in-button error feedback.
4. **Tier 4 (Honeypot Shield):** Incorporates an off-screen, CSS-hidden input field (`name="botcheck"`). Automated scraping bots automatically populate all visible and hidden form fields, signaling Web3Forms to silently discard the payload.

### 3. Zero-Leak Profile Ingestion Pattern
* Personal biographical data (`backend/data/rahul_profile.md`) is excluded from Git tracking via `.gitignore`.
* Production deployments decrypt profile vectors at startup from a secure Base64 environment variable (`PROFILE_MD_BASE64`), allowing full RAG context retrieval on public repositories without exposing private records in version control.

---

## 🎨 Creative Engineering & UI Micro-Interactions

* **Procedural 3D Neural Manifold:** An interactive HTML5 canvas rendering an asymmetric 3D topological manifold (3,200 particle voxels). Features 3D coordinate projection math, depth sorting, physics-based mouse disturbance, and 4-tier staggered elastic spring-back dynamics.
* **Mechanical Rotary Odometer:** Section titles animate using an interactive split-flap reel. Characters spin through randomized strings before landing on final letters using cubic-bezier deceleration curves (`cubic-bezier(0.12, 0.8, 0.22, 1)`).
* **Feathered Photo Reveal:** The About section portrait unmasks via a 280% linear gradient mask sweeping right-to-left, synchronized with a 28px parallax drift and a delayed blur-clearing credential pill.
* **Single-Pass Shimmer Wave:** Cards feature a continuous horizontal light sweep on hover (`linear-gradient(90deg)`), styled to emulate the token calculation wave found in modern AI developer interfaces.
* **Obsidian Editorial Theme:** Built on a pure pitch-black canvas (`#000000`), accented with alternating matte charcoal section bands (`#141416`), deep obsidian cards (`#0a0a0d`), and thin 1px borders.

---

## 📱 Mobile & Responsive Adaptations

Custom-tailored for mobile screens without bloated libraries or hidden hamburger drawers:

```text
DESKTOP (Single Line Flex)
[ 🟣 RAHUL V S | Portfolio ]     [ About  Projects  Skills  Certs  Contact ]     [ </> ]

MOBILE (Dual-Tier Flex Ordering)
[ 🟣 RAHUL V S ]                                                                 [ </> ]
                        [ About   Projects   Skills   Certs   Contact ]
```

* **Two-Tier Mobile Navbar:** Uses CSS flexbox ordering (`order-1`, `order-2`, `order-3`) to create a 2-tier centered layout on phones without duplicate HTML or hamburger menus.
* **Touchscreen Detection:** Disables custom cursor rings on touch devices using `@media (pointer: coarse)` to prevent lag and visual artifacts on mobile.
* **Smart Content Reordering:** On mobile, the portrait photo automatically moves between the bio description and the 12 tech pills for a natural reading flow.
* **Adaptive Grid:** Stacks the 12 tech cards into a compact 2-column grid on phones with zero text clipping.
* **Mobile Viewport Fit:** Uses `calc(100vh - 5rem)` to adapt to dynamic mobile address bars (iOS Safari & Chrome Android), eliminating awkward gaps.

---

## 📁 Repository Structure

```text
portfolio-web/
├── assets/
│   └── images/                        # Optimized raster assets and profile imagery
│
├── css/
│   ├── chatbot.css                    # Chat drawer layouts, bubbles, and typography
│   ├── cursor.css                     # Custom hardware-accelerated concentric pointer
│   └── style.css                      # Obsidian theme, 3D lighting, and component tokens
│
├── js/
│   ├── animations.js                  # IntersectionObserver scroll trigger manager
│   ├── bike-anim.js                   # Procedural scooter vector path and smoke particle emitter
│   ├── chatbot.js                     # State manager, stream reader, and typewriter pacer
│   ├── cursor.js                      # Smooth lerp-following cursor tracker
│   ├── main.js                        # Global coordinator, click-to-copy, and nav controller
│   ├── neural.js                      # 3D procedural particle manifold engine
│   ├── rotary.js                      # Mechanical odometer slot-machine reel engine
│   └── verification.js                # Gradient descent loss slider & real-time DNS validator
│
├── backend/
│   ├── data/
│   │   ├── rahul_profile.example.md   # Public RAG template for external contributors
│   │   └── rahul_profile.md           # [Git-Ignored] Private vector knowledge base
│   │
│   ├── .env.example                   # Environment configuration template
│   ├── .gitignore                     # Python build and virtual environment exclusions
│   ├── main.py                        # FastAPI application routes, CORS, and Groq streaming
│   ├── pyproject.toml                 # PEP 621 dependency manifest (uv application mode)
│   ├── rag_engine.py                  # In-memory ChromaDB vectorizer, chunker, & retrieval
│   ├── requirements.txt               # Production build manifest for cloud environments
│   └── uv.lock                        # Deterministic dependency lockfile
│
├── index.html                         # Semantic, accessible single-page application markup
├── LICENSE                            # MIT License
└── README.md                          # System architecture and technical documentation
```

---

## 🛠 Tech Stack

| Domain | Layer / Tool | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, Tailwind CSS | Responsive, accessible semantic layout |
| **Visual Math** | HTML5 Canvas, Vector Math | 3D particle manifold and procedural physics |
| **Icons & Font** | Lucide Icons, Plus Jakarta Sans, JetBrains Mono | Interface iconography and typographic hierarchy |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2 | High-concurrency ASGI microservice API |
| **Vector Engine** | ChromaDB (In-Memory Ephemeral Engine) | Fast cosine similarity search and embedding storage |
| **Embedding Model** | `all-MiniLM-L6-v2` (ONNX Runtime) | Dense 384-dimensional semantic text representation |
| **LLM Inference** | Groq LPU (`openai/gpt-oss-20b`) | Real-time token generation (~1,000 tps) |
| **Email Security** | Google DoH API, Web3Forms | Real-time MX verification, honeypot, and mail dispatch |
| **Tooling & Env** | `uv` (Astral), Pip | Deterministic virtual environment and dependency tracking |
| **Cloud Hosting** | Vercel (Edge CDN), Render (Backend Service) | Zero-configuration global edge delivery and container hosting |

---

## 🚀 Local Development Setup

### 1. Prerequisites
* Python 3.10+
* [uv](https://docs.astral.sh/uv/) (recommended) or `pip`
* A free [Groq API Key](https://groq.com)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Initialize environment variables
cp .env.example .env

# Configure your Groq API key inside .env:
# GROQ_API_KEY="gsk_your_key_here"

# Sync dependencies and build virtual environment
uv sync

# Start the development server with live-reloading
uv run uvicorn main:app --reload
```
The RAG pipeline will ingest and index local knowledge chunks in RAM at `http://127.0.0.1:8000`.

### 3. Frontend Setup
Launch `index.html` via Live Server in VS Code, or start a local Python HTTP server from the root directory:
```bash
# From project root
python -m http.server 5500
```
Open `http://localhost:5500` in your browser.

---

## 🔒 Security Summary

* **Encrypted Knowledge Ingestion:** Real personal data is isolated from public version control and ingested dynamically into cloud memory via `PROFILE_MD_BASE64`.
* **Zero Client-Side API Keys:** Third-party credentials (Groq) are executed strictly on isolated cloud servers with CORS enforcement.
* **Defensive Form Architecture:** Submissions require verified human mathematical interaction and live domain validation before hitting external mail relays.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.