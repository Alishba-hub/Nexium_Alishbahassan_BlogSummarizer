import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // for src-based setup

const API_KEY = process.env.OPENROUTER_API_KEY!;
const MODEL = "google/gemma-3-27b-it:free"; // ✅ working free model

async function callOpenRouter(prompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  return (
    data.choices?.[0]?.message?.content ||
    data.error?.message ||
    "❌ No response from OpenRouter"
  );
}

// 🔹 Summarizes blog text in English
export async function generateSummaryWithGemini(text: string): Promise<string> {
  const prompt = `Summarize the following in short blog content in English:\n\n${text}`;
  return await callOpenRouter(prompt);
}

// 🔹 Translates English summary into Urdu
export async function translateToUrduWithGemini(text: string): Promise<string> {
  const prompt = `Translate this to PURE URDU (no English words and no roman urdu). 
  Rules:
  1. Use SIMPLE, SHORT sentences
  2. Keep under 5-15 lines max
  3. Avoid technical jargon
  4. Use common Urdu words only
  
  Text:${text}`;
  return await callOpenRouter(prompt);
}
