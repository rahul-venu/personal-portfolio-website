import base64
import os
import re

import chromadb

# Initialize In-Memory Vector Database
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="rahul_portfolio_kb")


def get_raw_profile_content() -> str:
    """Fetches profile text securely: checks cloud environment variable first,
    then local private file, then public example template."""
    # 1. Cloud Production: Decodes secret environment variable
    b64_env = os.getenv("PROFILE_MD_BASE64")
    if b64_env:
        try:
            return base64.b64decode(b64_env).decode("utf-8")
        except Exception as e:
            print(f"Error decoding PROFILE_MD_BASE64: {e}")

    # 2. Local Development: Reads private local markdown file
    local_path = os.path.join(os.path.dirname(__file__), "data", "rahul_profile.md")
    if os.path.exists(local_path):
        with open(local_path, "r", encoding="utf-8") as f:
            return f.read()

    # 3. Public Template Fallback
    example_path = os.path.join(
        os.path.dirname(__file__), "data", "rahul_profile.example.md"
    )
    if os.path.exists(example_path):
        with open(example_path, "r", encoding="utf-8") as f:
            return f.read()

    return ""


def load_and_chunk_document():
    """Chunks profile text logically by H2 (##) and H3 (###) headers (<200 tokens)."""
    content = get_raw_profile_content()
    if not content:
        print("Warning: No profile content available to chunk.")
        return []

    raw_sections = re.split(r"\n(?=#{2,3}\s)", content)
    chunks = []

    for i, section in enumerate(raw_sections):
        cleaned = section.strip()
        if cleaned and len(cleaned) > 25:
            chunks.append({"id": f"chunk_{i}", "text": cleaned})

    return chunks


def initialize_rag():
    """Embeds and indexes all knowledge base chunks on server boot."""
    chunks = load_and_chunk_document()
    if not chunks:
        print("No chunks to index.")
        return

    if collection.count() == 0:
        ids = [c["id"] for c in chunks]
        documents = [c["text"] for c in chunks]

        collection.add(ids=ids, documents=documents)
        print(
            f"Successfully indexed {len(chunks)} knowledge base chunks into ChromaDB."
        )


def retrieve_context(user_query: str, n_results: int = 3) -> str:
    """Performs semantic similarity search to extract relevant context."""
    if collection.count() == 0:
        return ""

    results = collection.query(
        query_texts=[user_query], n_results=min(n_results, collection.count())
    )

    retrieved_docs = results.get("documents", [[]])[0]
    return "\n\n---\n\n".join(retrieved_docs)
