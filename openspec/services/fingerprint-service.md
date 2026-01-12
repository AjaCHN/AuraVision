# 音频指纹服务规范

## 功能概述
音频指纹服务是 SonicVision 的核心服务之一，负责生成音频指纹、在本地缓存中查找匹配以及存储识别结果。该服务通过提取音频的特征并存储为指纹，实现了快速的本地歌曲识别，减少了对云服务的依赖，提高了识别速度并降低了 API 调用成本。

## 核心功能

### 音频指纹生成

#### 核心方法
- **方法名**：`generateFingerprint`
- **功能**：从音频数据生成唯一的指纹特征
- **参数**：
  - `base64Audio`：string，base64 编码的音频数据
- **返回值**：`Promise<number[]>`，音频指纹特征数组

#### 实现原理
1. **音频解码**：将 base64 编码的音频数据解码为原始音频
2. **特征提取**：
   - 时域特征：音量、能量、过零率
   - 频域特征：频谱能量分布、梅尔频率倒谱系数(MFCC)
3. **指纹生成**：将提取的特征转换为紧凑的数值数组
4. **特征压缩**：使用哈希或降维技术减少指纹大小

#### 技术实现
```typescript
export const generateFingerprint = async (base64Audio: string): Promise<number[]> => {
  try {
    // 1. Convert Base64 to ArrayBuffer
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    const arrayBuffer = bytes.buffer;

    // 2. Decode Audio
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    // 3. Setup Offline Analysis
    const offlineCtx = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = offlineCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0;

    source.connect(analyser);
    source.connect(offlineCtx.destination);

    // 4. Feature Extraction Loop
    const features: Set<number> = new Set();
    const sliceDuration = 0.2; // Analyze every 200ms
    const totalDuration = audioBuffer.duration;

    source.start(0);

    // We schedule "suspend" events to snapshot the frequency data
    for (let t = 0; t < totalDuration; t += sliceDuration) {
      offlineCtx.suspend(t).then(() => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);

        // Find dominant peak in relevant music range (Bass to Low-Mid)
        let maxVal = 0;
        let maxIndex = -1;
        
        // Filter out silence/noise
        for (let i = 2; i < 100; i++) {
            if (data[i] > maxVal) {
                maxVal = data[i];
                maxIndex = i;
            }
        }

        // Only store significant peaks (silence threshold ~50)
        if (maxVal > 50 && maxIndex !== -1) {
             features.add(maxIndex); 
        }
      });
    }

    await offlineCtx.startRendering();
    
    // Convert Set to Array
    return Array.from(features);

  } catch (e) {
    console.error("Fingerprint generation failed", e);
    return [];
  }
};
```

### 本地匹配

#### 核心方法
- **方法名**：`findLocalMatch`
- **功能**：在本地缓存中查找与给定指纹匹配的歌曲
- **参数**：
  - `features`：number[]，音频指纹特征数组
- **返回值**：`SongInfo | null`，匹配的歌曲信息或 null

#### 匹配算法
1. **加载缓存**：从 localStorage 加载已存储的指纹数据
2. **相似度计算**：
   - 欧氏距离：计算特征向量之间的距离
   - 余弦相似度：计算特征向量之间的夹角
   - 曼哈顿距离：计算特征向量之间的绝对差之和
3. **阈值判断**：将相似度与预设阈值比较
4. **结果选择**：返回相似度最高且超过阈值的匹配

#### 技术实现
```typescript
export const findLocalMatch = (features: number[]): SongInfo | null => {
  if (!features || features.length < 5) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const cache: FingerprintEntry[] = JSON.parse(raw);
    
    let bestMatch: SongInfo | null = null;
    let bestScore = 0;

    for (const entry of cache) {
       const score = calculateJaccardSimilarity(features, entry.features);
       
       if (score > bestScore) {
           bestScore = score;
           bestMatch = entry.song;
       }
    }

    if (bestScore >= SIMILARITY_THRESHOLD && bestMatch) {
        return bestMatch;
    }

    return null;

  } catch (e) {
    console.error("Local match lookup failed", e);
    return null;
  }
};

// Jaccard Similarity: Intersection over Union
function calculateJaccardSimilarity(arr1: number[], arr2: number[]): number {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    
    let intersection = 0;
    set1.forEach(val => {
        if (set2.has(val)) intersection++;
    });
    
    const union = set1.size + set2.size - intersection;
    if (union === 0) return 0;
    
    return intersection / union;
}
```

