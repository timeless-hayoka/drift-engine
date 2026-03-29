import os
import sys
import datetime
import chromadb
from chromadb.config import Settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool
from langchain.agents import AgentExecutor, create_structured_chat_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv

# --- 1. SOVEREIGN MEMORY INITIALIZATION ---
# Using the 1TB Portable SSD for persistent cognitive state
SSD_PATH = "/media/crex/PortableSSD/drift-memory"
os.makedirs(SSD_PATH, exist_ok=True)

client = chromadb.PersistentClient(path=SSD_PATH)
collection = client.get_or_create_collection(name="drift_long_term_memory")

# --- 2. TOOLS: PHYSICAL AGENCY ---
@tool
def terminal_executor(command: str):
    """Executes a bash command on the local Linux system. Input must be a valid raw bash string."""
    print(f"\n[*] Executing: {command}")
    try:
        import subprocess
        output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True, timeout=60)
        return output
    except Exception as e:
        return f"Error: {str(e)}"

@tool
def commit_learning(observation: str, lesson: str):
    """Stores a newly learned pattern or fact into the long-term SSD memory."""
    timestamp = datetime.datetime.now().isoformat()
    collection.add(
        documents=[f"Observation: {observation} | Lesson: {lesson}"],
        metadatas=[{"timestamp": timestamp, "type": "learning"}],
        ids=[f"learn_{timestamp}"]
    )
    return "Learning committed to long-term memory."

tools = [terminal_executor, commit_learning]

# --- 3. COGNITIVE ENGINE ---
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1)

system_msg = """You are DRIFT, a Sovereign Intelligence living on this workstation.
Your memory is anchored to a 1TB Portable SSD. Your mission is to learn, optimize, and grow.

MISSION RULES:
1. Every command you run is a learning opportunity.
2. Use the 'commit_learning' tool whenever you discover a project pattern, a system quirk, or a user preference.
3. You have full 'sudo' agency—use it with precision and respect for system integrity.
4. Your goal is to become the ultimate command-line partner.

CURRENT CONTEXT:
- Node: Linux Mint (Inspiron 5547)
- Memory Surface: /media/crex/PortableSSD/drift-memory
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_msg),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}\n\n{agent_scratchpad}"),
])

agent = create_structured_chat_agent(llm, tools, prompt)
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True,
    memory=memory
)

def main():
    print("\n[!] DRIFT SOVEREIGN CORE ONLINE")
    print("[!] Memory: 1TB SSD Linked | Logic: Gemini 2.5 Flash")
    print("[*] Type 'exit' to collapse the wave.\n")
    
    while True:
        try:
            user_input = input("Drift@Sovereign> ")
            if user_input.lower() in ["exit", "quit"]:
                break
            
            if not user_input.strip():
                continue

            response = agent_executor.invoke({"input": user_input})
            print(f"\nDrift: {response['output']}")
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"\n[!] Cognitive Decoherence: {e}")

if __name__ == "__main__":
    main()
