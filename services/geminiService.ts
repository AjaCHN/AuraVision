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
        - If vocals are unclear, search for the melody description or instrumentation style.
        
        PROCESS:
        1. **Listen Deeply**: Analyze the melody, chord progression, and vocal timbre.
        2. **Transcribe & Search**: If there are vocals, phonetically transcribe exactly what you hear and SEARCH for it.
        3. **Decision**: Only return a match if you are confident.

        MOOD ANALYSIS:
        - Classify the mood into one of these categories if possible: Energetic, Electronic, Dark, Melancholic, Calm, Dreamy, Happy, or Mystical.

        LYRICS FORMATTING:
        - Return the lyrics with approximate timestamps relative to the start of the song if known, or just line by line.
        - **IMPORTANT**: If you can identify the song, try to fetch the *full* lyrics for the current section (Chorus/Verse) and include timestamps in [mm:ss] format at the start of lines.
        - Example:
          [01:12] Just a small town girl
          [01:15] Living in a lonely world
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
                         "lyricsSnippet": "Lyrics with [mm:ss] timestamps if possible. Max 6 lines.",
                         "mood": "Vibe description (e.g., Energetic, Melancholic, Electronic, Calm)",
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
        
        // Robust JSON extraction
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
        
        // Mark source as AI
        songInfo.matchSource = 'AI';
        return songInfo;

    } catch (error: any) {
        // Robust error message extraction to handle nested objects (e.g., {error: {code: 500, message: "..."}})
        const errorMessage = error.message || 
                             (error.error && error.error.message) || 
                             JSON.stringify(error);

        // Handle 429 Resource Exhausted / Quota Limits specifically
        if (
          error.status === 429 || 
          error.code === 429 ||
          errorMessage.includes('429') || 
          errorMessage.includes('quota') || 
          errorMessage.includes('RESOURCE_EXHAUSTED')
        ) {
          console.warn("Gemini API Quota Exceeded. Backing off identification.");
          // Do NOT retry for quota errors, let the app handle backoff
          return null;
        }

        // Handle common transport errors (like code 6 XHR) with retry
        const isTransportError = (
          errorMessage.includes('error code: 6') || 
          errorMessage.includes('Rpc failed') ||
          errorMessage.includes('xhr error') ||
          errorMessage.includes('fetch failed') ||
          errorMessage.includes('503')
        );

        if (isTransportError && retryCount < 3) {
             const delay = 2000 * (retryCount + 1);
             console.warn(`Gemini transport error (attempt ${retryCount + 1}). Retrying in ${delay}ms...`, errorMessage);
             await new Promise(r => setTimeout(r, delay)); 
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
      generateFingerprint(base64Audio).then(features => {
          saveToLocalCache(features, aiResult);
      });
      return aiResult;
  }

  // 3. Fallback: Check local cache
  try {
      const features = await generateFingerprint(base64Audio);
      const localMatch = findLocalMatch(features);
      
      if (localMatch) {
          return localMatch;
      }
  } catch (e) {
      console.error("Fallback failed", e);
  }

  return aiResult;
};