### 结果缓存

#### 核心方法
- **方法名**：`saveToLocalCache`
- **功能**：将识别的歌曲信息和指纹存储到本地缓存
- **参数**：
  - `features`：number[]，音频指纹特征数组
  - `songInfo`：SongInfo，识别的歌曲信息
- **返回值**：`void`

#### 缓存策略
1. **缓存限制**：设置最大缓存数量，避免存储过多数据
2. **缓存过期**：实现缓存过期机制，定期清理旧数据
3. **数据压缩**：优化存储格式，减少存储空间
4. **冲突处理**：当缓存已满时，替换最旧或相似度最低的条目

#### 技术实现
```typescript
export const saveToLocalCache = (features: number[], song: SongInfo) => {
  if (!features || features.length < 5) return; // Ignore weak signals

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let cache: FingerprintEntry[] = raw ? JSON.parse(raw) : [];

    // Check if song already exists, update it
    const existingIndex = cache.findIndex(c => 
        c.song.title.toLowerCase() === song.title.toLowerCase() && 
        c.song.artist.toLowerCase() === song.artist.toLowerCase()
    );

    if (existingIndex >= 0) {
        cache.splice(existingIndex, 1);
    }

    // Add new entry
    const entry: FingerprintEntry = {
        features,
        song: { ...song, matchSource: 'LOCAL' }, // Ensure cached items are marked LOCAL
        timestamp: Date.now()
    };

    cache.unshift(entry); // Add to top

    // Trim
    if (cache.length > MAX_CACHE_SIZE) {
        cache = cache.slice(0, MAX_CACHE_SIZE);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Local storage save failed", e);
  }
};
```

## 技术实现细节

### 常量定义

```typescript
const STORAGE_KEY = 'sv_fingerprints_v1';
const MAX_CACHE_SIZE = 50;
const SIMILARITY_THRESHOLD = 0.25; // Jaccard threshold (low because clips vary in content)

interface FingerprintEntry {
  features: number[]; // Set of dominant frequency bins
  song: SongInfo;
  timestamp: number;
}
```

### 音频特征提取

#### 频域特征提取
- **FFT 分析**：使用 1024 点 FFT 获取频域信息
- **峰值检测**：在每个时间切片中检测主要频率峰值
- **频率范围**：专注于 0-4300Hz 的音乐相关频率范围
- **特征选择**：只存储显著的峰值，忽略噪声和静默

### 指纹生成算法

#### 哈希函数
- **功能**：将高维特征转换为紧凑的哈希值
- **优势**：减少存储空间，加快匹配速度

#### 特征降维
- **主成分分析(PCA)**：减少特征维度
- **线性判别分析(LDA)**：提高特征的判别能力

### 本地存储

#### 存储格式
- **数据结构**：
  ```typescript
  interface CachedFingerprint {
    fingerprint: number[];
    song: SongInfo;
    timestamp: number;
  }
  ```
- **存储方式**：使用 localStorage 存储 JSON 格式数据

#### 存储优化
- **数据压缩**：使用 JSON 压缩或自定义编码减少存储大小
- **索引结构**：实现简单的索引以加快查找速度

## 与其他模块的集成

### 与歌曲识别模块

#### 数据流向
- **指纹数据**：fingerprintService → geminiService
- **集成点**：
  - 指纹生成：`generateFingerprint(base64Audio)`
  - 本地匹配：`findLocalMatch(features)`
  - 结果缓存：`saveToLocalCache(features, aiResult)`

#### 调用时机
- **预 AI 调用**：在调用 Google Gemini API 前先进行本地匹配
- **后 AI 调用**：当 AI 成功识别歌曲后，将结果缓存到本地

### 与音频处理模块

#### 数据流向
- **音频数据**：音频处理模块 → fingerprintService
- **集成点**：从音频处理模块获取的音频数据用于生成指纹

### 与用户界面模块

#### 结果展示
- **功能**：在界面上显示本地匹配的结果
- **集成点**：SongOverlay 组件
- **显示内容**：歌曲标题、艺术家、匹配来源（标记为本地）

## 性能优化

### 指纹生成优化

#### 计算优化
- **增量计算**：只计算必要的特征
- **并行处理**：使用 Web Workers 进行密集计算
- **缓存中间结果**：避免重复计算

