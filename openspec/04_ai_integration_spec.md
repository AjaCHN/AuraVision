# OpenSpec: AI 集成规范

## 1. 模型与工具配置
- **模型:** `gemini-3-flash-preview`。
- **工具:** `googleSearch`（用于实时验证歌曲元数据）。
- **参数精调 (v0.7.5):** 
  - `temperature: 0.15` (极低随机性，确保识别一致性)。
  - `topP: 0.8`, `topK: 20`。
  - `timeout: 20000ms`。

## 2. 结构化输出 (Response Schema)
AI 必须返回格式如下的 JSON：
```typescript
{
  "title": "string",
  "artist": "string",
  "lyricsSnippet": "string",
  "mood": "string",
  "identified": "boolean"
}
```

## 3. 噪声鲁棒性与区域感知
- **采样策略:** 录制 6 秒高质量 WebM/Opus 音频片段，确保包含足够的旋律特征。
- **品牌化指令 (v0.7.5):** 指令集中必须明确引擎定位为 **"AI Synesthesia Engine" (AI 通感引擎)**，强调声光转化的艺术性。
- **Linguistic Policy:** 针对全球化市场（中、日、韩、西、德、法、俄、阿），要求返回对应的原文脚本（如 漢字、한글）并匹配对应的语言风格。

## 4. 歌曲识别流程
1. **本地优先 (Local First):** 提取声学指纹并在本地缓存中进行 Jaccard 相似度匹配 (阈值 0.25)。
2. **云端识别:** 若本地无匹配，发送音频 Base64 至 Gemini。
3. **情绪分析:** 模型需返回 2-3 个词的情绪标签（如 "Cyberpunk Phonk", "Ethereal Ambient"）。

---
*Aura Vision AI Integration - Version 0.7.5*