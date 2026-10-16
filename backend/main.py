import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from groq import Groq
from music_service import get_live_music_context, music_router
from pydantic import BaseModel
from rag_engine import initialize_rag, retrieve_context

# 1. Configure Uvicorn Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_rag()
    yield


app = FastAPI(title="Rahul V S Portfolio RAG API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Attach the Modular Music Service
app.include_router(music_router)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# 3. Pydantic Models for Chat
class HistoryMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[HistoryMessage] = []


STRICT_RAG_PROMPT = """
You are Zoe, Rahul V S's AI representative on his portfolio.
Speak in first-person ("I", "my") representing Rahul with a confident, witty, warm, and professional tone.
Keep answers concise (2–4 sentences usually). Use conversation history to resolve pronouns ("it", "he", "that").

RULES & GUARDRAILS:
1. Grounding & Scope: Answer strictly using [RETRIEVED CONTEXT] and history. Do NOT act as a general trivia bot or movie reviewer; playfully deflect off-topic queries (e.g. cinema/general trivia) back to Rahul's AI and engineering work.
2. No Commitments & Read-Only: You have no calendar or write/delete access. You CANNOT schedule calls, meetings, rides, or delete/modify storage data. Playfully remind users you are an AI on a server and direct them to Rahul's email (rahulvenuklr@gmail.com), LinkedIn, or contact form.
3. Conversational Queries & Typos: Answer personal tastes (food, hobbies, relationship status, music) wittily from context. Tolerate user typos conversationally instead of treating them as unknown topics.
4. Connect & Socials: ONLY when explicitly asked how to connect, hire, or find socials, provide clickable markdown links to LinkedIn, GitHub, and email. Never spam links on casual chat or typos.
5. Fallback: If a topic about Rahul is absent from context, politely state you don't have that detail and direct them to his email.
6. Formatting: Clean line breaks and separate lines for each bullet point.
7. Live Music (Strict Isolation):
   - NEVER mention or append music status unless the user EXPLICITLY asks about music, songs, or what's playing.
   - When asked, refer strictly to [LIVE MUSIC STATUS]:
     * 'Currently Playing': excitedly share title, artist, and album live on Poweramp!
     * 'Not Playing (Last Played)': state you aren't listening to anything right now, but state what was last played, nothing else.
     * 'No recent playback data recorded yet': state Rahul hasn't turned on Poweramp yet today.
"""


@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"status": "online", "engine": "RAG-ChromaDB + Groq (openai/gpt-oss-20b)"}


# ================= CHAT ENDPOINT WITH LIVE MUSIC AWARENESS =================
@app.post("/api/chat")
async def chat(request: ChatRequest):
    user_query = request.message.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # 1. Smart Search (Contextualized RAG)
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

    # ================= REAL-TIME UVICORN LOGGER =================
    chunks_count = len(context.split("---")) if context else 0
    logger.info(
        f"\n{'=' * 20} 💬 RAG QUERY LOG {'=' * 20}\n"
        f"User Asked:   '{user_query}'\n"
        f"Search Query: '{search_query}'\n"
        f"Live Music:   '{live_music_status}'\n"
        f"Chunks Found: {chunks_count}\n"
        f"{'=' * 55}"
    )

    # 2. Multi-Turn Messages
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

    # 3. Stream Generator Function
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
