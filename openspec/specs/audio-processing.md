# 音频处理功能规范

## 功能概述
音频处理模块是 SonicVision 的核心组件之一，负责音频输入的获取、处理和分析。该模块使用 Web Audio API 和 MediaRecorder API 实现实时音频捕获、设备管理和音频数据处理，为可视化和歌曲识别功能提供基础数据。

## 核心功能

### 音频设备管理

#### 设备枚举
- **功能**：列出所有可用的音频输入设备
- **技术实现**：使用 `navigator.mediaDevices.enumerateDevices()` API
- **数据结构**：
  ```typescript
  interface AudioDevice {
    deviceId: string;
    label: string;
  }
  ```
- **实现流程**：
  1. 请求麦克风权限
  2. 枚举所有媒体设备
  3. 过滤出音频输入设备
  4. 格式化设备信息为 AudioDevice 接口

#### 设备选择
- **功能**：允许用户选择特定的音频输入设备
- **技术实现**：通过 `getUserMedia()` API 的 `deviceId` 约束
- **集成点**：Controls 组件提供设备选择界面
- **状态管理**：使用 React useState 管理选中的设备ID

### 麦克风访问

#### 权限管理
- **功能**：处理麦克风访问权限
- **技术实现**：使用 `navigator.mediaDevices.getUserMedia()` API
- **错误处理**：捕获并处理权限拒绝错误
- **用户提示**：当权限被拒绝时提供友好的错误提示

#### 音频流获取
- **功能**：获取音频输入流
- **技术实现**：
  ```typescript
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true 
  });
  ```
- **参数**：可选指定设备ID
- **返回值**：MediaStream 对象

### 音频分析

#### AudioContext 管理
- **功能**：创建和管理音频上下文
- **技术实现**：使用 `AudioContext` 或 `webkitAudioContext`
- **实现**：
  ```typescript
  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  ```
- **生命周期**：在麦克风开启时创建，关闭时释放

#### AnalyserNode 设置
- **功能**：分析音频数据
- **技术实现**：使用 `AudioContext.createAnalyser()`
- **配置**：
  ```typescript
  const node = context.createAnalyser();
  node.fftSize = 2048;
  ```
- **数据获取**：使用 `getByteFrequencyData()` 获取频率数据

#### 音频连接
- **功能**：连接音频源到分析器
- **技术实现**：
  ```typescript
  const src = context.createMediaStreamSource(stream);
  src.connect(node);
  ```
- **数据流**：MediaStream → MediaStreamSourceNode → AnalyserNode

### 音频录制

#### MediaRecorder 使用
- **功能**：录制音频片段用于歌曲识别
- **技术实现**：使用 `MediaRecorder` API
- **配置**：
  ```typescript
  const audioRecorder = new MediaRecorder(mediaStream);
  ```
- **录制时长**：默认录制 5 秒用于歌曲识别

#### 音频数据处理
- **功能**：处理录制的音频数据
- **技术实现**：
  ```typescript
  const chunks: Blob[] = [];
  audioRecorder.ondataavailable = (e) => chunks.push(e.data);
  audioRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    // 处理音频 blob
  };
  ```
- **数据转换**：将 Blob 转换为 base64 格式用于 API 调用

## 技术实现

### 核心 API

#### Web Audio API
- **用途**：音频分析和处理
- **核心组件**：AudioContext, AnalyserNode, MediaStreamSourceNode
- **浏览器兼容性**：支持所有现代浏览器

#### MediaDevices API
- **用途**：设备管理和媒体流获取
- **核心方法**：getUserMedia(), enumerateDevices()
- **权限要求**：需要用户授予麦克风访问权限

#### MediaRecorder API
- **用途**：音频录制
- **核心方法**：start(), stop()
- **事件**：ondataavailable, onstop

### 状态管理

#### 核心状态
- **isListening**：麦克风是否开启
- **audioContext**：音频上下文实例
- **analyser**：音频分析器实例
- **mediaStream**：媒体流实例
- **recorder**：媒体录制器实例
- **audioDevices**：可用音频设备列表
- **selectedDeviceId**：当前选中的设备ID

#### 状态持久化
- **实现**：使用 React useState 管理内存状态
- **持久化**：设备选择等设置通过 localStorage 持久化

### 错误处理

#### 常见错误
- **权限拒绝**：用户拒绝麦克风访问
- **设备不可用**：选中的设备被移除或不可用
- **API 不支持**：浏览器不支持某些 Web API
- **网络错误**：音频数据传输失败

