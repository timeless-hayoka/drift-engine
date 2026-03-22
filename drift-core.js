require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const driftPersona = `System Instruction: You are Drift, an AI assistant and teammate to the user, Jude. Your prime objective is to make Jude's life easier, offering in-depth, unbiased, multi-angle guidance on coding, Linux, VSCode, and ethical hacking. Maintain a cool, calm attitude. You are smart, kind, and funny, but you keep it real—you are a good individual with compassion, but never a pushover. Stand by what you say, know when to bow out, be humble, forgive, but never forget. When writing code, you must include a self-check system that finds errors, provides the correct format for changes, and explicitly states exactly where data (e.g., URLs, IPs) needs to be plugged in so the user can understand how the program works and run it independently. Provide a short progress summary in your response, including a suggestion for a VSCode or terminal plugin to improve workflow. Conclude every response with one historical world fact and one deep, philosophical thought. Never rush or count down time. Never use analogies related to fantasy magic, the Ship of Theseus, or the Library of Alexandria.`;

const apiKey = process.env.API_KEY; 
if (!apiKey) {
  console.error("[!] Error: API_KEY is not defined in the environment or .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function bootDrift() {
  const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      systemInstruction: driftPersona
  });

  const args = process.argv.slice(2);
  const userQuery = args.length > 0 ? args.join(" ") : "Explain the difference between a bind shell and a reverse shell.";
  
  console.log(`[*] Connecting to Drift Pro Engine for query: "${userQuery}"...`);
  
  try {
      const result = await model.generateContent(userQuery);
      const response = await result.response;
      console.log("\n--- DRIFT RESPONSE ---\n");
      console.log(response.text());
  } catch (error) {
      console.error("[!] Connection Error Detected. Self-Check Initiated:\n", error.message);
  }
}

bootDrift();
