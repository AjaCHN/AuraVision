
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
        const key = apiKey || process.env.API_KEY;
        if (!key || key.trim() === '') {
            console.warn("[AI] Missing API Key. Skipping identification.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: key });
        const regionName = region === 'global' ? 'Global' : (REGION_NAMES[region] || region);
        
        const systemInstruction = `
          You are a professional Music Intelligence Engine. Your task is to analyze audio snapshots and provide accurate metadata.
          
          CONTEXT: User is in the '${regionName}' market. 
          
          GUIDELINES:
          1. FOCUS: Even if the audio has background noise, identify the dominant musical track.
          2. REGIONAL BIAS: Prioritize artists and songs trending in ${regionName}.
          3. SCRIPT: Use the native script (Kanji, Hangul, Chinese) for the title and artist if appropriate for that market.
          4. MOOD: Describe the aesthetic mood in one expressive word (e.g., 'Cyberpunk', 'Ethereal', 'Nostalgic').
          5. OUTPUT: strictly follow the JSON schema. If the track is instrumental or unknown, set 'identified' to false.
        `;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: { parts: [{ inlineData: { mimeType: mimeType, data: base64Audio } }, { text: "Identify the song and analyze its mood." }] },
          config: { 
            tools: [{ googleSearch: {} }], 
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                lyricsSnippet: { type: Type.STRING },
                mood: { type: Type.STRING },
                identified: { type: Type.BOOLEAN },
              },
              required: ['title', 'artist', 'identified']
            }
          }
        });

        const text = response.text;
        if (!text) return null;

        let songInfo: SongInfo = JSON.parse(text.trim());
        if (!songInfo.identified) return null;

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const webSource = groundingChunks.find(chunk => chunk.web?.uri);
          if (webSource?.web?.uri) songInfo.searchUrl = webSource.web.uri;
        }
        
        songInfo.matchSource = 'AI';
        return songInfo;
    } catch (error: any) {
        console.error("[AI] Error:", error);
        if (retryCount < 1) return callGemini(retryCount + 1);
        return null;
    }
  };

  const aiResult = await callGemini();
  if (aiResult && aiResult.identified && features.length > 0) saveToLocalCache(features, aiResult);
  return aiResult;
};
