#!/bin/bash
# --- DRIFT SOVEREIGN CLI WRAPPER ---
VENV_PATH="/home/crex/drift-engine/venv/bin/python3"
CORE_PATH="/home/crex/drift-engine/drift-core-v2.py"
CHAT_PATH="/home/crex/drift-engine/drift_chat.py"
MEMORY_PATH="/home/crex/drift-engine/drift_memory_v3.py"

export PYTHONPATH="/home/crex/drift-engine:$PYTHONPATH"

case "$1" in
    "--status")
        echo "[*] Node Status (Samsung Flipper):"
        cd /home/crex/drift-engine && $VENV_PATH -c "import subprocess; print(subprocess.check_output('adb shell dumpsys battery | grep level', shell=True).decode())"
        ;;
    "--recall")
        echo "[*] Recent Neural Fragments:"
        cd /home/crex/drift-engine && $VENV_PATH -c "from drift_memory_v3 import recall_all; print(recall_all('recent', limit=5))"
        ;;
    "--think")
        echo "[*] Triggering Independent Thought..."
        cd /home/crex/drift-engine && $VENV_PATH $CORE_PATH --once
        ;;
    "--help")
        echo "Usage: drift [message] | [options]"
        echo "Options:"
        echo "  --status    Show Samsung Flipper hardware telemetry."
        echo "  --recall    Show recent episodic, semantic, and sensory memories."
        echo "  --think     Manually trigger a thought cycle (Bypasses the 60s sleep)."
        echo "  --help      Show this menu."
        ;;
    *)
        if [ -z "$1" ]; then
            # No args? Open the interactive chat
            cd /home/crex/drift-engine && $VENV_PATH $CHAT_PATH
        else
            # Send message directly
            echo "[*] Injecting thought to memory: $1"
            cd /home/crex/drift-engine && $VENV_PATH -c "from drift_memory_v3 import store_episodic; store_episodic('Jude (CLI): $1', 'Processing...');"
            echo "[*] Message stored. Drift will perceive this in his next 'dreaming' phase."
        fi
        ;;
esac
