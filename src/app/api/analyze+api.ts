import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64, mimeType, prompt } = body;

    if (!base64 || !mimeType || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: mimeType
        }
      }
    ]);
    
    const responseText = result.response.text();
    
    // Parse JSON from the markdown response safely
    try {
      const jsonStr = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsedData = JSON.parse(jsonStr);
      return new Response(JSON.stringify(parsedData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (parseError) {
      console.warn("Gemini did not return valid JSON. Raw text:", responseText);
      return new Response(JSON.stringify({
        // Fallback fields for all 3 screens so the app doesn't crash
        resultMsg: responseText,
        purpose: responseText,
        healthSummary: responseText,
        documentType: "Document Analysis",
        amount: "N/A",
        deadline: "N/A",
        healthScore: "N/A",
        currentRatio: "N/A",
        debtToEquity: "N/A",
        netProfitMargin: "N/A",
        importantDetails: ["The AI responded with plain text instead of structured data. See the main text for details."],
        actions: []
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error: any) {
    console.error("API Route Gemini Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process document" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
