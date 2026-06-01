import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || ""; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeDocumentWithGemini = async (fileUri: string, mimeType: string, prompt: string, webFile?: any) => {
  try {
    let base64 = '';

    if (Platform.OS === 'web') {
      if (webFile) {
        // Use FileReader for web if the File object is available
        base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(webFile);
        });
      } else {
        // Fallback if no File object but we have a blob URL
        const response = await fetch(fileUri);
        const blob = await response.blob();
        base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } else {
      // Native (iOS/Android)
      base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
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
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.warn("Gemini did not return valid JSON. Raw text:", responseText);
      return {
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
      };
    }
  } catch (error) {
    console.log("Gemini API Error:", error);
    throw error;
  }
};
