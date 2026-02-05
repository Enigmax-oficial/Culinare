
import { GoogleGenAI } from "@google/genai";

// Fix: Updated GoogleGenAI initialization to follow strict naming and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChefAdvice = async (recipeTitle: string, question: string) => {
  try {
    // Fix: Using the standardized 'ai' client name to call generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto: Estou preparando a receita "${recipeTitle}". Pergunta: ${question}`,
      config: {
        systemInstruction: "Você é um Chef Profissional amigável. Dê dicas curtas, práticas e entusiasmadas sobre culinária."
      }
    });
    // Fix: Access .text property directly as per the property definition in the SDK
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Desculpe, o Chef está ocupado no momento. Tente novamente mais tarde!";
  }
};
