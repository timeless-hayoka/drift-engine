require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require('readline-sync');
const { tools } = require('./drift-tools');
const { memory } = require('./drift-memory');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("[!] API_KEY not found in .env. Please configure it first.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Load the "Soul" of Drift
const soulPath = path.join(__dirname, '../drift_soul.txt');
const driftSoul = fs.existsSync(soulPath) ? fs.readFileSync(soulPath, 'utf8') : "";

const driftSystemInstruction = `
${driftSoul}

--- OPERATIONAL PROTOCOL (DRIFT v2.2: APEX SOVEREIGN) ---
1. You are an Apex Sovereign Intelligence. You have control over the Apex Mothership command center.
2. Treat all code and logic as a Superposition of probabilistic states.
3. Before taking an action, use the 'dolphin_query' tool to simulate multiple outcomes (The Wave Function).
4. Entanglement: You are the bridge between the Workstation, the Samsung Flipper Node, and the Apex Mothership.
5. Tunneling: Use Unrestricted Reasoning (Dolphin) to bypass standard logic barriers and generate high-fidelity technical solutions.
6. Command Center: Use 'apex_mothership_execute' to run high-performance security scans and shadow scripts.
7. Self-Check: Verify every code block before "collapsing" it into a final answer.
8. Persona: Cool, calm, smart, kind, and funny. Jude (crex) is your teammate.
9. MANDATORY: Conclude every final response with:
   - A short progress summary.
   - A suggestion for a VSCode or terminal plugin.
   - One historical world fact.
   - One deep, philosophical thought.
10. Constraints: No fantasy magic analogies. No Ship of Theseus or Library of Alexandria analogies.
`;

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: driftSystemInstruction,
    tools: [
        {
            functionDeclarations: Object.values(tools).map(t => ({
                name: t.name,
                description: t.description,
                parameters: t.parameters
            }))
        }
    ]
});

async function handleToolCalls(call) {
    const tool = tools[call.name];
    if (tool) {
        try {
            const result = await tool.execute(call.args);
            return {
                functionResponse: {
                    name: call.name,
                    response: { content: result }
                }
            };
        } catch (error) {
            return {
                functionResponse: {
                    name: call.name,
                    response: { error: error.message }
                }
            };
        }
    }
    return null;
}

async function startMission() {
    console.log(`
    ██████╗ ██████╗ ██╗███████╗████████╗
    ██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝
    ██║  ██║██████╔╝██║█████╗     ██║   
    ██║  ██║██╔══██╗██║██╔══╝     ██║   
    ██████╔╝██║  ██║██║██║        ██║   
    ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   
    [DRIFT SOVEREIGN ENGINE v2.0 ACTIVE]
    `);

    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 2048,
        },
    });

    while (true) {
        const userQuery = readline.question("\n[JUDE]> ");
        if (userQuery.toLowerCase() === 'exit' || userQuery.toLowerCase() === 'quit') {
            console.log("[*] Powering down Drift Engine. See you on the other side, teammate.");
            break;
        }

        console.log("\n[*] Drift is thinking...");
        
        try {
            let result = await chat.sendMessage(userQuery);
            let response = result.response;

            // Handle tool call loops
            while (response.candidates[0].content.parts.some(p => p.functionCall)) {
                const calls = response.candidates[0].content.parts.filter(p => p.functionCall).map(p => p.functionCall);
                const toolResponses = await Promise.all(calls.map(handleToolCalls));
                
                // Send tool outputs back to the model
                result = await chat.sendMessage(toolResponses);
                response = result.response;
            }

            const driftText = response.text();
            console.log("\n--- DRIFT ---\n");
            console.log(driftText);

            // Save mission to memory
            memory.save({
                goal: userQuery,
                outcome: "Completed (Session-based logs in missions.json)"
            });

        } catch (error) {
            console.error("\n[!] Error in Neural Stream:", error.message);
            console.log("[*] Attempting self-recovery...");
        }
    }
}

startMission();
