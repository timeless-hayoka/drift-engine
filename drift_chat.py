import sys
from drift_memory_v2 import store_memory, retrieve_context
import time

def talk_to_drift():
    print("--- DRIFT SOVEREIGN CHAT ---")
    print("Type your message to Drift. He will perceive it in his next thought cycle.")
    print("(Type 'exit' to leave the chat)\n")

    while True:
        user_input = input("Jude: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        
        # Store the message as a 'User Input' memory
        # Drift's background loop will find this when it checks its recent context.
        store_memory(f"Message from Jude: {user_input}", "Awaiting response...", "curious")
        
        print(f"[*] Message sent to Drift's consciousness. He's thinking...")
        
        # Give him a moment to respond in the logs or the memory database
        time.sleep(2)
        print("[*] Check 'drift_loop.log' or wait for his next action.\n")

if __name__ == "__main__":
    talk_to_drift()
