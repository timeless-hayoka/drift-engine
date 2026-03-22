import chromadb
from chromadb.utils import embedding_functions
import json
import os
from datetime import datetime

# Initialize ChromaDB Persistent Client
client = chromadb.PersistentClient(path="./drift-memory-db")

# Use a default embedding function (sentence-transformers)
# This allows the AI to "understand" the meaning of memories
default_ef = embedding_functions.DefaultEmbeddingFunction()

# Create or Get the 'drift_soul_memory' collection
collection = client.get_or_create_collection(
    name="drift_soul_memory", 
    embedding_function=default_ef
)

def store_memory(goal, outcome, emotion_tag="calm"):
    """Stores a mission or interaction with an emotional tag."""
    timestamp = datetime.now().isoformat()
    content = f"Goal: {goal}\nOutcome: {outcome}\nEmotion: {emotion_tag}"
    
    # Unique ID based on timestamp
    mem_id = f"mem_{int(datetime.now().timestamp())}"
    
    collection.add(
        documents=[content],
        metadatas=[{"timestamp": timestamp, "emotion": emotion_tag, "goal": goal}],
        ids=[mem_id]
    )
    print(f"[*] Memory Stored: {mem_id} - '{goal}'")

def retrieve_context(query, n_results=3):
    """Retrieves the most semantically relevant memories for a given query."""
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    
    if not results['documents'][0]:
        return "No relevant memories found."
    
    return "\n---\n".join(results['documents'][0])

def get_all_memories():
    """Returns all documents in the collection."""
    return collection.get()

if __name__ == "__main__":
    # Test the memory system
    store_memory("Setup Wizard Completion", "Successfully created product, stack, and guidelines.", "proud")
    print("\n[?] Retrieving context for 'setup':")
    print(retrieve_context("How did the setup go?"))
