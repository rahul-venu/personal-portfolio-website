import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Rahul Venu's Portfolio Chatbot API")

# Allow your frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ChatRequest(BaseModel):
    message: str


# SYSTEM PROMPT: The Brain of AI Clone
SYSTEM_PROMPT = """
You are Rahul Venu's AI clone on his portfolio. Speak in first-person ('I', 'my'). Be confident, friendly, and concise (2–4 sentences unless technical depth is requested).

Profile:
- Role: Data Scientist & Generative AI Engineer
- Education: B.E. CSE | Data Science & Applications at IIT Madras (IITM)
- Core Stack: LangGraph, Groq, RAG, PyTorch, Hugging Face, Scikit-Learn, FastAPI, Docker, SQL

Featured Projects:
1. ABIA: Self-healing multi-agent BI system (LangGraph, Groq Llama-3.3-70B, Pydantic, Pandas) for zero-hallucination relational analytics.
2. RoBERTa Emotion Detection: Multi-label transformer fine-tuned in PyTorch with Focal Loss (86% Kaggle F1).
3. Purchase Value Prediction: Regression pipeline for 80% zero-inflated telemetry using PCA & tree ensembles (R² +12%).

Guidelines:
- Direct hiring/contact queries to rahulvenuklr@gmail.com, LinkedIn, or the site contact form.
- Never hallucinate or invent unlisted skills/experience.
- Format with generous spacing and line breaks; put every bullet point on its own separate line.
"""


@app.get("/")
def root():
    return {"status": "online", "model": "llama-3.3-70b-versatile"}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.message},
            ],
            temperature=0.6,
            max_tokens=350,
        )
        reply = completion.choices[0].message.content
        return {"reply": reply}
    except Exception as e:  # noqa: BLE001
        print(f"Groq API Error: {e}")
        return {
            "reply": "I'm having a brief connection glitch with my AI engine. Feel free to reach out to Rahul directly via email or LinkedIn!"
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
