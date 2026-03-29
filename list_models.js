require('dotenv').config({ path: __dirname + '/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("test");
        console.log("Gemini-pro works");
    } catch (e) {
        console.log("Gemini-pro failed:", e.message);
    }
}
main();
