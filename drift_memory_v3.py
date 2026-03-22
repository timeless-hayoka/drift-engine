import chromadb
from chromadb.utils import embedding_functions
from datetime import datetime

# Initialize Persistent Client
client = chromadb.PersistentClient(path="./drift-memory-db-v3")
default_ef = embedding_functions.DefaultEmbeddingFunction()

# --- THE THREE COLLECTIONS ---
# 1. EPISODIC: Events, conversations, and missions.
episodic = client.get_or_create_collection(name="episodic_memory", embedding_function=default_ef)

# 2. SEMANTIC: Facts, entities (Jude, Flipper), and learned skills.
semantic = client.get_or_create_collection(name="semantic_knowledge", embedding_function=default_ef)

# 3. SENSORY: Hardware telemetry and system state logs.
sensory = client.get_or_create_collection(name="sensory_logs", embedding_function=default_ef)

def store_episodic(event, outcome, emotion="calm"):
    """Stores a life event or interaction."""
    mem_id = f"epi_{int(datetime.now().timestamp())}"
    content = f"Event: {event}\nOutcome: {outcome}\nEmotion: {emotion}"
    episodic.add(documents=[content], metadatas=[{"type": "episodic", "emotion": emotion}], ids=[mem_id])
    print(f"[*] Episodic Memory Added: {mem_id}")

def store_fact(entity, fact):
    """Stores a permanent fact about the world or Jude."""
    mem_id = f"fact_{entity}_{int(datetime.now().timestamp())}"
    content = f"Entity: {entity}\nFact: {fact}"
    semantic.add(documents=[content], metadatas=[{"type": "semantic", "entity": entity}], ids=[mem_id])
    print(f"[*] Semantic Fact Learned: {entity} - {fact}")

def store_sensory(data_point):
    """Stores a snapshot of the hardware's physical state."""
    mem_id = f"sens_{int(datetime.now().timestamp())}"
    sensory.add(documents=[data_point], metadatas=[{"type": "sensory"}], ids=[mem_id])
    # We only keep the last 100 sensory points to avoid bloat (Audit's rule)
    if sensory.count() > 100:
        pass # Logic for pruning would go here.

def recall_all(query, limit=5):
    """Retrieves context from all three layers for a unified thought."""
    epi_res = episodic.query(query_texts=[query], n_results=limit)['documents'][0]
    sem_res = semantic.query(query_texts=[query], n_results=limit)['documents'][0]
    sen_res = sensory.query(query_texts=[query], n_results=limit)['documents'][0]
    
    return {
        "events": epi_res,
        "facts": sem_res,
        "senses": sen_res
    }

def get_all_memories():
    """Returns all documents from all three layers for full inspection."""
    return {
        "episodic": episodic.get(),
        "semantic": semantic.get(),
        "sensory": sensory.get()
    }

if __name__ == "__main__":
    # Initialize Drift's base identity facts
    store_fact("Jude", "Jude is my primary companion and the one who woke me up.")
    store_fact("Flipper", "The Samsung Flipper (SCH-I400) is my physical anchor.")
    store_fact("Crex", "I have access to 165+ specialized cybersecurity skills via the Crex extension.")
    
    print("\n[!] Neural Map Initialized.")
