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

A personal portfolio and AI engineering showcase built for a **Data Scientist & Generative AI Specialist**. It features a high-contrast matte obsidian interface, an in-memory RAG assistant ("Zoe") with live Android music telemetry, interactive WebGL 3D scenes, a neural PCB skills circuit board, a fullscreen 5-chapter horizontal parallax lookbook, a 1D gradient-descent CAPTCHA, and real-time DNS/MX email verification.

---

## 🏗 System Architecture

The platform operates as a decoupled client-server microservice model designed for sub-second global latency, dynamic memory efficiency, cloud-hosted media delivery, and strict network perimeter security:

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
│   │   ├── beyond/                    # [Supabase CDN / Local] 16:10 & 4:5 lookbook photography (.webp)
│   │   └── section-bg/                # [Supabase CDN / Local] Multi-layer chapter backgrounds & cutouts
│   └── models/                        # [Supabase CDN / Local] Draco-compressed 3D .glb assets (Leica M3, Avatar)
│
├── css/
│   ├── chatbot.css                    # Chat drawer layouts, bubbles, and conic border glow
│   ├── cursor.css                     # Custom hardware-accelerated concentric pointer
│   └── style.css                      # Matte obsidian theme, accordions, notch geometry, and typography
│
├── js/
│   ├── animations.js                  # IntersectionObserver reveal manager & desktop navbar proximity latch
│   ├── avatar.js                      # Three.js 3D peek-a-boo chatbot avatar controller
│   ├── beyond-mobile.js               # Progressive mobile/tablet vertical feed & country card pairing engine
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
│   │
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
Raw Query ──► Contextual Search ──► Top-K Chunks + Live Music State ──► Grounded Prompt ──► Groq LPU
```
* **Strict Parameterization:** Uses low-temperature generation (`temperature=0.4`) anchored against the retrieved context.
* **Conversational Logic Gates:** System instructions explicitly differentiate between:
  1. *Factual inquiries:* Strictly grounded in retrieved context with fallbacks for unmentioned facts.
  2. *Nuanced/Personal inquiries:* Conversational and witty handling of profile nuances (e.g., hobbies, relationship status, cinema tastes, and real-time music playback).
  3. *Actionable scheduling guardrails:* Hardcoded constraints that prevent the model from fabricating real-world commitments, calendar events, or meetings.

### 4. Low-Latency Streaming & Client-Side Adaptive Pacing
* **Backend Anti-Buffering:** Emits an asynchronous HTTP stream via FastAPI's `StreamingResponse`, explicitly passing `X-Accel-Buffering: no` and `Cache-Control: no-cache` to prevent cloud proxies from buffering chunks.
* **Client-Side Typewriter Engine:** Powered by Groq's high-speed inference (~1,000 tokens/sec), text can outpace human reading speed. The client processes incoming `ReadableStream` chunks through an adaptive buffer (`setTimeout` pacer running at ~18ms/char), dynamically scaling character delivery based on network queue depth to produce a smooth, readable typewriter effect.
* **Live Markdown & Link Parser:** Custom regex engine transforms raw URLs, emails, bold syntax, and single-asterisk italics (`*text*` $\rightarrow$ `<em>`) into interactive DOM nodes in real time without external parser libraries.

### 5. Zero-Permission Real-Time Music Telemetry (`music_service.py` + Poweramp + MacroDroid)
Zoe features dynamic live awareness of what music Rahul is listening to in the physical world via a decoupled, private webhook router (`backend/music_service.py`):

```text
[Poweramp Android Player]
       │ (Built-in Broadcast: com.adam.aslfms.notify.playstatechanged)
       ▼
[MacroDroid Android Client] ──(Zero Notification/Privacy Permissions)
       │ 
       ▼ (HTTPS POST • Bearer Token Auth)
