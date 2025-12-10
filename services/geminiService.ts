import { GoogleGenAI, Modality, Type } from "@google/genai";

// Initialize the client with the environment variable as per strict instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a high-quality image for Logos or Thumbnails.
 */
export const generateImage = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image for image generation as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any, // "1:1" for logos, "16:9" for thumbnails
        },
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data returned from API");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

/**
 * Generates marketing copy for Ads using structured JSON output.
 */
export const generateAdCopy = async (productName: string, targetAudience: string): Promise<{ headline: string; body: string }> => {
  try {
    const prompt = `Create a high-converting Facebook/Instagram ad for a product called "${productName}". 
    Target Audience: ${targetAudience}. 
    Return JSON with 'headline' (catchy, under 50 chars) and 'body' (persuasive, under 200 chars).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["headline", "body"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned");
    return JSON.parse(text);
  } catch (error) {
    console.error("Ad copy generation error:", error);
    throw error;
  }
};

/**
 * Generates Song Lyrics and then converts them to Speech (Audio).
 */
export const generateSongDemo = async (genre: string, topic: string): Promise<{ lyrics: string; audio: string }> => {
  try {
    // Step 1: Generate Lyrics
    const lyricsResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, catchy chorus (4-6 lines) for a ${genre} song about ${topic}. Do not include labels like [Chorus], just the lyrics.`,
    });
    
    const lyrics = lyricsResponse.text || "La la la (Generation failed)";

    // Step 2: Convert to Speech/Audio
    const audioResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: lyrics }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Deep, smooth voice suitable for demos
          },
        },
      },
    });

    const audioPart = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioPart) throw new Error("Audio generation failed");

    return {
      lyrics: lyrics,
      audio: audioPart
    };

  } catch (error) {
    console.error("Song generation error:", error);
    throw error;
  }
};
