
import { GoogleGenAI, Type } from "@google/genai";
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
        // 必须在调用前新建实例以保证使用最新的 API Key
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const langContext = language === 'zh' 
          ? '请使用中文输出 mood 字段。对于中文歌曲，title 和 artist 必须使用汉字。' 
          : 'Output mood in English. Use original language for title and artist.';

        let regionContext = '';
        if (region !== 'global') {
           const regionName = REGION_NAMES[region] || region;
           regionContext = `CONTEXT: User is currently in the "${regionName}" music market.`;
        }

        const systemInstruction = `You are a world-class Music Identification Expert.
        STEPS:
        1. Listen to the provided audio clip (vocals, melody, instruments).
        2. Transcribe clear lyrics if heard.
        3. Use GOOGLE SEARCH to confirm the exact Title, Artist, and most common lyrics.
        4. Detect the overall vibe/mood of the music.
        
        If it's ambient noise or no music is detected, set "identified" to false.
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
                text: `Identify this song. ${regionContext} ${langContext}`
              }
            ]
          },
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            // 最佳实践：使用 responseSchema 确保输出结构
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "The track name" },
                artist: { type: Type.STRING, description: "The artist or band name" },
                lyricsSnippet: { type: Type.STRING, description: "Approximately 4-6 lines of lyrics without timestamps" },
                mood: { type: Type.STRING, description: "One or two words describing the musical vibe" },
                identified: { type: Type.BOOLEAN, description: "Whether a song was successfully identified" }
              },
              required: ["title", "artist", "identified"]
            }
          }
        });

        if (!response.text) return null;
        
        let songInfo: SongInfo = JSON.parse(response.text.trim());

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
        if (retryCount < 1) { // 失败重试一次
             await new Promise(r => setTimeout(r, 2000)); 
             return callGemini(retryCount + 1);
        }
        return null;
    }
  };

  const aiResult = await callGemini();

  // 3. 只有当真正识别到歌曲且有指纹时才缓存
  if (aiResult && aiResult.identified && features.length > 0) {
      saveToLocalCache(features, aiResult);
  }

  return aiResult;
};
