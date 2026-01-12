# Google Gemini 歌曲识别服务规范

## 功能概述
Google Gemini 服务是 SonicVision 的核心服务之一，负责使用 Google Gemini AI API 分析音频片段并识别歌曲。该服务封装了 API 调用、错误处理、多语言支持和区域化设置等功能，为应用提供准确的歌曲识别能力。

## 核心功能

### API 初始化

#### 服务初始化
- **功能**：初始化 Google Gemini AI 服务
- **技术实现**：
  ```typescript
  let genAI: GoogleGenAI | null = null;

  const getGenAI = () => {
    if (!genAI) {
      genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return genAI;
  };
  ```
- **单例模式**：使用单例模式避免重复初始化
- **API 密钥**：从环境变量获取 API 密钥，提高安全性

### 音频识别

#### 核心方法
- **方法名**：`identifySongFromAudio`
- **功能**：识别音频片段中的歌曲
- **参数**：
  - `base64Audio`：string，base64 编码的音频数据
  - `mimeType`：string，音频数据的 MIME 类型
  - `language`：Language，可选，默认 'en'，识别结果的语言
  - `region`：Region，可选，默认 'global'，用户所在区域
- **返回值**：`Promise<SongInfo | null>`，识别的歌曲信息或 null

#### 识别流程
1. **音频指纹生成**：从音频数据生成指纹
2. **本地匹配**：在本地缓存中查找匹配
3. **AI 识别**：如果本地无匹配，调用 Google Gemini API
4. **结果处理**：解析 API 响应，提取歌曲信息
5. **结果缓存**：将新识别的歌曲缓存到本地
6. **结果返回**：返回歌曲信息给调用方

### Google Gemini API 调用

#### API 请求配置
- **功能**：配置和发送 API 请求
- **技术实现**：
  ```typescript
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
          text: `Analyze this audio clip...`
        }
      ]
    },
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: systemInstruction,
    }
  });
  ```
- **模型**：使用配置的 GEMINI_MODEL
- **工具**：启用 googleSearch 工具以提高识别准确性
- **系统指令**：提供详细的系统指令指导 AI 分析

#### 系统指令
- **功能**：指导 AI 如何分析音频和生成响应
- **内容**：
  ```typescript
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
  ```
- **关键指令**：要求 AI 使用 Google Search 工具验证识别结果
- **处理流程**：详细的音频分析流程
- **情绪分析**：要求 AI 分析歌曲情绪
- **歌词格式**：严格的歌词格式要求

### 多语言支持

#### 语言上下文
- **功能**：根据用户语言设置生成对应的语言上下文
- **技术实现**：
  ```typescript
  const langContext = language === 'zh' 
    ? 'Output "mood" in Simplified Chinese. For Chinese songs, "title" and "artist" MUST be in Chinese characters.' 
    : 'Output "mood" in English. "title" and "artist" should be in their original language or English.';
  ```
- **支持语言**：
  - 中文：输出中文情绪标签，中文歌曲使用中文字符
  - 英文：输出英文情绪标签，保持歌曲标题和艺术家的原始语言

### 区域化支持

#### 区域上下文
- **功能**：根据用户区域设置生成对应的区域上下文
- **技术实现**：
  ```typescript
  if (region !== 'global') {
     const regionName = REGION_NAMES[region] || region;
     regionContext = `CONTEXT: User is in the "${regionName}" market. Prioritize identifying songs trending or classic in this region.`;
  }
  ```
- **作用**：优先识别用户所在区域流行或经典的歌曲
- **支持区域**：global, US, CN, JP, KR, EU, LATAM

### 响应处理

#### 结果解析
- **功能**：解析 AI 响应，提取歌曲信息
- **技术实现**：
  ```typescript
  const text = response.text;
  if (!text) return null;
  
  let jsonStr = text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
      jsonStr = jsonMatch[0];
  }
  
  const songInfo = JSON.parse(jsonStr) as SongInfo;
  ```
- **JSON 提取**：使用正则表达式从响应文本中提取 JSON
- **类型转换**：将解析结果转换为 SongInfo 类型

#### 搜索链接提取
- **功能**：从 AI 响应中提取搜索链接
- **技术实现**：
  ```typescript
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    const webSource = groundingChunks.find(chunk => chunk.web?.uri);
    if (webSource?.web?.uri) {
      songInfo.searchUrl = webSource.web.uri;
    }
  }
  ```
- **来源**：从 groundingMetadata 中提取网络来源
- **用途**：提供歌曲的原始搜索链接

#### 匹配来源标记
- **功能**：标记匹配的来源
- **技术实现**：
  ```typescript
  songInfo.matchSource = 'AI';
  ```
- **值**：'AI'，表示匹配来自 AI 识别

### 错误处理

#### API 错误处理
- **功能**：处理 Google Gemini API 的错误
- **技术实现**：
  ```typescript
  catch (error: any) {
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
  ```
- **错误类型**：
  - 429 配额错误：返回 null
  - 传输错误：最多重试 3 次
  - 其他错误：返回 null

#### 音频处理错误
- **功能**：处理音频指纹生成失败的情况
- **技术实现**：
  ```typescript
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
  ```
- **降级方案**：指纹生成失败时，直接使用 AI 识别

### 重试机制