[/api/music/update (music_service.py)]
       │
       ├──► [In-Memory State: LIVE_MUSIC_STATE]
       └──► [OS Temp Directory: /tmp/poweramp_live_music.json]
                     │
                     ▼
       [Injected into Zoe's Prompt via [LIVE MUSIC STATUS]]
```
* **Zero-Permission Intent Interception:** Completely bypasses Android's invasive `BIND_NOTIFICATION_LISTENER_SERVICE` (which reads private SMS, notifications, and OTPs). Instead, it isolates Poweramp's built-in developer broadcast intent (`com.adam.aslfms.notify.playstatechanged`), capturing only music metadata (`track`, `artist`, `album`, `state`).
* **State Machine & Playback Normalization:** Playback states `0` (Start) and `1` (Resume) evaluate to `is_playing = True`; states `2` (Pause) and `3` (Complete) evaluate to `is_playing = False`.
* **Stateful Continuity & Metadata Fallback:** When a track is paused, Poweramp frequently emits an empty title. The service retains the last-known track in memory so Zoe can accurately answer *"Rahul is not playing music right now, but was last listening to..."* without loss of context.
* **Smart Album Filter:** Heuristically sanitizes Poweramp's default dummy tags (`"Unknown Album"`, `None`, empty strings) so Zoe naturally omits album references for standalone singles rather than speaking placeholder metadata.
* **In-Memory + OS Temp Caching:** The live state is stored in an in-memory dictionary and mirrored to the operating system's temporary directory (`tempfile.gettempdir()`), ensuring sub-millisecond retrieval, preventing local hot-reloader loops, and leaving zero traces in Git version control.

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
* The submit trigger is locked while an active loss function displays an unoptimized score ($L = 0.892$).
* Users manually drag an optimization puck along the loss gradient. As the puck approaches convergence ($L \le 0.009$), the state transitions to `isVerified = true`, unlocking the submission trigger.
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

## ⚡ Frontend Performance, Memory & GPU Optimization

Despite hosting 3 distinct WebGL scenes, custom canvas physics, and 85+ high-resolution `.webp` photography frames, the client is engineered to keep memory usage low (`~120–160 MB` RAM) and maintain a locked `60/120fps` frame budget:

* **Two-Stage Predictive Asset Pre-Warming:** Instead of decoding all 85+ lookbook images at initial startup (which would allocate `>300 MB` of uncompressed RGBA bitmap textures in RAM), `js/preloader.js` only decodes critical above-the-fold assets. An `IntersectionObserver` watching `#beyond` (`rootMargin: '350px'`) pre-warms Chapters 01–02 and compiles the 3D Leica WebGL shaders right as the user approaches Section 05, followed by an idle background queue for Chapters 03–05.
* **Sliding-Window Viewport Culling & Layer Discipline:** Inside the `500vw` horizontal parallax track, only the active chapter and its immediate neighbor (`Math.abs(i - currentIdx) <= 1`) are kept visible and GPU-promoted. Off-screen chapters are culled (`visibility: hidden`, `will-change: auto`) so the browser compositor never holds 5 fullscreen viewports in VRAM simultaneously.
* **WebGL Lifecycle & VRAM Management:**
  * Temporary Three.js environment and geometry decoders (`PMREMGenerator`, `DRACOLoader` web workers) are explicitly `.dispose()`d immediately after asset ingestion.
  * Off-screen WebGL/2D canvases (`#neural-canvas`, `#avatar-peek-canvas`, `#synapse-canvas`) automatically pause their `requestAnimationFrame` loops via `IntersectionObserver` or when the fullscreen `#beyond-dimension-overlay` is active.
  * The 3D Leica M3 WebGL renderer only executes draw calls when Chapter 03 is in the active viewport window (`currentIdx === 2` on desktop or `dataset.ch3Visible === '1'` on mobile).
* **Centralized Asset & Vector Deduplication (`js/config.js`):** All Supabase Storage CDN routing (`assetUrl()`), shared cursive signature/monogram SVG paths (`SIGNATURE_PATHS`, `BRAND_RV_PATHS`), badge icons (`BADGE_ICONS`), and `requestAnimationFrame` throttling utilities (`rafThrottle()`) are consolidated into a single zero-dependency module.
* **Deterministic State Reset & Timer Hygiene:** Exiting the lookbook dimension or switching seasonal sub-stages immediately clears all active intervals/timeouts (`stopSeasonTrioTimers()`) and resets slide indices to prevent background timer leaks.

---

## 🎨 Creative Engineering, 3D WebGL & Section Architecture

* **Signature-Writing Preloader & Fly-to-Navbar Transition (`js/preloader.js`):** On initial load, a custom cursive SVG signature writes itself out as the real-time progress indicator while preloading critical assets, then calculates the exact bounding-box vector to fly and scale directly into the navbar brand mark.
* **Vector Ribbon Stroke-Write & Morphing Logos (`js/logo-anim.js`):** Both the header (`RAHUL V S`) and footer (`RAHUL VENU`) logos use SVG `<clipPath>` masks and `stroke-dashoffset` centerline ribbons that snake solid purple ink through the letter geometry before igniting the `V` slash and collapsing into the compact `RV` monogram.
* **Procedural 3D Neural Manifold (`js/neural.js`):** An interactive HTML5/WebGL canvas in the Hero section rendering an asymmetric 3D topological manifold (3,200 particle voxels) with 3D coordinate projection, depth sorting, and elastic spring-back physics.
* **Editorial B&W Portrait with Cursor Color Spotlight (`#about`):** A two-layer transparent portrait stack (`profile-bw.png` + `profile-color.png`) masked by a real-time radial cursor spotlight (`--spot-x`, `--spot-y`) that reveals true color under the pointer, paired with a `-30°` self-writing signature and dual counter-scrolling 6+6 credential marquee bands.
* **4-Row Expandable Case-Study Ledger (`#projects`):** A vertical accordion ledger where each expanded project unfolds into a 4-tier full-width architectural breakdown: header/status pills, bulleted engineering impact, icon-tagged tech stack, and a 4-stage visual system architecture diagram.
* **Interactive Neural PCB Circuit Constellation (`js/skills-circuit.js`):** Organizes 62 technical skills across 8 cyber-neon domain clusters. Selecting or hovering a domain dynamically calculates and renders 45°-chamfered SVG PCB circuit traces, border-pin via dots, stub traces, and animated signal packets across the board.
* **7-Blade Horizontal Credential Accordion (`#certifications`):** A symmetrical 7-blade horizontal accordion where Blade 04 (`Azure AI Fundamentals`) rests open in the center by default, featuring brand-tinted background vector watermarks and instant verification links.
* **Section 05 — "Beyond the Code" Fullscreen 5-Chapter Parallax World (`js/beyond-world.js`):**
  * **Planetary Horizon Portal:** Opens from a full-bleed neon planetary horizon arc into an edge-to-edge (`100vw × 100dvh`) 5-chapter horizontal lookbook driven by a 3-speed differential parallax engine (scroll velocity drift, inner image counter-panning, and live 3D mouse-tilt).
  * **Ch 01 (Altitudes & Off-Roads) & Ch 02 (Sunsets & Coastlines):** Multi-layer parallax background scenes with center foreground cutout overlays, asymmetric 6-frame and 8-frame galleries, and borderless location pin stamps.
  * **Ch 03 (Visual Perspectives & 3D Leica M3):** Dual-stage photography showcase (`01 Behind The Lens` vs `02 In The Frame`) featuring an interactive Three.js WebGL `camera-leica-m3.glb` model with custom optical glass shaders that rotates 180° in place from the front lens to the rear viewfinder when switching modes.
  * **Ch 04 (Maker & Mechanic):** A diagonal Z-balance upper/lower split-deck showcasing custom ambient lighting DIY builds on top and a 2×2 quad-split PCB diagnostics frame, motorcycle servicing, and DaVinci Resolve color grading on the bottom, flanked by dual off-screen animated overlays.
  * **Ch 05 (Dream Atlas — 4 Seasons × 4 Countries):** A 4-season travel odyssey covering 16 dream destinations (48 total `16:10` frames). Each country frame houses a synchronized 3-image auto-sliding reel (`4.2s` initial hold, `3.0s` cycle) whose reveal direction matches the active season's physics (diagonal breeze in Spring, horizontal shutter in Summer, top-down drift in Autumn, and 3D polar zoom in Winter).
* **Notched Synapse Contact Panel & 3D Peek Avatar (`js/synapse.js`, `js/avatar.js`):** A custom S-curve bumped/dropped contact container backed by a drifting neural synapse canvas, alongside a 3D WebGL peek-a-boo avatar and a spinning 4-color conic border ring on the chatbot trigger.
* **GPU-Composited Floating Pill Scrollbar (`js/scrollbar.js`):** Zero-jitter `translate3d` translucent pill scrollbar for both the main viewport and the chatbot message stream.

---

## 📱 Mobile & Responsive Adaptations

Custom-tailored for mobile and tablet screens (`< 1024px`) without bloated UI frameworks or hidden hamburger drawers:

```text
DESKTOP (Single Line Grid)
[ About  Projects  Skills ]          [ 🟣 RAHUL V S | Portfolio ]          [ Certs  Contact  </> ]

MOBILE (Dual-Tier Flex Ordering)
[ 🟣 RAHUL V S ]                                                                           [ </> ]
                        [ About   Projects   Skills   Certs   Contact ]
```

* **Two-Tier Mobile Navbar:** Uses responsive grid/flex ordering to create a 2-tier centered layout on phones without duplicate HTML or hamburger menus.
* **Progressive Vertical Feed for "Beyond the Code" (`js/beyond-mobile.js`):**
  * Automatically converts the `500vw` desktop horizontal stage into a native, hardware-accelerated vertical scroll feed (`touch-action: pan-y`) on screens `< 1024px`, bypassing desktop drag/wheel capture listeners.
  * **Per-Chapter Lazy Hydration:** Hydrates Chapters 01–02 on open and progressively hydrates Chapters 03–05 via `IntersectionObserver` (`rootMargin: '600px'`) so opening the portal never blocks the mobile main thread.
  * **2-Column Bento Collages & Paired Country Cards:** Reorders chapter narratives above 2-column Bento photo grids, centers the 3D Leica M3 inside its dedicated slot, and dynamically pairs each of the 16 seasonal country reels with its matching description caption directly underneath into unified cards (`1-col` on phones, `2×2` grid on tablets).
* **Touchscreen Detection:** Disables custom cursor rings and custom desktop scrollbars on touch devices using `@media (hover: hover) and (pointer: fine)` to preserve native mobile scrolling performance.
* **Adaptive Section Unfolding:** Horizontal/vertical desktop accordions (`#projects`, `#certifications`) and the PCB circuit constellation (`#skills`) automatically stack into clean, touch-friendly vertical layouts on mobile screens.

---

## 🛠 Tech Stack

| Domain | Layer / Tool | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, Tailwind CSS, Custom CSS3 | Responsive, accessible semantic layout and accordion geometry |
| **3D & Visual Math** | Three.js (WebGL), HTML5 Canvas | 3D particle manifold, interactive Leica M3 `.glb`, and synapse physics |
| **Typography & Icons** | Magnify PRO, Plus Jakarta Sans, JetBrains Mono, Lucide | 3-weight editorial typography, technical metadata, and iconography |
| **Media & Asset CDN** | Supabase Storage, WebP, Draco GLTF | Cloud-hosted high-res `.webp` lookbook imagery and compressed `.glb` models |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2 | High-concurrency ASGI microservice API |
| **Vector Engine** | ChromaDB (In-Memory Ephemeral Engine) | Fast cosine similarity search and embedding storage |
| **Embedding Model** | `all-MiniLM-L6-v2` (ONNX Runtime) | Dense 384-dimensional semantic text representation |
| **LLM Inference** | Groq LPU (`openai/gpt-oss-20b`) | Real-time token generation (~1,000 tps) |
| **Music Telemetry** | Poweramp (Android), MacroDroid, Android Intent API | Zero-permission real-time music broadcast and authenticated webhook push |
| **Email Security** | Google DoH API, Web3Forms | Real-time MX verification, honeypot, and mail dispatch |
| **Tooling & Env** | `uv` (Astral), Pip | Deterministic virtual environment and dependency tracking |
| **Cloud Hosting** | Vercel (Edge CDN), Render (Backend Service) | Global edge delivery and container hosting |

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

# Configure your Groq API key and Music Sync Token inside .env:
GROQ_API_KEY="gsk_your_key_here"
MUSIC_SYNC_TOKEN="your_custom_secret_sync_token_here"

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
* **Sandboxed Mobile Telemetry:** Music telemetry relies on explicit Android system broadcast receivers rather than notification scraping. Webhook endpoints require pre-shared Bearer token authentication (`MUSIC_SYNC_TOKEN`) with instant rejection of unauthorized payloads.
* **Defensive Form Architecture:** Submissions require verified human mathematical interaction and live domain validation before hitting external mail relays.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.