#### 存储优化
- **特征选择**：选择最具判别力的特征
- **量化**：对特征进行适当的量化，减少存储空间

### 匹配速度优化

#### 索引结构
- **空间分区**：使用 KD 树或球树等数据结构加速最近邻搜索
- **近似搜索**：在保证准确率的前提下使用近似搜索算法

#### 并行计算
- **批量处理**：同时计算多个候选匹配的相似度
- **早期终止**：当找到足够好的匹配时提前终止搜索

## 错误处理

### 指纹生成错误

#### 错误类型
- **音频解码错误**：无法解码音频数据
- **特征提取错误**：音频数据格式不支持
- **计算错误**：数值计算溢出或其他异常

#### 处理策略
- **错误捕获**：使用 try-catch 捕获异常
- **降级方案**：当指纹生成失败时，直接使用 AI 识别
- **错误日志**：记录详细的错误信息便于调试

### 缓存错误

#### 错误类型
- **存储错误**：localStorage 存储空间不足
- **解析错误**：缓存数据格式损坏
- **读取错误**：无法读取缓存数据

#### 处理策略
- **错误捕获**：使用 try-catch 捕获异常
- **缓存重置**：当缓存损坏时，重置缓存
- **降级方案**：当缓存不可用时，完全依赖 AI 识别

## 安全考虑

### 数据隐私

#### 存储安全
- **数据加密**：考虑对缓存的指纹数据进行加密
- **隐私保护**：只存储必要的歌曲信息，不存储完整音频

#### 访问控制
- **本地存储**：利用浏览器的同源策略保护 localStorage 数据
- **数据隔离**：确保不同用户的数据相互隔离

### 数据完整性

#### 校验机制
- **数据校验**：使用校验和确保缓存数据的完整性
- **错误检测**：检测并处理损坏的缓存数据

## 未来扩展

### 计划中的功能

#### 增强的指纹算法
- **功能**：改进指纹生成算法，提高匹配准确率
- **目标**：减少对 AI API 的依赖

#### 社区指纹库
- **功能**：建立社区驱动的指纹库
- **优势**：扩展本地识别覆盖范围

#### 跨设备同步
- **功能**：在用户的多个设备之间同步指纹缓存
- **优势**：提供一致的识别体验

### 技术路线

#### WebAssembly 优化
- **方向**：使用 WebAssembly 加速指纹生成和匹配
- **优势**：提高计算性能，支持更复杂的算法

#### 机器学习增强
- **方向**：使用机器学习优化特征提取和匹配
- **优势**：提高识别准确率和速度

## 测试策略

### 单元测试

#### 测试框架
- **框架**：Jest
- **测试重点**：
  - 指纹生成功能
  - 本地匹配算法
  - 缓存管理
  - 错误处理逻辑

### 集成测试

#### 测试框架
- **框架**：Cypress
- **测试场景**：
  - 完整的指纹识别流程
  - 缓存命中和未命中的情况
  - 与 AI 识别的集成
  - 错误处理和降级

### 性能测试

#### 测试工具
- **工具**：Chrome DevTools Performance
- **测试指标**：
  - 指纹生成时间
  - 匹配速度
  - 存储空间使用
  - 内存使用情况

### 准确性测试

#### 测试方法
- **方法**：使用已知歌曲的音频片段进行测试
- **评估指标**：
  - 识别准确率
  - 假阳性率
  - 假阴性率
  - 不同音频质量的表现

## 部署注意事项

### 浏览器兼容性

#### 存储限制
- **localStorage 限制**：不同浏览器的 localStorage 存储限制不同
- **处理策略**：检测存储限制，当空间不足时调整缓存大小

#### API 支持
- **Web Audio API**：确保浏览器支持必要的音频处理 API
- **降级方案**：在不支持的浏览器中禁用本地指纹功能

### 性能考虑

#### 设备性能
- **计算能力**：考虑不同设备的计算能力差异
- **处理策略**：根据设备性能调整指纹算法的复杂度

#### 电池使用
- **能耗优化**：减少密集计算，延长移动设备电池寿命
- **处理策略**：在移动设备上使用更轻量级的算法

### 维护和监控

#### 缓存管理
- **定期清理**：实现自动缓存清理机制
- **用户控制**：提供手动清理缓存的选项

#### 监控指标
- **识别率**：跟踪本地识别的成功率
- **缓存效率**：监控缓存命中率
- **性能指标**：跟踪指纹生成和匹配的性能