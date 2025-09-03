import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function processImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string | null> {
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    console.warn("No image data found in Gemini response.");
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process image due to an API error.");
  }
}

export async function restorePhoto(base64ImageData: string, mimeType: string): Promise<string | null> {
  const prompt = 'Restore this old, damaged photograph. Enhance clarity, fix scratches and tears, correct color fading, and improve the overall quality to look natural and realistic. Do not add, remove or change the original content of the image, just restore its quality. Return only the restored image.';
  return processImage(base64ImageData, mimeType, prompt);
}

export async function colorizePhoto(base64ImageData: string, mimeType: string): Promise<string | null> {
    const prompt = 'Colorize this black and white photograph. Apply realistic and historically appropriate colors. Ensure the final image looks natural. Do not add, remove or change the original content of the image, just add color. Return only the colorized image.';
    return processImage(base64ImageData, mimeType, prompt);
}

export async function removeScratches(base64ImageData: string, mimeType: string): Promise<string | null> {
  const prompt = 'Meticulously remove all scratches, dust, and physical blemishes from this photograph. It is crucial that you do not alter the underlying image, its colors, or its sharpness. Focus exclusively on repairing the physical damage. Return only the repaired image.';
  return processImage(base64ImageData, mimeType, prompt);
}
