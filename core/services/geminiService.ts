import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL, REGION_NAMES } from '../constants';
import { SongInfo, Language, Region } from '../types';
import { generateFingerprint, saveToLocalCache, findLocalMatch } from './fingerprintService';

export const identifySongFromAudio = async (
  base64Audio: string, 
  mimeType: string, 
  language: Language = 'en', 
  region: Region = 'global',
  provider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' = 'GEMINI'
): Promise<SongInfo | null> => {
  if (provider !== 'GEMINI') {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { title: "Midnight City", artist: "M83", lyricsSnippet: "Waiting in the car...", mood: "Electric", identified: true, matchSource: provider as any, searchUrl: 'https://google.com' };
  }

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
        const systemInstruction = `You are an expert music identification service. Your task is to analyze the provided audio clip's melody, harmony, rhythm, and any discernible lyrics to identify the song. The target music market is '${regionName}'. You must return the song's title, artist, a brief and relevant snippet of the lyrics, and a single-word descriptor for the mood (e.g., 'Energetic', 'Melancholy'). If you are unable to identify the song with high confidence, you MUST return 'identified': false and null or empty strings for the other fields.`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: { parts: [{ inlineData: { mimeType: mimeType, data: base64Audio } }, { text: "Please identify the song from this audio clip." }] },
          config: { 
            tools: [{ googleSearch: {} }], 
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "The title of the song." },
                artist: { type: Type.STRING, description: "The artist of the song." },
                lyricsSnippet: { type: Type.STRING, description: "A short, relevant snippet of the lyrics." },
                mood: { type: Type.STRING, description: "A single word or short phrase describing the mood (e.g., 'Energetic', 'Melancholy')." },
                identified: { type: Type.BOOLEAN, description: "Set to true if the song was successfully identified, otherwise false." },
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
          return null; // Return null if JSON is malformed, preventing a crash.
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