#### 网络错误重试
- **功能**：在网络错误时自动重试
- **技术实现**：
  ```typescript
  const callGemini = async (retryCount = 0): Promise<SongInfo | null> => {
    try {
        // API 调用
    } catch (error: any) {
        // 错误处理
        if (isTransportError && retryCount < 3) {
             await new Promise(r => setTimeout(r, 2000 * (retryCount + 1))); 
             return callGemini(retryCount + 1);
        }
        return null;
    }
  };
  ```
- **重试次数**：最多 3 次
- **重试延迟**：指数退避，每次重试延迟加倍

## 与其他模块的集成

### 与音频处理模块

#### 数据流向
- **音频数据**：音频处理模块 → geminiService
- **集成点**：App.tsx 中的音频录制和处理
- **触发条件**：每 30 秒或用户手动触发

### 与指纹服务模块

#### 数据流向
- **指纹数据**：geminiService → fingerprintService
- **集成点**：
  - 指纹生成：`generateFingerprint(base64Audio)`
  - 本地匹配：`findLocalMatch(features)`
  - 结果缓存：`saveToLocalCache(features, aiResult)`

### 与用户界面模块

#### 结果展示
- **功能**：在界面上显示识别结果
- **集成点**：SongOverlay 组件
- **显示内容**：歌曲标题、艺术家、歌词片段、情绪标签

#### 用户设置
- **功能**：使用用户的语言和区域设置
- **集成点**：
  - 语言设置：从 App.tsx 获取
  - 区域设置：从 App.tsx 获取

## 性能优化

### API 调用优化

#### 本地缓存优先
- **策略**：先进行本地匹配，减少 API 调用
- **优势**：降低延迟，节省 API 成本
- **实现**：在调用 API 前先执行本地匹配

#### 批量处理
- **策略**：合并识别请求，减少 API 调用次数
- **实现**：使用周期性识别，避免频繁调用

### 响应时间优化

#### 并行处理
- **策略**：指纹生成和其他准备工作并行执行
- **优势**：减少整体识别时间

#### 异步操作
- **策略**：使用 async/await 和 Promise 处理异步操作
- **优势**：避免阻塞主线程，保持界面响应

### 错误处理优化

#### 智能重试
- **策略**：仅对可恢复的错误进行重试
- **优势**：提高成功率，避免不必要的重试

#### 错误分类
- **策略**：根据错误类型采取不同的处理策略
- **优势**：更有效地处理各种错误情况

## 安全考虑

### API 密钥管理

#### 环境变量
- **策略**：使用环境变量存储 API 密钥
- **实现**：
  ```typescript
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  ```
- **优势**：避免硬编码密钥，提高安全性

### 数据隐私

#### 音频数据处理
- **策略**：音频数据仅用于识别，不持久化存储
- **实现**：识别完成后删除临时音频数据

#### API 调用安全
- **策略**：使用 HTTPS 传输音频数据
- **实现**：通过安全通道调用 Google Gemini API

## 配置管理

### 常量配置

#### 模型配置
- **功能**：配置使用的 Gemini 模型
- **实现**：从常量文件导入 GEMINI_MODEL

#### 区域名称映射
- **功能**：映射区域代码到区域名称
- **实现**：从常量文件导入 REGION_NAMES

## 未来扩展

### 计划中的功能

#### 多模型支持
- **功能**：支持多个 Gemini 模型
- **优势**：根据不同场景选择合适的模型

#### 增强的错误处理
- **功能**：更详细的错误类型和处理策略
- **优势**：提高系统稳定性和用户体验

#### 统计和监控
- **功能**：添加 API 调用统计和监控
- **优势**：更好地了解系统性能和使用情况

### 技术路线

#### 本地模型集成
- **方向**：探索使用 WebML 在本地运行轻量级识别模型
- **优势**：减少网络依赖，提高响应速度

#### 服务端优化
- **方向**：如果 API 调用量增加，考虑使用服务端代理
- **优势**：更好的错误处理，更高的可靠性

## 测试策略

### 单元测试

#### 测试框架
- **框架**：Jest
- **测试重点**：
  - API 调用和响应处理
  - 错误处理逻辑
  - 重试机制
  - 多语言和区域支持

### 集成测试

#### 测试框架
- **框架**：Cypress
- **测试场景**：
  - 完整的识别流程
  - 本地缓存命中
  - API 调用和响应处理
  - 错误处理和重试

### 性能测试

#### 测试工具
- **工具**：Chrome DevTools Performance
- **测试指标**：
  - API 响应时间
  - 识别成功率
  - 内存使用情况
  - 网络请求大小

### 准确性测试

#### 测试方法
- **方法**：使用已知歌曲的音频片段进行测试
- **评估指标**：
  - 识别准确率
  - 识别时间
  - 不同语言和区域的表现

## 部署注意事项

### API 配额管理

#### 监控和限制
- **策略**：监控 API 调用量，避免超出配额
- **实现**：
  - 记录 API 调用次数
  - 在接近配额时减少调用频率
  - 提供配额不足的用户提示

### 环境配置

#### API 密钥设置
- **策略**：在部署环境中正确设置 API 密钥
- **实现**：
  - 使用环境变量或密钥管理服务
  - 确保密钥的安全存储和访问控制

### 错误处理和降级

#### 降级策略
- **策略**：在 API 不可用时提供降级方案
- **实现**：
  - 增强本地缓存
  - 提供基本的本地识别功能
  - 清晰的错误提示和用户引导