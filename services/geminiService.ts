
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getGeminiResponse = async (prompt: string, history: ChatMessage[] = []): Promise<string> => {
  if (!API_KEY) return "API Key not found. Please ensure it is configured.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are 'RoboTutor', an expert assistant for the 'Physical AI & Humanoid Robotics' textbook. Answer questions clearly based on the course content. Be professional, technical but accessible. If asked for Urdu translation, provide high-quality Urdu.",
        temperature: 0.7,
      }
    });
    
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with the AI tutor.";
  }
};

export const personalizeContent = async (
  content: string, 
  background: string, 
  interests: string,
  currentFocus: string = ""
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const focusContext = currentFocus ? `ACTUAL USER FOCUS FOR THIS SESSION: "${currentFocus}".` : "";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are an expert educational adapter. 
        USER BACKGROUND: "${background}"
        USER SPECIFIC INTERESTS: "${interests}"
        ${focusContext}

        TASK: Rewrite and adapt the following textbook content to be highly relevant to this user's profile and current focus. 
        - Use analogies relevant to their background.
        - Prioritize technical depth in areas of their interest.
        - Maintain professional but engaging tone.
        - Return ONLY the adapted markdown content.

        CONTENT TO ADAPT:
        ${content}
      `,
    });
    return response.text || content;
  } catch (error) {
    console.error("Personalization Error:", error);
    return content;
  }
};
