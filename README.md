
# SonicVision AI 🎵👁️

[中文文档](README_ZH.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%203.0-8E75B2?logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind-38B2AC?logo=tailwindcss&logoColor=white)

**SonicVision AI** is an immersive, browser-based music visualization experience. It transforms live audio from your microphone into stunning, real-time generative art.

Powered by **Google Gemini 3.0 Pro**, it goes beyond simple visualization by periodically listening to the audio stream to **identify songs**, detect the musical mood, and fetch synchronized lyrics in real-time. It now leverages **Google Search Grounding** to ensure high accuracy for song identification across global regions.

> ✨ **Live Demo:** [Insert Link Here]

---

## 🚀 Features

### 🧠 Advanced AI Intelligence
*   **Gemini 3.0 Integration:** Uses the latest `gemini-3-pro-preview` model for multimodal audio analysis.
*   **Smart Gap Detection:** Automatically detects silence between tracks (e.g., when a song ends). Once the music resumes, it **instantly triggers** the AI to identify the new song, ensuring lyrics and info are always up to date.
*   **Search Grounding:** The AI listens to audio, transcribes lyrics, and performs real-time **Google Searches** to verify track titles and artists. This drastically improves recognition rates for obscure tracks, remixes, and non-English songs (Chinese, Japanese, Korean, etc.).
*   **Source Verification:** Provides a clickable "Source (Google)" link to verify the identified song.
*   **Lyrics & Mood:** Automatically fetches official lyrics (or chorus) and detects the vibe (e.g., "Energetic", "Melancholic") to subtly adjust the UI.
*   **Region Prioritization:** Context-aware identification based on your selected region (Global, US, China, Japan, etc.).

### 🎨 Visualizer Modes
SonicVision AI features 8 distinct, mathematically generated visualization engines:

*   **Frequency Bars:** Classic mirrored spectrum analyzer with gradient fills.
*   **Neon Rings:** Concentric circles that expand and pulse with mid-range frequencies.
*   **Starfield:** A 3D particle field that accelerates based on treble/high-hats.
*   **Geometric Tunnel:** A hypnotic 3D tunnel that reacts to the track's energy.
*   **Plasma Flow:** Liquid, organic color gradients that flash and pulse with the beat.
*   **Abstract Shapes:** Dancing geometric primitives reacting to specific frequency bands.
*   **Ethereal Smoke:** Dual-stream smoke flowing slowly from top and bottom, converging at the center to create a mystical atmosphere.
*   **Water Ripples:** Raindrop effects triggered by bass kicks.

### 🎛️ Deep Customization
*   **Style & Themes:** 8 preset color themes (Cyberpunk, Sunset, Matrix, etc.).
*   **Fine-Tuning:** Adjust sensitivity, speed, glow intensity, and motion trails.
*   **Lyrics Styles:** Choose from **Standard**, **Karaoke** (Gradient Pulse), or **Minimal** styles.
*   **Multilingual Support:** Fully localized for **English** and **Chinese (Simplified)**.

---

## 🛠️ Tech Stack

*   **Frontend:** React 18, TypeScript
*   **Styling:** Tailwind CSS, Custom Canvas API (2D Context)
*   **Audio Processing:** Web Audio API (`AnalyserNode`, `MediaStream`)
*   **AI Integration:** Google GenAI SDK (`@google/genai`) with Tool Use (Google Search)
*   **Build Tool:** Vite

---

## 📦 Getting Started

### Prerequisites

*   Node.js (v18+)
*   A Google Cloud Project with the **Gemini API** enabled.
*   An API Key from [Google AI Studio](https://aistudio.google.com/).
*   **Note:** Your API key must support the `gemini-3-pro-preview` model and Google Search tool.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/sonicvision-ai.git
    cd sonicvision-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory (or ensure your environment provides it):

    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

    *Note: The application expects the API key to be available via `process.env.API_KEY`.*

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 🎮 Usage Guide & Tips

1.  **Grant Permissions:** Upon launching, click "Start Experience" and allow microphone access.
    
    > **🎧 Critical Audio Tip:** For the best visual experience, ensure your operating system or browser is **NOT** applying "Noise Suppression" or "Echo Cancellation" to your microphone input. These features filter out music frequencies (bass/treble), making the visualizer look flat.
    >
    > *SonicVision attempts to disable these automatically, but system-level settings may override this.*

2.  **Controls:**
    *   **Bottom Bar:** Access the control panel to switch modes, change colors, or adjust settings.
    *   **Microphone Icon:** Toggle the visualizer on/off.
    *   **Settings:** Enable "Glow" for neon effects or "Trails" for smoother motion blur.
    
3.  **AI Recognition:**
    *   Play music in the background. The "Listening" indicator will pulse.
    *   Every ~30 seconds (or immediately when a song change is detected), the app records a short clip and sends it to Gemini.
    *   The model "listens," transcribes lyrics, Google Searches them, and returns the result.

---

## 🧩 Project Structure

```
/
├── components/
│   ├── Controls.tsx        # UI for settings, mode switching, and expansion
│   ├── ControlWidgets.tsx  # Reusable UI primitives (Sliders, Toggles)
│   ├── HelpModal.tsx       # Info and Guide modal
│   ├── SongOverlay.tsx     # Floating lyrics, song info, and source links
│   ├── ThreeScenes.tsx     # WebGL scene definitions
│   ├── ThreeVisualizer.tsx # React Three Fiber canvas wrapper
│   └── VisualizerCanvas.tsx# Core 2D Canvas rendering logic (all 8 modes)
├── services/
│   └── geminiService.ts    # Gemini 3 client setup with Google Search tool
├── constants.ts            # Visualizer presets, color themes, model config
├── types.ts                # TypeScript interfaces
├── translations.ts         # i18n (English/Chinese)
└── App.tsx                 # Main application logic & Audio Context management
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Made with 💜 using React and Google Gemini API*