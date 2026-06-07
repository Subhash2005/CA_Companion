import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(request: any, response: any) {
  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { base64, mimeType, prompt } = request.body;

    if (!base64 || !mimeType || !prompt) {
      return response.status(400).json({ error: "Missing required fields" });
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
      return response.status(200).json(parsedData);
    } catch (parseError) {
      console.warn("Gemini did not return valid JSON. Raw text:", responseText);
      return response.status(200).json({
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
      });
    }
  } catch (error: any) {
    console.error("API Route Gemini Error:", error);
    return response.status(500).json({ error: error.message || "Failed to process document" });
  }
}
