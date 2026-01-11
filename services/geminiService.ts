import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL, REGION_NAMES } from '../constants';
import { SongInfo, Language, Region } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const identifySongFromAudio = async (base64Audio: string, mimeType: string, language: Language = 'en', region: Region = 'global'): Promise<SongInfo | null> => {
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
    // We force the model to "think" about what it hears before guessing.
    const systemInstruction = `You are a world-class Audio Analysis AI. 
    Your goal is to identify songs from short, potentially low-quality audio clips.
    
    PROCESS:
    1. **Listen Deeply**: Analyze the melody, chord progression, instrumentation, and vocal timbre.
    2. **Transcription**: If there are vocals, phonetically transcribe exactly what you hear, even if fragments.
    3. **Fingerprinting**: Match these acoustic features against your vast knowledge of global music (Spotify/Apple Music/Billboard/Douyin/TikTok databases).
    4. **Decision**: Only return a match if you are confident.

    RULES:
    - If you hear distinct lyrics, use them as the primary identification key.
    - If instrumental, focus on the beat, production style, and unique melodies.
    - If the song is NOT identifiable (e.g., just noise, talking, or generic loop), set 'identified' to false.
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
                   1. What language are the vocals? (if any)
                   2. What is the genre?
                   3. What are the specific lyrics heard?
                   4. What is the song Title and Artist?

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
    return JSON.parse(cleanedText) as SongInfo;

  } catch (error) {
    console.error("Gemini identification failed:", error);
    return null;
  }
};