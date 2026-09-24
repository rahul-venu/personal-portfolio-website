import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

    # 1. Smart Search (Avoids Query Pollution)
    # Only attach previous turn if the user query is an ambiguous follow-up
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

    # 2. Retrieve Top 4 Chunks (Zero latency penalty, massive context safety)
    context = retrieve_context(search_query, n_results=4)

    # DEBUG LOGS: Look at your VS Code terminal to see what ChromaDB found!
    print(f"\n{'=' * 20} RAG DEBUG {'=' * 20}")
    print(f"User Asked:   '{user_query}'")
    print(f"Search Query: '{search_query}'")
    print(f"Chunks Found: {len(context.split('---')) if context else 0}")
    print(f"{'=' * 50}\n")

    # 3. Construct Multi-Turn Messages Array
    messages = [{"role": "system", "content": STRICT_RAG_PROMPT}]

    # Inject last 4 messages for conversational continuity
    for msg in request.history[-4:]:
        messages.append({"role": msg.role, "content": msg.content})

    grounded_turn = f"""[RETRIEVED CONTEXT]:
{context}

[USER QUESTION]:
{user_query}"""

    messages.append({"role": "user", "content": grounded_turn})

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=messages,
            temperature=0.3,
            max_tokens=400,
        )
        reply = completion.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "reply": "I'm having a brief connection glitch with my AI engine. Feel free to reach out to Rahul directly via email or LinkedIn!"
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
