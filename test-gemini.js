import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "testing_fake_key_1234567890";
const genAI = new GoogleGenerativeAI(apiKey);

async function testKey() {
  console.log("Testing API Key...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you there?");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("Flash error:", error.message);
  }

  try {
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await embeddingModel.embedContent("Hello");
    console.log("Embedding successful, length:", result.embedding.values.length);
  } catch (error) {
    console.error("Embedding error:", error.message);
  }
}

testKey();
