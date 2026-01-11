# SonicVision AI 🎵👁️

[English](README.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%203.0-8E75B2?logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind-38B2AC?logo=tailwindcss&logoColor=white)

**SonicVision AI** 是一个沉浸式的、基于浏览器的音乐可视化体验。它将麦克风捕捉到的实时音频转化为令人惊叹的实时生成艺术。

由 **Google Gemini 3.0 Pro** 驱动，它超越了简单的可视化，通过定期监听音频流来**识别歌曲**，检测音乐情绪，并实时获取同步歌词。它现在利用 **Google Search Grounding** 来确保全球范围内歌曲识别的高准确率。

> ✨ **在线演示:** [在此插入链接]

---

## 🚀 功能特性

### 🧠 先进的 AI 智能
*   **Gemini 3.0 集成:** 使用最新的 `gemini-3-pro-preview` 模型进行多模态音频分析。
*   **搜索增强 (Search Grounding):** AI 聆听音频，转录歌词，并执行实时 **Google 搜索** 以验证曲名和艺术家。这大大提高了对冷门曲目、混音版和非英语歌曲（中文、日文、韩文等）的识别率。
*   **来源验证:** 提供可点击的 "Source (Google)" 链接以验证识别出的歌曲。
*   **歌词与情绪:** 自动获取官方歌词（或副歌）并检测氛围（如“充满活力”、“忧郁”），以微妙地调整 UI。
*   **区域优先:** 根据您选择的区域（全球、美国、中国、日本等）进行上下文感知的识别。

### 🎨 可视化模式
SonicVision AI 具有 8 种独特的、数学生成的视觉引擎：

*   **频率条 (Frequency Bars):** 带有渐变填充的经典镜像频谱分析仪。
*   **霓虹光环 (Neon Rings):** 随中频扩展和脉动的同心圆。
*   **星空 (Starfield):** 基于高音/踩镲加速的 3D 粒子场。
*   **几何隧道 (Geometric Tunnel):** 对轨道能量做出反应的催眠 3D 隧道。
*   **等离子流 (Plasma Flow):** 随节拍闪烁和脉动的流体有机颜色渐变。
*   **抽象形状 (Abstract Shapes):** 对特定频段做出反应的舞动几何图元。
*   **空灵烟雾 (Ethereal Smoke):** 受音频“风”影响的逼真烟雾模拟。
*   **水波纹 (Water Ripples):** 由低音底鼓触发的雨滴效果。

### 🎛️ 深度定制
*   **风格与主题:** 8 种预设颜色主题（赛博朋克、日落、黑客帝国等）。
*   **微调:** 调整灵敏度、速度、发光强度和运动拖尾。
*   **歌词样式:** 选择 **标准**、**卡拉OK** (渐变脉冲) 或 **极简** 样式。
*   **多语言支持:** 完全本地化支持 **英语** 和 **中文 (简体)**。

---

## 🛠️ 技术栈

*   **前端:** React 19, TypeScript
*   **样式:** Tailwind CSS, Custom Canvas API (2D Context)
*   **音频处理:** Web Audio API (`AnalyserNode`, `MediaStream`)
*   **AI 集成:** Google GenAI SDK (`@google/genai`) with Tool Use (Google Search)
*   **构建工具:** Vite

---

## 📦 快速开始

### 前提条件

*   Node.js (v18+)
*   已启用 **Gemini API** 的 Google Cloud 项目。
*   来自 [Google AI Studio](https://aistudio.google.com/) 的 API 密钥。
*   **注意:** 您的 API 密钥必须支持 `gemini-3-pro-preview` 模型和 Google Search 工具。

### 安装

1.  **克隆仓库**
    ```bash
    git clone https://github.com/yourusername/sonicvision-ai.git
    cd sonicvision-ai
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    在根目录下创建一个 `.env` 文件（或确保您的环境提供它）：

    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

    *注意: 应用程序通过 `process.env.API_KEY` 获取 API 密钥。*

4.  **运行开发服务器**
    ```bash
    npm run dev
    ```

5.  **构建生产版本**
    ```bash
    npm run build
    ```

---

## 🎮 使用指南与技巧

1.  **授予权限:** 启动后，点击“开始体验”并允许访问麦克风。
    
    > **🎧 关键音频提示:** 为了获得最佳视觉体验，请确保您的操作系统或浏览器**没有**对麦克风输入应用“噪声抑制”或“回声消除”。这些功能会过滤掉音乐频率（低音/高音），使可视化效果看起来平坦。
    >
    > *SonicVision 会尝试自动禁用这些功能，但系统级设置可能会覆盖它。*

2.  **控制:**
    *   **底部栏:** 访问控制面板以切换模式、更改颜色或调整设置。
    *   **麦克风图标:** 开启/关闭可视化器。
    *   **设置:** 启用“发光 (Glow)”用于霓虹效果，或“拖尾 (Trails)”用于更平滑的动态模糊。
    
3.  **AI 识别:**
    *   在背景中播放音乐。“监听中”指示器会脉动。
    *   每隔约 30 秒，应用程序会录制一小段片段并发送给 Gemini。
    *   模型会“聆听”，转录歌词，进行 Google 搜索，并返回结果。

---

## 🧩 项目结构

```
/
├── components/
│   ├── Controls.tsx        # 设置、模式切换和扩展的 UI
│   ├── HelpModal.tsx       # 信息和指南模态框
│   ├── SongOverlay.tsx     # 悬浮歌词、歌曲信息和来源链接
│   └── VisualizerCanvas.tsx# 核心 Canvas 渲染逻辑（所有 8 种模式）
├── services/
│   └── geminiService.ts    # 带有 Google Search 工具的 Gemini 3 客户端设置
├── constants.ts            # 可视化预设、颜色主题、模型配置
├── types.ts                # TypeScript 接口
├── translations.ts         # 国际化 (英语/中文)
└── App.tsx                 # 主应用程序逻辑与音频上下文管理
```

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1.  Fork 项目
2.  创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  打开 Pull Request

---

## 📄 许可证

基于 MIT 许可证分发。查看 `LICENSE` 了解更多信息。

---

*Made with 💜 using React and Google Gemini API*