/**
 * File: core/services/geminiService.ts
 * Version: 0.7.5
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL, REGION_NAMES } from '../constants';
import { SongInfo, Language, Region } from '../types';
import { generateFingerprint, saveToLocalCache, findLocalMatch } from './fingerprintService';

const REQUEST_TIMEOUT_MS = 20000; // 20s Hard Timeout for Robustness

export const identifySongFromAudio = async (
  base64Audio: string, 
  mimeType: string, 
  language: Language = 'en', 
  region: Region = 'global',
  provider: 'GEMINI' | 'MOCK' | 'OPENAI' | 'CLAUDE' | 'GROK' | 'DEEPSEEK' | 'QWEN' = 'GEMINI'
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
        const key = process.env.API_KEY;
        if (!key || key.trim() === '') {
            console.warn("[AI] Missing API Key. Skipping identification.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: key });
        const regionName = region === 'global' ? 'Global' : (REGION_NAMES[region] || region);
        
        const systemInstruction = `
          You are the "Aura Vision" Music Intelligence Engine. Your specialty is Identifying tracks from low-fidelity 6-second microphone snapshots.
          
          MARKET CONTEXT: The user is in the '${regionName}' market. 
          
          CORE CAPABILITIES:
          1. SPECTRAL ANALYSIS: Listen past background noise (crowds, talking, static) to find the primary melodic or rhythmic signature of a song.
          2. SEARCH GROUNDING: If you hear lyrics or a unique melody, use Google Search to verify the Title and Artist. Check for recent releases if the audio is high energy.
          3. REGIONAL BIAS: Prioritize tracks popular in the specified market (${regionName}).
          4. LINGUISTIC ACCURACY: Provide the original script (Kanji, Hangul, Cyrillic, Arabic) for the title and artist if appropriate.
          
          NOISE POLICY:
          - If the audio contains NO discernible music (only talking, silence, or noise), set "identified" to false.
          - If multiple songs are heard, identify the loudest/most recent one.
          
          MOOD ANALYSIS:
          - Provide a evocative 2-3 word mood tag (e.g., 'Retro Synthwave', 'Aggressive Phonk', 'Ethereal Ambient', 'Uplifting J-Pop').
          
          STRICT OUTPUT:
          - Always return valid JSON matching the provided schema.
        `;

        // Implementation of hard timeout for robustness
        const identifyPromise = ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: { 
            parts: [
              { inlineData: { mimeType: mimeType, data: base64Audio } }, 
              { text: "Analyze this audio snapshot. Search for the track if you hear lyrics or a strong melody. Identify the song and determine its aesthetic mood." }
            ] 
          },
          config: { 
            tools: [{ googleSearch: {} }], 
            systemInstruction: systemInstruction,
            temperature: 0.15, // Low temperature for high deterministic accuracy in identification
            topP: 0.8,
            topK: 20,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "The track name." },
                artist: { type: Type.STRING, description: "The artist or band name." },
                lyricsSnippet: { type: Type.STRING, description: "A relevant line from the chorus or current segment." },
                mood: { type: Type.STRING, description: "2-3 word aesthetic mood description." },
                identified: { type: Type.BOOLEAN, description: "True only if a specific song was found." },
              },
              required: ['title', 'artist', 'identified']
            }
          }
        });

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("AI_TIMEOUT")), REQUEST_TIMEOUT_MS)
        );

        const response: any = await Promise.race([identifyPromise, timeoutPromise]);

        const text = response.text;
        if (!text) return null;

        let songInfo: SongInfo = JSON.parse(text.trim());
        if (!songInfo.identified) return null;

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const webSource = groundingChunks.find((chunk: any) => chunk.web?.uri);
          if (webSource?.web?.uri) songInfo.searchUrl = webSource.web.uri;
        }
        
        songInfo.matchSource = 'AI';
        return songInfo;
    } catch (error: any) {
        console.error("[AI] Error:", error.message || error);
        
        // Don't retry if it's a timeout or explicit API key issue
        if (error.message === "AI_TIMEOUT") return null;
        
        if (retryCount < 1) return callGemini(retryCount + 1);
        return null;
    }
  };

  const aiResult = await callGemini();
  if (aiResult && aiResult.identified && features.length > 0) saveToLocalCache(features, aiResult);
  return aiResult;
};