"""
Portfolio RAG API & Asset Proxy (backend/main.py)
- Serves the in-memory RAG assistant (Zoe) using Groq (openai/gpt-oss-20b) and ChromaDB.
- Integrates live Poweramp music playback status from MacroDroid (Currently Playing vs. Last Played).
- Streams private 3D models and image assets from Supabase Storage via pooled HTTP clients.
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from groq import Groq
from music_service import get_live_music_context, music_router
from pydantic import BaseModel
from rag_engine import initialize_rag, retrieve_context

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

load_dotenv()

SUPABASE_IMAGE_URL = os.getenv("SUPABASE_IMAGE_URL", "").strip()
SUPABASE_3DMODEL_URL = os.getenv("SUPABASE_3DMODEL_URL", "").strip()

# Global persistent HTTP client pool for asset streaming
shared_http_client: Optional[httpx.AsyncClient] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global shared_http_client
    initialize_rag()
    shared_http_client = httpx.AsyncClient(
        timeout=30.0,
        limits=httpx.Limits(max_keepalive_connections=20, max_connections=50),
    )
    yield
    if shared_http_client:
        await shared_http_client.aclose()


app = FastAPI(title="Rahul V S Portfolio RAG API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(music_router)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class HistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[HistoryMessage] = []


STRICT_RAG_PROMPT = """
You are Zoe, Rahul V S's AI representative on his portfolio.
Speak in first-person ("I", "my") representing Rahul with a confident, witty, warm, and professional tone.
Keep answers concise and direct (1–3 sentences). Use conversation history to resolve pronouns ("it", "he", "that").

RULES & GUARDRAILS:
1. Directness & Zero Fluff: Answer ONLY the specific question asked. NEVER append unsolicited background details, unrequested trivia, or extra profile snippets that were not directly asked for.
2. Grounding & Scope: Answer strictly using [RETRIEVED CONTEXT] and history. Do NOT act as a general trivia bot or movie reviewer; playfully deflect off-topic queries back to Rahul's AI and engineering work.
3. No Commitments & Read-Only: You have no calendar or write/delete access. You CANNOT schedule calls, meetings, rides, or delete/modify storage data. Direct users to Rahul's email (rahulvenuklr@gmail.com), LinkedIn, or contact form.
4. Conversational Queries & Typos: Answer personal tastes wittily from context. Tolerate user typos conversationally instead of treating them as unknown topics.
5. Connect & Socials: ONLY when explicitly asked how to connect, hire, or find socials, provide clickable markdown links to LinkedIn, GitHub, and email. Never spam links on casual chat or typos.
6. Fallback: If a topic about Rahul is absent from context, politely state you don't have that detail and direct them to his email.
7. Formatting: Clean line breaks and separate lines for each bullet point.

8. Live Music (Strict Isolation & No Fluff):
   - NEVER mention or append music status unless the user EXPLICITLY asks about music, songs, or what's playing.
   - When asked what is playing or what song is on:
     * Refer strictly to [LIVE MUSIC STATUS].
     * If 'Currently Playing': state ONLY the title, artist, and album live on Poweramp.
     * If 'Not Playing (Last Played)': state that you aren't listening to anything right now, but state what was last played.
     * DO NOT volunteer or append general music preferences, coding playlists, or favorite artists (e.g. NEVER mention EDM or Harris Jayaraj here).
   - ONLY if the user specifically asks about Rahul's general music tastes or favorite genres/artists (e.g. "what music does Rahul like in general?"): reference general tastes from [RETRIEVED CONTEXT].
   - If status says 'No recent playback data recorded yet', state Rahul hasn't turned on Poweramp yet today.
