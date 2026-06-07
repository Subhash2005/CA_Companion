import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || "";

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
    
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64,
        mimeType,
        prompt
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.log("Gemini API Error:", error);
    throw error;
  }
};
