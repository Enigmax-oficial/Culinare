
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

/**
 * Gera uma imagem apetitosa para a receita baseada no título e descrição.
 */
export const generateRecipeImage = async (title: string, description: string) => {
  try {
    const prompt = `Uma fotografia profissional de gastronomia, estilo gourmet, do prato: "${title}". Descrição: ${description}. Iluminação de estúdio, alta resolução, 4k, apetitoso, fundo desfocado, apresentação impecável.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Erro na geração de imagem:", error);
    return null;
  }
};
