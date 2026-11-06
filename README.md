# Personal Portfolio Website feat: a RAG-powered AI Assistant ("Zoe") 

[![Live Portfolio](https://img.shields.io/badge/Live-Portfolio-8B5CF6.svg?style=flat&logo=vercel&logoColor=white)](https://rahulvenu.vercel.app/)
[![Render](https://img.shields.io/badge/Backend_Host-Render-46E3B7.svg?logo=render&logoColor=black)](https://render.com)
[![Supabase](https://img.shields.io/badge/Asset_CDN-Supabase_Storage-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Package Manager: uv](https://img.shields.io/badge/Tooling-uv-DE5FE9.svg?logo=astral&logoColor=white)](https://docs.astral.sh/uv/)
[![Vector DB - ChromaDB](https://img.shields.io/badge/Vector%20DB-ChromaDB-blue.svg)](https://www.trychroma.com/)
[![LLM - Groq LPU](https://img.shields.io/badge/LLM-Groq%20LPU%20(gpt--oss--20b)-green.svg)](https://groq.com/)
[![Three.js](https://img.shields.io/badge/3D_WebGL-Three.js-black.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A personal portfolio and AI engineering showcase built for a **Data Scientist & Generative AI Specialist**. Features a matte obsidian interface, an in-memory RAG assistant ("Zoe") with live Android music telemetry, interactive Three.js WebGL scenes, a neural PCB skills circuit board, a fullscreen 5-chapter horizontal parallax lookbook, a 1D gradient-descent CAPTCHA, and real-time DNS/MX email verification.

---

## 🏗 System Architecture

Decoupled client-server microservice architecture engineered for sub-second latency, cloud-hosted media delivery, and strict perimeter security:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT FRONTEND                                      │
│        (Vercel Edge Network • Native ES6+ Modules • Three.js WebGL • Supabase CDN)     │
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
        └──────────────────┬─────────────────┘    │ • Live Music Router (music_service)  │
                           │                      └──────────────────┬───────────────────┘
                    (Passed Checks)                                  │      ▲
                           │                                  (3) RAG Prompt│ (Webhook Push:
                           ▼                                 + Live Music   │  Poweramp +
              ┌──────────────────────────┐                      Context     │  MacroDroid)
              │     Web3Forms Gateway    │                           │      │
              │  - Silent Honeypot Trap  │                           ▼      ┴
              │  - TLS Mail Delivery     │                ┌─────────────────────┐
              └──────────────────────────┘                │    Groq LPU Node    │
                                                          │ (openai/gpt-oss-20b)│
                                                          └──────────┬──────────┘
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

## 📁 Repository Structure

```text
portfolio-web/
├── assets/
│   ├── fonts/                         # Self-hosted Magnify PRO (Thin, Light, Medium) typeface
│   ├── images/                        # Profile portraits (B&W/Color), favicons, and social previews
│   │   ├── beyond/                    # [Supabase CDN] 16:10 & 4:5 lookbook photography (.webp)
│   │   └── section-bg/                # [Supabase CDN] Multi-layer chapter backgrounds & cutouts
│   └── models/                        # [Supabase CDN] Draco-compressed 3D .glb assets (Leica M3, Avatar)
│
├── css/
│   ├── chatbot.css                    # Chat drawer layouts, bubbles, and conic border glow
│   ├── cursor.css                     # Hardware-accelerated concentric pointer
│   └── style.css                      # Matte obsidian theme, accordions, notch geometry, and typography
│
├── js/
│   ├── animations.js                  # IntersectionObserver reveal manager & desktop navbar proximity latch
│   ├── avatar.js                      # Three.js 3D peek-a-boo chatbot avatar controller
│   ├── beyond-mobile.js               # Mobile/tablet vertical feed, 2×2 seasonal cards & center-line debounce
│   ├── beyond-world.js                # 5-chapter fullscreen horizontal parallax engine & 3D Leica WebGL stage
│   ├── chatbot.js                     # RAG stream reader, adaptive typewriter pacer, and markdown parser
│   ├── config.js                      # Global Supabase CDN router, shared vector paths, icons & RAF utilities
│   ├── cursor.js                      # Smooth lerp-following cursor tracker
│   ├── logo-anim.js                   # Header/footer SVG ribbon stroke-write, morph, and portrait spotlight
│   ├── main.js                        # Central ES6 module orchestrator and click-to-copy controller
│   ├── neural.js                      # 3D procedural particle manifold engine (Hero section)
│   ├── preloader.js                   # Cursive signature-writing preloader & fly-to-navbar transition
│   ├── rotary.js                      # Mechanical odometer split-flap reel engine
│   ├── scrollbar.js                   # Zero-jitter GPU-accelerated floating pill scrollbar (Page + Chat)
│   ├── skills-circuit.js              # Interactive 8-domain neural PCB circuit board & SVG trace router
│   ├── synapse.js                     # Drifting neural node & pulse background canvas (Contact section)
│   └── verification.js                # 1D gradient descent loss slider & real-time Google DoH MX validator
│
├── backend/
│   ├── data/
│   │   ├── rahul_profile.example.md   # Public RAG template for external contributors
│   │   └── rahul_profile.md           # [Git-Ignored] Private vector knowledge base
│   ├── .env.example                   # Environment configuration template
│   ├── .gitignore                     # Python build and virtual environment exclusions
│   ├── main.py                        # FastAPI application routes, CORS, and Groq streaming
│   ├── music_service.py               # Decoupled APIRouter for real-time Poweramp music telemetry & state
│   ├── pyproject.toml                 # PEP 621 dependency manifest (uv application mode)
│   ├── rag_engine.py                  # In-memory ChromaDB vectorizer, chunker, & retrieval
│   ├── requirements.txt               # Production build manifest for cloud environments
│   └── uv.lock                        # Deterministic dependency lockfile
│
├── index.html                         # Semantic single-page application markup
├── LICENSE                            # MIT License
└── README.md                          # System architecture and technical documentation
```

---

## 🧠 Deep-Dive: Generative AI & RAG Pipeline

The conversational assistant **"Zoe"** runs on a custom multi-turn RAG pipeline built to eliminate hallucinations, resolve pronoun ambiguity, and stream responses with near-zero latency.

### 1. In-Memory Vectorization & Semantic Chunking
* **Ephemeral Vector Store:** Uses an in-memory `chromadb.Client()` in RAM—eliminating disk I/O bottlenecks and indexing the knowledge base in `<180ms`.
* **Dense Embeddings:** Computes cosine similarity across 384-dimensional vectors via `all-MiniLM-L6-v2`.
* **Token-Safe Chunking:** Splits Markdown on H2/H3 boundaries (`\n(?=#{2,3}\s)`), keeping chunks `<200 tokens` (safely below the model's 256-token truncation limit).

### 2. Contextual Query Disambiguation (Sliding Memory)
* **Pronoun Heuristics:** Detects ambiguous follow-ups (`it`, `that`, `this`, `they`, `why`, `how`) or short queries ($\le 2$ words).
* **Dynamic Query Expansion:** Concatenates ambiguous follow-ups with the prior user turn (`f"{last_user_query} {user_query}"`) for accurate vector retrieval without polluting independent queries.
* **Multi-Turn Memory:** Injects the last 4 conversation turns directly into the LLM prompt sequence.

### 3. Strict Grounding & Anti-Hallucination Guardrails
```text
Raw Query ──► Contextual Search ──► Top-K Chunks + Live Music State ──► Grounded Prompt ──► Groq LPU
```
* **Low-Temperature Generation:** Anchors responses to retrieved context at `temperature=0.4`.
* **Prompt Logic Gates:** Separates strict factual Q&A, witty personal/hobby responses, and hardcoded scheduling guardrails (preventing fabricated calendar commitments).

### 4. Low-Latency Streaming & Adaptive Typewriter Pacing
* **Zero-Buffer Streaming:** FastAPI `StreamingResponse` passes `X-Accel-Buffering: no` and `Cache-Control: no-cache` to bypass proxy buffering.
* **Client Typewriter Buffer:** Smooths Groq's ~1,000 tokens/sec output through an adaptive `setTimeout` pacer (~18ms/char) scaled by queue depth.
* **Live Markdown Parser:** Lightweight regex parser converts URLs, emails, bold text, and italics into live DOM nodes during streaming.

### 5. Zero-Permission Real-Time Music Telemetry (`music_service.py`)
Zoe knows what music Rahul is listening to in real time via a privacy-first Android webhook pipeline:

```text
[Poweramp Android Player]
       │ (Broadcast: com.adam.aslfms.notify.playstatechanged)
       ▼
[MacroDroid Client] ──(Zero Notification/SMS Permissions)──► [POST /api/music/update]
                                                                    │
                                     ┌──────────────────────────────┴──────────────────────────────┐
                                     ▼                                                             ▼
                       [In-Memory: LIVE_MUSIC_STATE]                                [OS Temp: /tmp/poweramp_*.json]
                                     └──────────────────────────────┬──────────────────────────────┘
                                                                    ▼
                                               [Injected into Zoe Prompt: [LIVE MUSIC STATUS]]
```
* **Zero-Permission Broadcasts:** Bypasses invasive Android notification listeners (`BIND_NOTIFICATION_LISTENER_SERVICE`) by capturing Poweramp's native developer intent (`track`, `artist`, `album`, `state`).
* **State & Pause Continuity:** Maps states `0/1` to `is_playing = True` and `2/3` to `False`. Retains the last-known track in memory when paused so Zoe can report what was playing most recently.
* **Metadata Sanitization & Temp Caching:** Strips dummy album tags (`"Unknown Album"`) and mirrors state to `tempfile.gettempdir()` for sub-millisecond reads without triggering local live-reload loops.

---

## 🛡 Security, Anti-Abuse & Contact Verification Pipeline

Blocks bot spam, burner domains, and invalid emails before any external mail API is called:

```text
[Form Input] ──► (1) 1D Loss Slider (L ≤ 0.009) ──► (2) RFC 5322 Regex ──► (3) Burner Blocklist
                                                                                   │
[Web3Forms TLS] ◄── (5) Silent Honeypot Check ◄── (4) Google DoH MX Lookup (8.8.8.8)
```

1. **1D Gradient Descent Captcha:** Locks submission ($L = 0.892$) until the user drags an optimization puck to convergence ($L \le 0.009$). Auto-decays after 10 seconds of inactivity.
2. **Multi-Tier Email Verification:** Combines strict RFC 5322 regex, a disposable domain blocklist (Mailinator, Temp-Mail, GuerrillaMail, etc.), and live **Google DNS-over-HTTPS (`8.8.8.8`) MX record resolution** to verify active mail servers.
3. **Silent Honeypot & Zero-Leak Profile:** Hidden `botcheck` input silently drops automated scrapers. Personal RAG data (`rahul_profile.md`) is git-ignored and decoded in cloud RAM from `PROFILE_MD_BASE64`.

---

## ⚡ Frontend Performance, Memory & GPU Optimization

Engineered to run 3 WebGL scenes, custom canvas physics, and 85+ high-resolution `.webp` photography frames smoothly—reducing peak browser memory consumption from **`550–600 MB` down to `300–400 MB` RAM** at a locked `60/120fps`:

* **Two-Stage Predictive Asset Pre-Warming:** `js/preloader.js` decodes only critical above-the-fold assets at startup. An `IntersectionObserver` on Section 04/05 (`rootMargin: '350px'`) pre-warms Chapters 01–02 and compiles the 3D Leica shaders as the user approaches `#beyond`.
* **Chapter 02 Seasonal GPU Pre-Decoding:** Landing on Chapter 02 triggers a staggered background queue (`900ms` delay + `350ms` step) that un-culls Chapter 05 early and calls asynchronous `img.decode()` across all 4 seasons—eliminating rasterization and texture-upload frame drops on first entry to Chapter 05.
* **Sliding-Window Viewport Culling:** Inside the `500vw` horizontal track, only the active spread and its immediate neighbor (`dist <= 1`) are GPU-promoted. Distant spreads are culled (`visibility: hidden`, `will-change: auto`) to prevent VRAM layer exhaustion.
* **Mobile RAM Cap & Center-Line Scroll Debouncing (`js/beyond-mobile.js`):**
  * **Primary-Slide Memory Guard:** On mobile/tablet (`< 1024px`), inactive seasonal galleries hydrate only their primary slide (`-a.webp`, cutting Chapter 05 mobile textures from 48 to 16) and skip uncompressed `img.decode()` calls—preventing mobile Safari/Chrome tab memory eviction and blank-frame re-downloads when scrolling back and forth.
  * **10% Center-Line Laser Lock + `150ms` Idle Debounce:** Uses `rootMargin: '-45% 0px -45% 0px'` so only the single dominant season in the dead-center of the screen is active, waiting `150ms` for scroll momentum to settle before switching backgrounds or timers.
* **WebGL Lifecycle & Deduplication (`js/config.js`):** Immediately `.dispose()`s `PMREMGenerator` and `DRACOLoader` workers after `.glb` ingestion, pauses off-screen WebGL loops (`#neural-canvas`, `#avatar-peek-canvas`, `#synapse-canvas`), and centralizes all Supabase CDN URLs and shared SVG paths in `js/config.js`.

---

## 🎨 Creative Engineering, 3D WebGL & Section Architecture

* **Signature Preloader (`js/preloader.js`):** Draws a cursive SVG signature as the live loading progress, then flies and scales it directly into the navbar brand mark.
* **Ribbon-Write Morphing Logos (`js/logo-anim.js`):** Header (`RAHUL V S`) and footer (`RAHUL VENU`) logos use SVG `<clipPath>` masks and `stroke-dashoffset` ribbons to trace purple ink through the strokes before collapsing into `RV`.
* **3D Neural Manifold (`js/neural.js`):** Hero canvas rendering 3,200 particle voxels with 3D projection, depth sorting, and elastic mouse-disturbance physics.
* **Cursor Spotlight Portrait & Marquee Bands (`#about`):** Dual-layer B&W/Color portrait stack revealed via a cursor-tracked radial mask, paired with a `-30°` self-writing signature and counter-scrolling 6+6 credential bands.
* **4-Row Case-Study Ledger (`#projects`):** Vertical accordion unfolding into a 4-tier full-width breakdown (header/status pills, impact bullets, icon-tagged tech stack, and a 4-stage architecture diagram).
* **Neural PCB Skills Circuit (`js/skills-circuit.js`):** Maps 62 skills across 8 cyber-neon domains with dynamic 45° chamfered SVG traces, border-pin via dots, and running signal packets.
* **7-Blade Credential Accordion (`#certifications`):** Symmetrical horizontal accordion with Blade 04 (`Azure AI Fundamentals`) open in the center by default and brand-colored vector watermarks.
* **Section 05 — "Beyond the Code" 5-Chapter Parallax World (`js/beyond-world.js`):**
  * **Planetary Horizon Portal:** Opens from a neon planetary arc into a `100vw × 100dvh` 5-chapter horizontal lookbook with 3-speed differential parallax and live 3D mouse-tilt.
  * **Ch 01 (Mountains & Throttle) & Ch 02 (Sunsets & Coastlines):** Multi-layer parallax backgrounds with center cutout overlays and asymmetric 6-frame and 8-frame collages.
  * **Ch 03 (Photography & 3D Leica M3):** Dual-mode gallery featuring a Three.js `camera-leica-m3.glb` model with custom optical glass shaders that rotates 180° in place (Lens $\leftrightarrow$ Viewfinder).
  * **Ch 04 (Maker & Mechanic):** Diagonal Z-balance split-deck with 4 DIY ambient lamp builds on top, a 2×2 quad-split PCB repair frame + garage/DaVinci frames on bottom, and dual off-screen animated overlays.
  * **Ch 05 (Dream Atlas — 4 Seasons × 4 Countries):** 16 dream destinations (48 `16:10` frames) with synchronized 3-image auto-sliding reels (`4.2s` initial hold, `3.0s` cycle) matching each season's directional physics.
* **Notched Synapse Contact & 3D Avatar (`js/synapse.js`, `js/avatar.js`, `js/scrollbar.js`):** S-curve notched contact panel with a drifting synapse canvas, 3D peek-a-boo chatbot avatar, spinning 4-color conic chat border, and GPU-accelerated pill scrollbars.

---

## 📱 Mobile & Responsive Adaptations

Tailored for mobile and tablet screens (`< 1024px`) without heavy UI frameworks or hamburger menus:

```text
DESKTOP (Single Line Grid)
[ About  Projects  Skills ]          [ 🟣 RAHUL V S | Portfolio ]          [ Certs  Contact  </> ]

MOBILE (Dual-Tier Flex Ordering)
[ 🟣 RAHUL V S ]                                                                           [ </> ]
                        [ About   Projects   Skills   Certs   Contact ]
```

* **Two-Tier Mobile Navbar:** Responsive flex ordering creates a centered 2-tier layout on phones using a single DOM tree.
* **Continuous Vertical Feed for "Beyond the Code" (`js/beyond-mobile.js`):**
  * Converts the `500vw` desktop horizontal stage into a native vertical scroll feed (`touch-action: pan-y`) on `< 1024px`.
  * **Unstacked 2×2 Seasonal Stages:** Unstacks all 4 seasons (`Spring`, `Summer`, `Autumn`, `Winter`) into consecutive vertical sections—each with a 2×2 grid of equal-height cards pairing every country's `16:10` photo reel directly above its full description.
* **Ordered Project & Section Stacking:** Reorders project card headers into full-width vertical stacks on mobile (preventing title truncation and pill wrapping) and disables desktop cursor rings/scrollbars on touch devices.

---

## 🛠 Tech Stack

| Domain | Layer / Tool | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, Tailwind CSS, Custom CSS3 | Responsive semantic layout and accordion geometry |
| **3D & Visual Math** | Three.js (WebGL), HTML5 Canvas | 3D particle manifold, Leica M3 `.glb`, and synapse physics |
| **Typography & Icons** | Magnify PRO, Plus Jakarta Sans, JetBrains Mono, Lucide | 3-weight editorial typography, metadata, and iconography |
| **Media & Asset CDN** | Supabase Storage, WebP, Draco GLTF | Cloud-hosted `.webp` lookbook imagery and compressed `.glb` models |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2 | High-concurrency ASGI microservice API |
| **Vector Engine** | ChromaDB (In-Memory) + `all-MiniLM-L6-v2` | Sub-millisecond 384-dim cosine similarity search |
| **LLM Inference** | Groq LPU (`openai/gpt-oss-20b`) | Real-time token streaming (~1,000 tps) |
| **Music Telemetry** | Poweramp, MacroDroid, Android Intent API | Zero-permission music broadcast and authenticated webhook push |
| **Email Security** | Google DoH API (`8.8.8.8`), Web3Forms | Live MX verification, honeypot, and TLS mail dispatch |
| **Tooling & Hosting** | `uv` (Astral), Vercel (Edge), Render (Container) | Deterministic dependency locking and cloud deployment |

---

## 🚀 Local Development Setup

### 1. Prerequisites
* Python 3.10+ & [uv](https://docs.astral.sh/uv/) (or `pip`)
* A free [Groq API Key](https://groq.com)

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Add GROQ_API_KEY="gsk_..." and MUSIC_SYNC_TOKEN="..." to .env

uv sync
uv run uvicorn main:app --reload
```
The RAG service indexes knowledge chunks in RAM at `http://127.0.0.1:8000`.

### 3. Frontend Setup
```bash
# From project root (or use VS Code Live Server)
python -m http.server 5500
```
Open `http://localhost:5500` in your browser.

---

## 🔒 Security Summary

* **Encrypted Knowledge Ingestion:** Personal RAG data is git-ignored and decoded in cloud RAM via `PROFILE_MD_BASE64`.
* **Zero Client-Side API Keys:** Groq credentials execute strictly on the backend with CORS enforcement.
* **Authenticated Mobile Telemetry:** Music webhooks use explicit Android broadcasts and require Bearer token authentication (`MUSIC_SYNC_TOKEN`).
* **Defensive Contact Pipeline:** Requires human gradient-descent interaction and live DNS MX validation before mail dispatch.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.