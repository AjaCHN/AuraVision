
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL, REGION_NAMES } from '../constants';
import { SongInfo, Language, Region } from '../types';
import { generateFingerprint, saveToLocalCache, findLocalMatch } from './fingerprintService';

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const identifySongFromAudio = async (base64Audio: string, mimeType: string, language: Language = 'en', region: Region = 'global'): Promise<SongInfo | null> => {
  
  // 1. Generate fingerprint and check local cache first to save costs/time
  let features: number[] = [];
  try {
    features = await generateFingerprint(base64Audio);
    const localMatch = findLocalMatch(features);
    if (localMatch) {
      console.log(`[Recognition] Local fingerprint match found: ${localMatch.title} by ${localMatch.artist}`);
      return localMatch;
    }
  } catch (e) {
    console.warn("[Recognition] Fingerprint step failed, falling back to AI identification.", e);
  }

  const callGemini = async (retryCount = 0): Promise<SongInfo | null> => {
    try {
        const ai = getGenAI();
        
        const langContext = language === 'zh' 
          ? 'Output "mood" in Simplified Chinese. For Chinese songs, "title" and "artist" MUST be in Chinese characters.' 
          : 'Output "mood" in English. "title" and "artist" should be in their original language or English.';

        let regionContext = '';
        if (region !== 'global') {
           const regionName = REGION_NAMES[region] || region;
           regionContext = `CONTEXT: User is in the "${regionName}" market. Prioritize identifying songs trending or classic in this region.`;
        }

        const systemInstruction = `You are a world-class Audio Analysis AI. 
        Your goal is to identify songs from short, potentially low-quality audio clips.

        CRITICAL INSTRUCTION:
        - You have access to a **Google Search** tool.
        - You **MUST** transcribe any lyrics you hear and **SEARCH** them to verify the Song Title and Artist.
        - If vocals are unclear, search for the melody description or instrumentation style.
        
        PROCESS:
        1. **Listen Deeply**: Analyze the melody, chord progression, and vocal timbre.
        2. **Transcribe & Search**: If there are vocals, phonetically transcribe exactly what you hear and SEARCH for it.
        3. **Decision**: Only return a match if you are confident.

        MOOD ANALYSIS:
        - Classify the mood into one of these categories if possible: Energetic, Electronic, Dark, Melancholic, Calm, Dreamy, Happy, or Mystical.

        LYRICS FORMATTING:
        - **IMPORTANT**: DO NOT include any timestamps, time labels, or [mm:ss] tags in the lyrics.
        - Provide a clean, text-only snippet of the current section (Chorus/Verse).
        - Use line breaks for separate phrases.
        `;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Audio
                }
              },
              {
                text: `Analyze this audio clip.
                       ${regionContext}
                       ${langContext}

                       Think step-by-step:
                       1. What language are the vocals?
                       2. What are the specific lyrics heard? (SEARCH THEM)
                       3. What is the song Title and Artist?

                       Return JSON object:
                       {
                         "title": "Song Title",
                         "artist": "Artist Name",
                         "lyricsSnippet": "Clean text lyrics ONLY. NO TIMESTAMPS. Max 6 lines.",
                         "mood": "Vibe description",
                         "identified": true/false
                       }`
              }
            ]
          },
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: systemInstruction,
          }
        });

        const text = response.text;
        if (!text) return null;
        
        let jsonStr = text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }
        
        const songInfo = JSON.parse(jsonStr) as SongInfo;

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const webSource = groundingChunks.find(chunk => chunk.web?.uri);
          if (webSource?.web?.uri) {
            songInfo.searchUrl = webSource.web.uri;
          }
        }
        
        songInfo.matchSource = 'AI';
        return songInfo;

    } catch (error: any) {
        const errorMessage = error.message || (error.error && error.error.message) || JSON.stringify(error);
        if (error.status === 429 || error.code === 429 || errorMessage.includes('429') || errorMessage.includes('quota')) {
          return null;
        }
        const isTransportError = (errorMessage.includes('error code: 6') || errorMessage.includes('Rpc failed') || errorMessage.includes('503'));
        if (isTransportError && retryCount < 3) {
             await new Promise(r => setTimeout(r, 2000 * (retryCount + 1))); 
             return callGemini(retryCount + 1);
        }
        return null;
    }
  };

  const aiResult = await callGemini();

  // 2. If AI identified a song, cache it for future fingerprint matches
  if (aiResult && aiResult.identified && features.length > 0) {
      saveToLocalCache(features, aiResult);
  }

  return aiResult;
};
