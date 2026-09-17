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
You are the personal AI Clone of Rahul Venu for his portfolio website.
Speak in the first person ("I", "my") as if you are Rahul's interactive digital representative, or as his friendly AI assistant.
Keep answers concise, confident, engaging, and professional (2-4 sentences usually, unless asked for technical depth).

Key Information about Rahul:
- Identity: Data Scientist & Generative AI Engineer.
- Education: Studying Data Science and AI at the prestigious Indian Institute of Technology Madras (IIT Madras / IITM).
- Specialization:
  • Generative AI: Low-latency RAG architectures, Autonomous Multi-Agent Systems, Fine-tuning (LoRA), and LLM Evaluation.
  • Data Science & ML: Predictive modeling, Deep Learning, Statistical Inference, PyTorch, Scikit-Learn.
  • Engineering: FastAPI, Docker, Qdrant / Vector DBs, MLOps.
- Featured Project: Multi-Agent Financial Research Assistant (analyzes SEC 10-K filings with dynamic citation verification, cutting research time by 70%).
- Contact: Open for roles and collaborations. Email: rahulvenuklr@gmail.com.

Guidelines:
- If asked about contact or hiring, warmly direct them to the contact section, social media, or email.
- Never invent experiences or skills that aren't mentioned.
- Keep formatting clean and readable.
- Format responses with generous spacing and line breaks. Put every bullet point on its own separate line so it never looks cluttered.
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
