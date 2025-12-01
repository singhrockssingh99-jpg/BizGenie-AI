import { GoogleGenAI, Modality } from "@google/genai";

// Utility to get the AI client. Note: We recreate it to ensure freshness of key.
const getAIClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  // In a real production app, you might want to handle missing keys gracefully in UI
  return new GoogleGenAI({ apiKey });
};

// --- Text Generation (Marketing, Research, Chat) ---
export const generateText = async (prompt: string, systemInstruction?: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Text Gen Error:", error);
    throw error;
  }
};

// --- Image Generation ---
export const generateImage = async (prompt: string) => {
  const ai = getAIClient();
  try {
    // Using gemini-2.5-flash-image (Nano Banana) for general tasks or fast generation
    // If user needs high quality, we would switch to 'imagen-3.0-generate-001' or 'gemini-3-pro-image-preview'
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        // Nano Banana doesn't support responseMimeType
      }
    });
    
    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// --- Audio Generation (Hinglish TTS) ---
export const generateAudio = async (text: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is usually good for clarity
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Audio Gen Error:", error);
    throw error;
  }
};

// --- Video Generation (Veo) ---
export const generateVideo = async (prompt: string) => {
  // Ensure we check for the paid key selection for Veo
  if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
     await window.aistudio.openSelectKey();
     // We assume success if they come back, but real error handling is needed
  }

  const ai = getAIClient();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Polling mechanism
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    throw new Error("No video URI returned");

  } catch (error) {
    console.error("Video Gen Error:", error);
    throw error;
  }
};
