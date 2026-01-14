
# Aura Vision 🎵👁️

### AI 驱动的 3D 音乐可视化与识别平台 (v0.2.18)

[English](README.md) | [在线演示](https://aura.tanox.net/)

![License](https://img.shields.io/badge/License-GPL%20v2-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-white?logo=three.js&logoColor=black)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%203.0-8E75B2?logo=google&logoColor=white)

**Aura Vision** 是一个完全基于浏览器的沉浸式视听实验。它结合了 **WebGL** (Three.js) 的实时生成艺术与 **Google Gemini 3.0** 的多模态 AI 能力，能够将麦克风捕捉的音频转化为震撼的视觉效果，并实时识别歌曲、检测情绪及同步歌词。

<p align="center">
  <img src="assets/images/preview_main.png" width="48%" alt="Aura Vision 主界面" />
  <img src="assets/images/preview_ui.png" width="48%" alt="Aura Vision 设置面板" />
</p>

---

## ✨ 核心特性

*   **🧠 多模态 AI 智能:** 由 `gemini-3-pro-preview` 驱动。通过“聆听”音频流来识别歌曲，分析音乐情绪（如“充满活力”、“忧郁”），并自动获取歌词。
*   **🔍 搜索增强 (Grounding):** 集成 **Google Search** 工具进行实时元数据验证，大幅提升对中文歌曲、冷门曲目及混音版的识别准确率。
*   **🎨 8+ 种视觉引擎:** 包含 **流光绸缎 (Silk Waves)**、**液态星球**、**霓虹光环**及**几何隧道**等多种基于 FFT 频谱分析的数学渲染模式。
*   **⚡ 智能响应:** 内置静音检测算法，可在切歌时瞬间触发 AI 重新识别，无需漫长等待。
*   **🌊 丝滑过渡:** 采用高精度色彩插值算法，确保在自动切换主题时视觉零跳动，如呼吸般自然。
*   **🔒 隐私优先:** 频谱分析完全在本地完成。仅在识别请求时发送经过加密的短音频片段至 Gemini。

## 🛠️ 技术栈

*   **核心:** React 18, TypeScript, Vite
*   **图形:** Three.js, @react-three/fiber, 后期处理 (Bloom, TiltShift)
*   **AI:** Google GenAI SDK (`@google/genai`)
*   **样式:** Tailwind CSS

## 🚀 快速开始

1.  **克隆并安装**
    ```bash
    git clone https://github.com/AjaCHN/AuraVision.git
    cd AuraVision && npm install
    ```

2.  **配置 API 密钥**
    在根目录创建 `.env` 文件并填入你的 [Google AI Studio](https://aistudio.google.com/) 密钥（需支持 Gemini 3.0 及 Google Search 工具）：
    ```env
    API_KEY=your_api_key_here
    ```

3.  **运行**
    ```bash
    npm run dev
    ```

> **🎧 关键提示:** 为了获得最佳的视觉跳动效果，请确保您的操作系统或浏览器**未开启**针对麦克风的“噪声抑制”或“回声消除”功能。这些功能会过滤掉可视化所需的低音/高音频率。

## 📄 许可证

基于 GNU General Public License v2.0 许可证分发。

---
*Made with 💜 using React and Google Gemini API*