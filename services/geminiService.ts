
import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, REGION_NAMES } from '../constants';
import { SongInfo, Language, Region } from '../types';
import { generateFingerprint, saveToLocalCache, findLocalMatch } from './fingerprintService';

/**
 * 歌曲识别服务
 * 使用 Gemini 3 Flash 进行多模态音频分析与联网搜索
 */
export const identifySongFromAudio = async (
  base64Audio: string, 
  mimeType: string, 
  language: Language = 'en', 
  region: Region = 'global',
  provider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' = 'GEMINI'
): Promise<SongInfo | null> => {
  
  // 0. Simulation Providers
  // Since we only have Gemini keys configured, other providers are simulated for UI demonstration
  if (provider !== 'GEMINI') {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
      const mockSongs = [
          { title: "Midnight City", artist: "M83", lyrics: "Waiting in the car\nWaiting for a ride in the dark\nThe night city grows\nLook and see her eyes, they glow", mood: "Electric" },
          { title: "Blinding Lights", artist: "The Weeknd", lyrics: "I've been on my own for long enough\nMaybe you can show me how to love, maybe\nI'm going through withdrawals\nYou don't even have to do too much", mood: "Retro" },
          { title: "Levitating", artist: "Dua Lipa", lyrics: "If you wanna run away with me, I know a galaxy\nAnd I can take you for a ride\nI had a premonition that we fell into a rhythm\nWhere the music don't stop for life", mood: "Funky" },
          { title: "Starboy", artist: "The Weeknd", lyrics: "I'm tryna put you in the worst mood, ah\nP1 cleaner than your church shoes, ah\nMilli point two just to hurt you, ah\nAll red Lamb' just to tease you, ah", mood: "Cool" }
      ];
      const random = mockSongs[Math.floor(Math.random() * mockSongs.length)];
      return {
          title: random.title,
          artist: random.artist,
          lyricsSnippet: random.lyrics,
          mood: random.mood,
          identified: true,
          matchSource: provider as any,
          searchUrl: 'https://google.com'
      };
  }

  // 1. 生成指纹并尝试本地匹配 (Only for Gemini path)
  let features: number[] = [];
  try {
    features = await generateFingerprint(base64Audio);
    const localMatch = findLocalMatch(features);
    if (localMatch) {
      console.log(`[Recognition] Local match found: ${localMatch.title}`);
      return localMatch;
    }
  } catch (e) {
    console.warn("[Recognition] Fingerprint step failed, falling back to AI.", e);
  }

  // 2. 调用 Gemini API
  const callGemini = async (retryCount = 0): Promise<SongInfo | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let outputInstruction = 'Output mood in English.';
        if (language === 'zh') {
             outputInstruction = 'Output mood in Simplified Chinese. For Chinese songs, use Chinese characters for Title/Artist.';
        } else if (language === 'tw') {
             outputInstruction = 'Output mood in Traditional Chinese. For Chinese songs, use Traditional Chinese characters.';
        }

        const regionName = region === 'global' ? 'Global' : (REGION_NAMES[region] || region);

        // 将地区信息注入系统指令，以辅助搜索定位
        const systemInstruction = `You are a world-class Music Identification Expert.
        
        CONTEXT:
        - User Location: ${regionName}
        - Task: Identify the song from the audio clip.
        
        INSTRUCTIONS:
        1. Listen to the audio clip (melody, lyrics, instrumentation).
        2. Use the "googleSearch" tool to search for lyrics or audio fingerprints to confirm the EXACT Title and Artist.
        3. **IMPORTANT**: Prioritize songs that are popular or trending in the "${regionName}" market.
        4. Detect the mood (e.g., Energetic, Melancholic, Chill).
        5. ${outputInstruction}
        6. Return strictly a raw JSON object. Do not include any conversational text or markdown code blocks (like \`\`\`json).

        JSON Structure:
        {
          "title": "string",
          "artist": "string",
          "lyricsSnippet": "string (4-6 lines)",
          "mood": "string",
          "identified": boolean
        }

        If no music is detected or it cannot be identified, set "identified" to false.
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
                text: "Identify this song. Return ONLY JSON."
              }
            ]
          },
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: systemInstruction,
          }
        });

        if (!response.text) {
            console.warn("[Recognition] Empty response from Gemini.");
            return null;
        }
        
        let songInfo: SongInfo;
        try {
            // Robust JSON extraction: Find the first '{' and the last '}'
            const text = response.text;
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');
            
            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const jsonStr = text.substring(startIndex, endIndex + 1);
                songInfo = JSON.parse(jsonStr);
            } else {
                // Fallback: try standard cleanup if regex fails (though the above handles most cases)
                let cleanText = text.trim();
                cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');
                songInfo = JSON.parse(cleanText);
            }
        } catch (e) {
            console.error("[Recognition] Failed to parse JSON", response.text);
            return null;
        }

        // 提取搜索来源 URL 以展示给用户
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
        console.error("Gemini API Identification Error:", error);
        if (retryCount < 1) { 
             await new Promise(r => setTimeout(r, 2000)); 
             return callGemini(retryCount + 1);
        }
        return null;
    }
  };

  const aiResult = await callGemini();

  // 3. 缓存结果
  if (aiResult && aiResult.identified && features.length > 0) {
      saveToLocalCache(features, aiResult);
  }

  return aiResult;
};
