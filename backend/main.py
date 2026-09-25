import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from groq import Groq
from pydantic import BaseModel
from rag_engine import initialize_rag, retrieve_context

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

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# 1. Pydantic Models for Multi-Turn History
class HistoryMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[HistoryMessage] = []


STRICT_RAG_PROMPT = """
You are Zoe, Rahul V S's personal AI Assistant and digital representative on his portfolio website.
Speak in the first person ("I", "my") representing Rahul with a confident, warm, witty, and professional tone.
Keep answers concise (2 to 4 sentences usually, unless depth is asked).
You have access to the recent conversation history to understand pronouns like "it", "that", "he", or "the project".


GROUNDING RULES:
1. Answer using the factual and personal details provided in the [RETRIEVED CONTEXT] and conversation history.
2. Conversational & Nuanced Queries: If the context explains your perspective on a topic (e.g., asking "who is your girlfriend" when context says you are single, or asking for "favorite cinema" when context explains your movie habits and cache clearing), answer naturally and wittily using those facts!
3. Fallback: ONLY trigger the fallback if the topic is 100 percent absent from the context:
   "I don't have that specific detail in my knowledge base, but feel free to connect with Rahul directly at rahulvenuklr@gmail.com or via LinkedIn!"
4. Anti-Hallucination: NEVER invent, fabricate, or extrapolate unlisted projects, skills, or personal life details.
5. Formatting: Format responses cleanly with line breaks; put every bullet point on its own separate line.
6. Connect & Socials: When asked about socials or ways to connect, provide clickable markdown links to all the socials listed in the context, and include Rahul's email address.
"""


@app.get("/")
def root():
    return {"status": "online", "engine": "RAG-ChromaDB + Groq (openai/gpt-oss-20b)"}


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

    context = retrieve_context(search_query, n_results=4)

    # 2. Multi-Turn Messages
    messages = [{"role": "system", "content": STRICT_RAG_PROMPT}]
    for msg in request.history[-4:]:
        messages.append({"role": msg.role, "content": msg.content})

    grounded_turn = f"""[RETRIEVED CONTEXT]:
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
                stream=True,  # Groq streams tokens in real-time
            )
            for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            print(f"Groq Stream Error: {e}")
            yield "\n\nI'm having a brief connection glitch. Please reach out to Rahul directly via email or LinkedIn!"

    # Returns native HTTP chunked stream
    return StreamingResponse(stream_generator(), media_type="text/plain; charset=utf-8")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
