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
  
  // Helper to run identification via Gemini with retry logic
  const callGemini = async (retryCount = 0): Promise<SongInfo | null> => {
    try {
        const ai = getGenAI();
        
        // 1. Language Context
        const langContext = language === 'zh' 
          ? 'Output "mood" in Simplified Chinese. For Chinese songs, "title" and "artist" MUST be in Chinese characters.' 
          : 'Output "mood" in English. "title" and "artist" should be in their original language or English.';

        // 2. Region Prioritization
        let regionContext = '';
        if (region !== 'global') {
           const regionName = REGION_NAMES[region] || region;
           regionContext = `CONTEXT: User is in the "${regionName}" market. Prioritize identifying songs trending or classic in this region.`;
        }

        // 3. Chain of Thought System Instruction
        const systemInstruction = `You are a world-class Audio Analysis AI. 
        Your goal is to identify songs from short, potentially low-quality audio clips.

        CRITICAL INSTRUCTION:
        - You have access to a **Google Search** tool.
        - You **MUST** transcribe any lyrics you hear and **SEARCH** them to verify the Song Title and Artist.
        
        PROCESS:
        1. **Listen Deeply**: Analyze the melody, chord progression, and vocal timbre.
        2. **Transcribe & Search**: If there are vocals, phonetically transcribe exactly what you hear and SEARCH for it.
        3. **Decision**: Only return a match if you are confident.

        RULES:
        - If you hear distinct lyrics, use them as the primary identification key via Search.
        - If instrumental, focus on the beat and production style.
        - If the song is NOT identifiable, set 'identified' to false.
        - 'lyricsSnippet': If you identify the song, provide the **official lyrics** corresponding to the audio clip. If unsure which part, provide the Chorus.
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
                         "lyricsSnippet": "Lyrics matching the audio OR the Chorus",
                         "mood": "Vibe description",
                         "identified": true/false
                       }`
              }
            ]
          },
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
                identified: { type: Type.BOOLEAN }
              },
              required: ["title", "artist", "identified", "lyricsSnippet"]
            }
          }
        });

        const text = response.text;
        if (!text) return null;
        
        const cleanedText = text.replace(/```json\n?|```/g, '').trim();
        const songInfo = JSON.parse(cleanedText) as SongInfo;

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const webSource = groundingChunks.find(chunk => chunk.web?.uri);
          if (webSource?.web?.uri) {
            songInfo.searchUrl = webSource.web.uri;
          }
        }
        
        // Mark source as AI
        songInfo.matchSource = 'AI';
        return songInfo;

    } catch (error: any) {
        // Handle common transport errors (like code 6 XHR) with retry
        // Code 6 typically usually network reset or timeout
        const isTransportError = error.message && (
          error.message.includes('error code: 6') || 
          error.message.includes('Rpc failed') ||
          error.message.includes('xhr error')
        );

        if (isTransportError && retryCount < 2) {
             console.warn(`Gemini transport error (attempt ${retryCount + 1}), retrying...`, error);
             await new Promise(r => setTimeout(r, 1500 * (retryCount + 1))); // Exponential backoff
             return callGemini(retryCount + 1);
        }

        console.error("Gemini identification failed:", error);
        return null;
    }
  };

  // --- Main Logic with Fallback ---
  
  // 1. Attempt Gemini identification
  const aiResult = await callGemini();

  // 2. If Gemini succeeded, save fingerprint for future (Optimization)
  if (aiResult && aiResult.identified) {
      // Run fingerprinting in background (don't block return)
      generateFingerprint(base64Audio).then(features => {
          saveToLocalCache(features, aiResult);
      });
      return aiResult;
  }

  // 3. Fallback: If Gemini failed or didn't identify, check local cache
  // console.log("Gemini failed or unidentified, checking local cache...");
  try {
      const features = await generateFingerprint(base64Audio);
      const localMatch = findLocalMatch(features);
      
      if (localMatch) {
          return localMatch;
      }
  } catch (e) {
      console.error("Fallback failed", e);
  }

  // 4. Return original failure/unidentified result
  return aiResult;
};