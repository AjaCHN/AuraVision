import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL, REGION_NAMES } from '../constants';
import { SongInfo, Language, Region } from '../types';
import { generateFingerprint, saveToLocalCache, findLocalMatch } from './fingerprintService';

export const identifySongFromAudio = async (
  base64Audio: string, 
  mimeType: string, 
  language: Language = 'en', 
  region: Region = 'global',
  provider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' | 'DEEPSEEK' | 'QWEN' = 'GEMINI',
  apiKey?: string
): Promise<SongInfo | null> => {
  if (provider === 'MOCK') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { title: "Midnight City", artist: "M83", lyricsSnippet: "Waiting in the car...", mood: "Electric", identified: true, matchSource: 'MOCK', searchUrl: 'https://google.com' };
  }

  // Handle other providers (DeepSeek, Grok, Qwen, etc.)
  if (provider !== 'GEMINI') {
      console.log(`[AI] Using Provider: ${provider}`);
      if (!apiKey) {
          console.warn(`[AI] Missing API Key for ${provider}. Returning mock failure.`);
          return null; 
      }
      
      console.log(`[AI] Call to ${provider} simulated with API Key length: ${apiKey.length}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { 
          title: `Simulated Song (${provider})`, 
          artist: "Unknown Artist", 
          lyricsSnippet: "Lyrics detection requires backend integration...", 
          mood: "Mysterious", 
          identified: true, 
          matchSource: provider 
      };
  }

  // GEMINI Implementation
  let features: number[] = [];
  try {
    features = await generateFingerprint(base64Audio);
    const localMatch = findLocalMatch(features);
    if (localMatch) return localMatch;
  } catch (e) {
    console.warn("[Recognition] Local match failed", e);
  }

  const callGemini = async (retryCount = 0): Promise<SongInfo | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const regionName = region === 'global' ? 'Global' : (REGION_NAMES[region] || region);
        
        // Improved Prompting Strategy for Regional Bias
        const systemInstruction = `
          Role: Expert Music Identification AI.
          Task: Identify the song in the audio clip.
          
          CONTEXT: The user is in the '${regionName}' market. 
          INSTRUCTIONS:
          1. Prioritize identifying songs popular, trending, or originating from the '${regionName}' region.
          2. If the audio contains lyrics in a local language (e.g., Mandarin for CN, Japanese for JP, Korean for KR), match against the local database first.
          3. Return the Title and Artist in the original script (e.g., Kanji, Hangul) if that is how it is commonly known in that region, unless the English localized title is significantly more recognizable globally.
          4. Provide a brief, relevant snippet of the lyrics (3-4 lines).
          5. Provide a single-word descriptor for the mood (e.g., 'Energetic', 'Melancholy', 'Ethereal').
          6. If low confidence, return 'identified': false.
        `;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: { parts: [{ inlineData: { mimeType: mimeType, data: base64Audio } }, { text: "Identify this song." }] },
          config: { 
            tools: [{ googleSearch: {} }], 
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "The title of the song." },
                artist: { type: Type.STRING, description: "The artist of the song." },
                lyricsSnippet: { type: Type.STRING, description: "A short, relevant snippet of the lyrics (3-4 lines)." },
                mood: { type: Type.STRING, description: "A single word describing the mood." },
                identified: { type: Type.BOOLEAN, description: "True if identified with confidence." },
              },
              required: ['title', 'artist', 'identified']
            }
          }
        });

        const text = response.text;
        if (!text) return null;

        let songInfo: SongInfo;
        try {
          songInfo = JSON.parse(text.trim());
        } catch (parseError) {
          console.error("[AI] Failed to parse JSON response:", text, parseError);
          return null; 
        }
        
        if (!songInfo.identified) {
          return null;
        }

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const webSource = groundingChunks.find(chunk => chunk.web?.uri);
          if (webSource?.web?.uri) songInfo.searchUrl = webSource.web.uri;
        }
        
        songInfo.matchSource = 'AI';
        return songInfo;
    } catch (error: any) {
        console.error("[AI] Error identifying song:", error);
        if (retryCount < 1) return callGemini(retryCount + 1);
        return null;
    }
  };

  const aiResult = await callGemini();
  if (aiResult && aiResult.identified && features.length > 0) saveToLocalCache(features, aiResult);
  return aiResult;
};