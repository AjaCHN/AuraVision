# OpenSpec: AI 集成规范

## 1. 模型与工具配置
- **模型:** `gemini-3-flash-preview`。
- **工具:** `googleSearch`（用于实时验证歌曲元数据）。
- **指令系统:** `SystemInstruction` 强制要求返回 JSON。

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

## 3. 歌曲识别与解析流程
1. **本地优先 (Local First):** 使用当前音频片段生成声学指纹，并在本地缓存库中进行 Jaccard 相似度匹配。若匹配成功，则直接返回缓存结果。
2. **采样:** 若本地无匹配，则录制 5-7 秒 WebM 音频片段。
3. **AI 请求:** 发送音频 Base64 数据至 Gemini API。利用 `responseMimeType: "application/json"` 及 `responseSchema` 强制模型返回结构化、干净的 JSON 数据。
4. **解析:** 直接使用 `JSON.parse` 解析 AI 返回的纯净 JSON 字符串。不再需要复杂的边界提取或容错处理。
5. **重试机制:** 若请求失败或解析异常，系统将自动触发一次重试（Max Retries: 1）。
6. **缓存写入 (Cache Write):** 若 AI 识别成功，则将结果与音频指纹一同写入本地缓存，供未来快速检索。

---
*Aura Vision AI Integration - Version 0.4.3*