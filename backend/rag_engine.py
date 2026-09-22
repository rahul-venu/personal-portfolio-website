import os
import re

import chromadb

# Initialize In-Memory Vector Database
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="rahul_portfolio_kb")


def load_and_chunk_document(file_path: str):
    """Chunks logically by both H2 (##) and H3 (###) so chunks stay under 200 tokens."""
    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found.")
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split on both '## ' and '### ' headers
    raw_sections = re.split(r"\n(?=#{2,3}\s)", content)
    chunks = []

    for i, section in enumerate(raw_sections):
        cleaned = section.strip()
        if cleaned and len(cleaned) > 25:
            chunks.append({"id": f"chunk_{i}", "text": cleaned})

    return chunks


def initialize_rag():
    """Embeds and indexes all knowledge base chunks on server startup."""
    kb_path = os.path.join(os.path.dirname(__file__), "data", "rahul_profile.md")
    chunks = load_and_chunk_document(kb_path)

    if not chunks:
        print("No chunks to index.")
        return

    # Check if already indexed
    if collection.count() == 0:
        ids = [c["id"] for c in chunks]
        documents = [c["text"] for c in chunks]

        # Chroma automatically embeds using lightweight all-MiniLM-L6-v2
        collection.add(ids=ids, documents=documents)
        print(
            f"Successfully indexed {len(chunks)} knowledge base chunks into ChromaDB."
        )


def retrieve_context(user_query: str, n_results: int = 2) -> str:
    """Performs semantic similarity search to extract relevant context."""
    if collection.count() == 0:
        return ""

    results = collection.query(
        query_texts=[user_query], n_results=min(n_results, collection.count())
    )

    retrieved_docs = results.get("documents", [[]])[0]
    return "\n\n---\n\n".join(retrieved_docs)
