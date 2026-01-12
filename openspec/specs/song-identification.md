# 歌曲识别功能规范

## 功能概述
歌曲识别模块是 SonicVision 的核心功能之一，负责通过音频分析识别正在播放的歌曲。该模块结合了本地音频指纹识别和云端 AI 识别技术，提供高效准确的歌曲识别服务。

## 核心功能

### 音频指纹识别

#### 指纹生成
- **功能**：从音频数据生成唯一的指纹特征
- **技术实现**：使用音频处理算法提取特征
- **目的**：快速本地匹配，减少 API 调用
- **性能**：本地计算，响应速度快

#### 本地缓存
- **功能**：存储已识别歌曲的指纹和信息
- **技术实现**：使用 localStorage 存储
- **数据结构**：指纹特征 → 歌曲信息的映射
- **优势**：减少重复识别，节省 API 调用成本

#### 本地匹配
- **功能**：在本地缓存中查找匹配的歌曲
- **技术实现**：使用相似度算法比较指纹
- **触发时机**：在调用 AI API 之前先进行本地匹配
- **返回值**：匹配的歌曲信息或 null

### AI 歌曲识别

#### Google Gemini API 调用
- **功能**：使用 AI 分析音频片段识别歌曲
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
- **参数**：base64 编码的音频数据、MIME 类型
- **返回值**：包含歌曲信息的响应

#### 多语言支持
- **功能**：根据用户语言设置返回对应语言的结果
- **技术实现**：
  ```typescript
  const langContext = language === 'zh' 
    ? 'Output "mood" in Simplified Chinese. For Chinese songs, "title" and "artist" MUST be in Chinese characters.' 
    : 'Output "mood" in English. "title" and "artist" should be in their original language or English.';
  ```
- **支持语言**：英语、中文

#### 区域化支持
- **功能**：根据用户区域优先识别该地区流行歌曲
- **技术实现**：
  ```typescript
  if (region !== 'global') {
     const regionName = REGION_NAMES[region] || region;
     regionContext = `CONTEXT: User is in the "${regionName}" market. Prioritize identifying songs trending or classic in this region.`;
  }
  ```
- **支持区域**：全球、美国、中国、日本、韩国、欧洲、拉丁美洲

### 识别结果处理

#### 结果解析
- **功能**：解析 AI 响应，提取歌曲信息
- **技术实现**：
  ```typescript
  let jsonStr = text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
      jsonStr = jsonMatch[0];
  }
  const songInfo = JSON.parse(jsonStr) as SongInfo;
  ```
- **数据结构**：符合 SongInfo 接口

#### 搜索链接生成
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
- **用途**：提供歌曲的原始来源链接

#### 结果缓存
- **功能**：将新识别的歌曲信息缓存到本地
- **技术实现**：
  ```typescript
  if (aiResult && aiResult.identified && features.length > 0) {
      saveToLocalCache(features, aiResult);
  }
  ```
- **触发时机**：当 AI 成功识别歌曲时

## 技术实现

### 核心服务

#### geminiService.ts
- **功能**：封装 Google Gemini API 调用
- **核心方法**：`identifySongFromAudio`
- **参数**：base64Audio, mimeType, language, region
- **返回值**：Promise<SongInfo | null>

#### fingerprintService.ts
- **功能**：处理音频指纹的生成和匹配
- **核心方法**：`generateFingerprint`, `findLocalMatch`, `saveToLocalCache`
- **数据存储**：使用 localStorage

### 识别流程

#### 完整流程
1. **音频录制**：使用 MediaRecorder 录制 5 秒音频
2. **指纹生成**：从音频数据生成指纹
3. **本地匹配**：在本地缓存中查找匹配
4. **AI 识别**：如果本地无匹配，调用 Google Gemini API
5. **结果处理**：解析响应，提取歌曲信息
6. **结果缓存**：将新识别的歌曲缓存到本地
7. **结果返回**：返回歌曲信息给调用方

