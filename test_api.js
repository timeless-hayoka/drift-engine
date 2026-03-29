require('dotenv').config({ path: __dirname + '/.env' });
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

async function main() {
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash", // Use a safer model name for testing
        apiKey: process.env.API_KEY,
    });

    try {
        const response = await llm.invoke("Say 'API Connection Stable'");
        console.log(response.content);
    } catch (error) {
        console.error("API Error:", error.message);
    }
}
main();
