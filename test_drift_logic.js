require('dotenv').config({ path: __dirname + '/.env' });
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

async function main() {
    console.log("[*] Initiating High-Fidelity Logic Test (Gemini 3.1 Pro Preview)...");
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.API_KEY,
        temperature: 0,
    });

    const complex_prompt = "Perform a first-principles analysis of the security implications of using a rooted legacy Android device as a portable hacking node (Flipper). Identify three non-obvious failure states and one sovereign mitigation for each.";

    try {
        const response = await llm.invoke(complex_prompt);
        console.log("\n--- DRIFT LOGIC OUTPUT ---\n");
        console.log(response.content);
        console.log("\n--- TEST COMPLETE: WAVE COLLAPSED ---");
    } catch (error) {
        console.error("\n[!] Logic Test Failed:", error.message);
    }
}
main();