#### 周期性识别
- **功能**：定期自动执行歌曲识别
- **技术实现**：
  ```typescript
  interval = window.setInterval(async () => {
    if (isIdentifying) return;
    // 执行识别流程
  }, 30000);
  ```
- **间隔**：默认每 30 秒执行一次

### 错误处理

#### API 错误处理
- **功能**：处理 Google Gemini API 的错误
- **错误类型**：
  - 429 配额错误
  - 网络传输错误
  - 其他 API 错误
- **处理策略**：
  - 配额错误：返回 null
  - 传输错误：最多重试 3 次
  - 其他错误：返回 null

#### 音频处理错误
- **功能**：处理音频指纹生成失败的情况
- **处理策略**：
  ```typescript
  try {
    features = await generateFingerprint(base64Audio);
    // 本地匹配
  } catch (e) {
    console.warn("[Recognition] Fingerprint step failed, falling back to AI identification.", e);
  }
  ```
- **降级方案**：指纹生成失败时，直接使用 AI 识别

## 与其他模块的集成

### 与音频处理模块

#### 数据流向
- **音频数据**：MediaRecorder → geminiService
- **集成点**：App.tsx 中的音频录制和处理
- **触发条件**：每 30 秒或用户手动触发

### 与用户界面模块

#### 结果展示
- **功能**：在界面上显示识别结果
- **集成点**：SongOverlay 组件
- **显示内容**：歌曲标题、艺术家、歌词片段、情绪标签

#### 用户控制
- **功能**：允许用户控制识别行为
- **集成点**：Controls 组件
- **控制选项**：语言设置、区域设置、手动触发识别

### 与可视化模块

#### 识别状态反馈
- **功能**：在识别过程中提供视觉反馈
- **集成点**：VisualizerCanvas 和 ThreeVisualizer
- **反馈方式**：识别中显示加载动画

#### 歌曲信息联动
- **功能**：可视化效果响应歌曲信息
- **集成点**：VisualizerCanvas 可选显示歌词
- **实现**：根据歌曲节奏调整可视化效果

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

## 安全考虑

### 数据隐私

#### 音频数据处理
- **策略**：音频数据仅用于识别，不持久化存储
- **实现**：识别完成后删除临时音频数据

#### API 调用安全
- **策略**：使用 HTTPS 传输音频数据
- **实现**：通过安全通道调用 Google Gemini API

### API 密钥管理

#### 环境变量
- **策略**：使用环境变量存储 API 密钥
- **实现**：
  ```typescript
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  ```
- **优势**：避免硬编码密钥，提高安全性

## 未来扩展

### 计划中的功能

#### 增强的指纹算法
- **功能**：改进指纹生成算法，提高匹配准确率
- **目标**：减少对 AI API 的依赖

#### 多引擎识别
- **功能**：集成多个歌曲识别引擎
- **优势**：提高识别准确率，减少单一依赖

#### 歌词同步
- **功能**：实现精确的歌词时间同步
- **技术**：结合音频分析和歌词数据

### 技术路线

#### 本地模型
- **方向**：探索使用 WebML 在本地运行轻量级识别模型
- **优势**：减少网络依赖，提高响应速度

#### 社区贡献
- **方向**：建立社区驱动的歌曲指纹库
- **优势**：扩展本地识别覆盖范围

## 测试策略

### 单元测试
- **测试框架**：Jest
- **测试重点**：
  - 指纹生成和匹配功能
  - 错误处理逻辑
  - 缓存管理

### 集成测试
- **测试框架**：Cypress
- **测试场景**：
  - 完整的识别流程
  - 本地缓存命中
  - API 调用和响应处理

### 性能测试
- **测试工具**：Chrome DevTools Performance
- **测试指标**：
  - 识别响应时间
  - API 调用频率
  - 内存使用情况

### 准确性测试
- **测试方法**：使用已知歌曲的音频片段进行测试
- **评估指标**：识别准确率、识别时间
- **测试数据集**：包含不同类型、不同长度的音频片段