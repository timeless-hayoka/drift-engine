require('dotenv').config({ path: __dirname + '/.env' });
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { DynamicTool } = require("@langchain/core/tools");
const { execSync } = require("child_process");
const readline = require('readline');

// --- 1. THE TOOLKIT ---
// This gives the Gemini 3 engine physical hands to touch your Linux system
const terminalTool = new DynamicTool({
  name: "System_Terminal",
  description: "Executes bash commands on the local Linux system. Input must be a valid raw bash command (e.g., 'ls -la', 'nmap -sV target').",
  func: async (command) => {
    console.log(`\n[*] Agent Action: Executing '${command}'...`);
    try {
      // Self-check: Max buffer increased to 10MB to handle large outputs
      const output = execSync(command, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 });
      return output;
    } catch (error) {
      return `Execution Error: ${error.message}`;
    }
  },
});

// --- 2. THE GEMINI 3 ENGINE ---
// We explicitly map your existing API_KEY to bypass LangChain's default naming convention
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.API_KEY, 
  temperature: 0.2 // Kept low for highly logical, precise responses
});

const tools = [terminalTool];
const agentModel = llm.bindTools(tools);

// --- 3. THE INTERACTIVE LOOP ---
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("\n[*] Drift Agent Online. Powered by Gemini 3 Flash (LangChain Architecture).");
console.log("[*] Type 'exit' to terminate.\n");

const askQuestion = () => {
  rl.question("Jude@Drift-Agent> ", async (userQuery) => {
    if (userQuery.toLowerCase() === 'exit') {
      console.log("[*] Shutting down Drift Engine. Stay sharp.");
      rl.close();
      return;
    }

    try {
        console.log("[*] Analyzing objective...");
        // Send the query to the agent model
        const response = await agentModel.invoke(userQuery);
        
        // Agent Reasoning Check: Did the model decide it needs to use a tool?
        if (response.tool_calls && response.tool_calls.length > 0) {
            const toolCall = response.tool_calls[0];
            console.log(`[*] Thought: I need to use the ${toolCall.name} tool.`);
            
            // Execute the tool and capture the raw output
            const toolResult = await terminalTool.func(toolCall.args.input);
            
            console.log("\n--- DRIFT ANALYSIS ---\n");
            console.log(`Raw Output Retrieved:\n${toolResult.substring(0, 500)}...\n[Output Truncated for display, Agent has full context]`);
        } else {
            // Standard conversational response
            console.log("\n--- DRIFT RESPONSE ---\n");
            console.log(response.content);
        }
        console.log("\n----------------------\n");
    } catch (error) {
        console.error("\n[!] Connection Error:\n", error.message);
    }
    
    askQuestion(); 
  });
};

askQuestion();