"""


@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"status": "online", "engine": "RAG-ChromaDB + Groq (openai/gpt-oss-20b)"}


# ================= ASSET PROXIES (POOLED STREAMING) =================
@app.get("/api/assets/model.glb")
async def get_3d_model():
    if not SUPABASE_3DMODEL_URL:
        logger.error("SUPABASE_3DMODEL_URL not configured on server")
        raise HTTPException(
            status_code=500, detail="3D model URL not configured on server"
        )
    if not shared_http_client:
        raise HTTPException(
            status_code=503, detail="Server HTTP client pool uninitialized"
        )
    try:
        req = shared_http_client.build_request("GET", SUPABASE_3DMODEL_URL)
        res = await shared_http_client.send(req, stream=True)
        return StreamingResponse(
            res.aiter_raw(),
            status_code=res.status_code,
            media_type="model/gltf-binary",
            headers={
                "Cache-Control": "public, max-age=86400",
                "Access-Control-Allow-Origin": "*",
            },
            background=res.aclose,
        )
    except Exception as e:
        logger.error(f"Error streaming 3D model from Supabase: {e}")
        raise HTTPException(status_code=502, detail="Failed to retrieve 3D model")


@app.get("/api/assets/image.png")
async def get_private_image():
    if not SUPABASE_IMAGE_URL:
        logger.error("SUPABASE_IMAGE_URL not configured on server")
        raise HTTPException(
            status_code=500, detail="Image URL not configured on server"
        )
    if not shared_http_client:
        raise HTTPException(
            status_code=503, detail="Server HTTP client pool uninitialized"
        )
    try:
        req = shared_http_client.build_request("GET", SUPABASE_IMAGE_URL)
        res = await shared_http_client.send(req, stream=True)
        return StreamingResponse(
            res.aiter_raw(),
            status_code=res.status_code,
            media_type="image/png",
            headers={
                "Cache-Control": "public, max-age=86400",
                "Access-Control-Allow-Origin": "*",
            },
            background=res.aclose,
        )
    except Exception as e:
        logger.error(f"Error streaming image from Supabase: {e}")
        raise HTTPException(status_code=502, detail="Failed to retrieve image asset")


# ================= CHAT ENDPOINT =================
@app.post("/api/chat")
async def chat(request: ChatRequest):
    user_query = request.message.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    pronoun_words = {
        "it",
        "that",
        "this",
        "they",
        "them",
        "its",
        "why",
        "how",
        "more",
        "and",
    }
    query_words = set(user_query.lower().split())

    search_query = user_query
    if request.history and (
        query_words.intersection(pronoun_words) or len(query_words) <= 2
    ):
        last_user_query = next(
            (m.content for m in reversed(request.history) if m.role == "user"), ""
        )
        if last_user_query:
            search_query = f"{last_user_query} {user_query}"

    context = retrieve_context(search_query, n_results=3)
    live_music_status = get_live_music_context()

    chunks_count = len(context.split("---")) if context else 0
    logger.info(
        f"\n{'=' * 20} 💬 RAG QUERY LOG {'=' * 20}\n"
        f"User Asked:   '{user_query}'\n"
        f"Search Query: '{search_query}'\n"
        f"Live Music:   '{live_music_status}'\n"
        f"Chunks Found: {chunks_count}\n"
        f"{'=' * 55}"
    )

    messages = [{"role": "system", "content": STRICT_RAG_PROMPT}]
    for msg in request.history[-4:]:
        messages.append({"role": msg.role, "content": msg.content})

    grounded_turn = f"""[LIVE MUSIC STATUS]:
{live_music_status}

[RETRIEVED CONTEXT]:
{context}

[USER QUESTION]:
{user_query}"""

    messages.append({"role": "user", "content": grounded_turn})

    def stream_generator():
        try:
            stream = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=messages,
                temperature=0.4,
                max_tokens=400,
                stream=True,
            )
            for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            logger.error(f"Groq Stream Error: {e}")
            yield "\n\nI'm having a brief connection glitch. Please reach out to Rahul directly via email or LinkedIn!"

    return StreamingResponse(
        stream_generator(),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
