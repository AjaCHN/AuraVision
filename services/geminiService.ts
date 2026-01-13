
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
  region: Region = 'global'
): Promise<SongInfo | null> => {
  
  // 1. 生成指纹并尝试本地匹配
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
        6. Return strictly a raw JSON object. Do not use Markdown formatting.

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
                text: "Identify this song."
              }
            ]
          },
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: systemInstruction,
            // responseSchema is incompatible with googleSearch in some contexts or returns text chunks
            // We parse manually below
          }
        });

        if (!response.text) {
            console.warn("[Recognition] Empty response from Gemini.");
            return null;
        }
        
        let songInfo: SongInfo;
        try {
            // Clean up Markdown if present (e.g. ```json ... ```)
            let cleanText = response.text.trim();
            if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/^```(json)?\n/, '').replace(/\n```$/, '');
            }
            songInfo = JSON.parse(cleanText);
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
