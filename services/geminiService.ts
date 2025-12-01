
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the Google GenAI Client
// We use the environment variable as per standard secure practices for this environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * GENERATE TEXT
 * Uses Gemini 2.5 Flash for fast, intelligent text generation.
 */
export const generateText = async (prompt: string, systemInstruction?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Text Gen Error:", error);
    throw new Error("Failed to generate text.");
  }
};

/**
 * GENERATE IMAGE
 * Uses Gemini 2.5 Flash Image.
 */
export const generateImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });
    
    // Iterate through parts to find the image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("Failed to generate image.");
  }
};

/**
 * GENERATE AUDIO (TTS)
 * Uses Gemini 2.5 Flash TTS.
 */
export const generateAudio = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data generated");
    
    return base64Audio; // Return raw base64, caller handles formatting
  } catch (error) {
    console.error("Audio Gen Error:", error);
    throw new Error("Failed to generate audio.");
  }
};

/**
 * GENERATE VIDEO (Veo)
 * Uses Veo 3.1 Fast. Requires specific User API Key handling.
 */
export const generateVideo = async (prompt: string) => {
  try {
    // 1. Check for API Key permission (Required for Veo)
    // @ts-ignore
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    }

    // 2. Re-initialize AI with potentially new key context if needed, 
    // or just proceed with the current instance if process.env.API_KEY is managed globally.
    // For Veo, we ensure we are using the 'veo-3.1-fast-generate-preview' model.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // 3. Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    // 4. Get Result
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed to return a URI");

    // Append API key to fetch the actual bytes
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Video Gen Error:", error);
    throw new Error("Failed to generate video. " + (error as any).message);
  }
};
