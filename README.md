
# Aura Vision 🎵👁️

### AI-Powered 3D Music Visualizer & Identifier (v0.2.17)

[中文文档](README_ZH.md) | [Live Demo](https://aura.tanox.net/)

![License](https://img.shields.io/badge/License-GPL%20v2-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-white?logo=three.js&logoColor=black)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%203.0-8E75B2?logo=google&logoColor=white)

**Aura Vision** is a next-gen audio visualization experiment running entirely in your browser. It combines **WebGL** (Three.js) for stunning 3D generative art with **Google Gemini 3.0** for real-time AI music identification, mood detection, and lyric synchronization.

<p align="center">
  <img src="docs/preview_main.png" width="48%" alt="Aura Vision Main Interface" />
  <img src="docs/preview_ui.png" width="48%" alt="Aura Vision Settings Panel" />
</p>

---

## ✨ Key Features

*   **🧠 Multimodal AI Intelligence:** Powered by `gemini-3-pro-preview`. Listens to your audio to identify songs, detect mood (e.g., "Energetic", "Melancholic"), and fetch synchronized lyrics.
*   **🔍 Search Grounding:** Leverages **Google Search** tools to verify track metadata, ensuring high accuracy for global and obscure tracks.
*   **🎨 8+ Visualization Engines:** Features mathematically generated modes including **Silk Waves** (Vertex Displacement), **Liquid Sphere**, **Neon Rings**, and **Tunnel**, driven by real-time FFT analysis.
*   **⚡ Reactive Audio:** Smart algorithms detect silence/gaps to trigger immediate AI re-identification upon song changes.
*   **🔒 Privacy First:** Audio analysis is performed locally via Web Audio API. Only temporary short clips are sent to Gemini for identification.

## 🛠️ Tech Stack

*   **Core:** React 18, TypeScript, Vite
*   **Graphics:** Three.js, @react-three/fiber, Post-processing (Bloom, TiltShift)
*   **AI:** Google GenAI SDK (`@google/genai`)
*   **Styling:** Tailwind CSS

## 🚀 Quick Start

1.  **Clone & Install**
    ```bash
    git clone https://github.com/AjaCHN/AuraVision.git
    cd AuraVision && npm install
    ```

2.  **Setup API Key**
    Create a `.env` file and add your [Google AI Studio](https://aistudio.google.com/) key (must support Gemini 3.0 & Google Search):
    ```env
    API_KEY=your_api_key_here
    ```

3.  **Run**
    ```bash
    npm run dev
    ```

> **🎧 Critical Tip:** For the best visual response, ensure your OS or browser **Noise Suppression** / **Echo Cancellation** is disabled for your microphone. These features filter out the bass/treble frequencies needed for visualization.

## 📄 License

Distributed under the GNU General Public License v2.0.

---
*Made with 💜 using React and Google Gemini API*