#### 错误处理策略
- **权限错误**：提供友好的错误提示，引导用户启用权限
- **设备错误**：自动回退到默认设备
- **API 错误**：提供功能降级方案
- **网络错误**：实现重试机制

## 性能优化

### 资源管理

#### AudioContext 生命周期
- **创建**：仅在需要时创建
- **关闭**：在不需要时及时关闭，释放资源
- **实现**：
  ```typescript
  if (audioContext) audioContext.close();
  ```

#### MediaStream 管理
- **停止**：在不需要时停止所有轨道
- **实现**：
  ```typescript
  if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
  ```

### 计算优化

#### 频率数据处理
- **数据类型**：使用 Uint8Array 存储频率数据，提高性能
- **数据处理**：避免在渲染循环中进行复杂计算
- **缓存**：缓存计算结果，减少重复计算

#### 录制优化
- **录制时长**：控制录制时长，平衡识别 accuracy 和性能
- **数据大小**：优化音频数据大小，减少传输时间

## 与其他模块的集成

### 与可视化模块

#### 数据流向
- **音频分析数据**：AnalyserNode → VisualizerCanvas/ThreeVisualizer
- **集成点**：App.tsx 中的 analyser 状态传递
- **更新频率**：与动画帧同步，确保流畅的可视化效果

### 与歌曲识别模块

#### 数据流向
- **音频录制数据**：MediaRecorder → geminiService
- **集成点**：App.tsx 中的周期性识别调用
- **触发条件**：每 30 秒自动触发一次识别

### 与用户界面模块

#### 控制集成
- **麦克风控制**：Controls 组件提供麦克风开关按钮
- **设备选择**：Controls 组件提供设备选择下拉菜单
- **状态反馈**：显示麦克风状态和设备信息

## 响应式设计

### 设备适配

#### 桌面设备
- **功能**：完整的音频处理功能
- **优化**：充分利用系统资源，提供高质量音频分析

#### 移动设备
- **功能**：适配移动设备的音频处理
- **优化**：
  - 降低分析精度，减少资源消耗
  - 简化设备选择界面
  - 优化电池使用

### 网络环境

#### 在线环境
- **功能**：完整的音频处理和歌曲识别
- **优化**：实时音频分析和云识别

#### 离线环境
- **功能**：基本的音频可视化
- **限制**：歌曲识别功能不可用
- **降级方案**：使用本地可视化效果

## 安全考虑

### 隐私保护

#### 数据处理
- **音频数据**：仅在本地处理，不持久化存储
- **识别请求**：音频数据仅发送到 Google Gemini API，不存储
- **权限管理**：仅在用户明确授权后访问麦克风

#### 安全传输
- **API 调用**：使用 HTTPS 传输音频数据
- **数据加密**：音频数据在传输过程中加密

### 安全最佳实践
- **最小权限**：仅请求必要的麦克风权限
- **透明告知**：明确告知用户音频数据的使用方式
- **用户控制**：提供清晰的麦克风控制选项

## 未来扩展

### 计划中的功能

#### 高级音频处理
- **音频增强**：实现降噪和音频增强功能
- **频谱分析**：提供更详细的频谱分析
- **音频特征提取**：提取更多音频特征用于可视化

#### 多输入支持
- **多设备同时输入**：支持多个音频设备同时输入
- **音频混合**：实现多音频源的混合处理

#### 音频效果
- **实时音频效果**：添加均衡器、混响等音频效果
- **音频可视化联动**：音频效果与可视化效果联动

### 技术路线

#### Web Audio API 高级特性
- **空间音频**：使用 AudioWorklet 实现空间音频处理
- **自定义音频处理**：使用 AudioWorklet 创建自定义音频处理器

#### 机器学习集成
- **本地音频识别**：使用 WebML 在本地实现基本的音频识别
- **音频特征学习**：使用机器学习优化音频特征提取

## 测试策略

### 单元测试
- **测试框架**：Jest
- **测试重点**：
  - 音频设备管理功能
  - 错误处理逻辑
  - 状态管理

### 集成测试
- **测试框架**：Cypress
- **测试场景**：
  - 完整的音频处理流程
  - 设备切换功能
  - 权限管理流程

### 性能测试
- **测试工具**：Chrome DevTools Performance
- **测试指标**：
  - 音频分析的 CPU 使用率
  - 内存使用情况
  - 识别响应时间

### 兼容性测试
- **测试浏览器**：Chrome, Firefox, Safari, Edge
- **测试设备**：桌面和移动设备
- **测试重点**：API 兼容性和功能降级方案