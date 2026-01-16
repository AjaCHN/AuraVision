# Changelog

All notable changes to the **Aura Vision** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.7.5] - AI Synesthesia Engine

### Added
*   **🌍 Global Localization:** Complete overhaul of internationalization dictionaries. Added professional translations for Japanese (ja), Spanish (es), Korean (ko), German (de), French (fr), Russian (ru), and Arabic (ar).
*   **🎨 Branding:** Formal establishment of the **AI Synesthesia Engine** branding identity across the UI and OpenSpec documentation.
*   **📋 OpenSpec:** Updated full specification suite (Architecture, Audio, Rendering, AI) to match v0.7.5 standards.

### Changed
*   **🛡️ Robustness:** Enhanced the main loop to strictly handle `undefined` values in color arrays during theme transitions, preventing potential render crashes.

## [v0.7.3] - Error Recovery Update

### Fixed
*   **🐛 Type Safety:** Fixed TypeScript compilation issues in `ErrorBoundary.tsx` by explicitly defining `state` and `props` types for the React class component.
*   **🔄 Auto-Recovery:** Added a "Factory Reset" mechanism to the global Error Boundary, allowing users to wipe corrupted LocalStorage settings if the app crashes on boot.

## [v0.7.2] - WebGL Context Stability

### Changed
*   **🖼️ GPU Handling:** Implemented `webglcontextlost` and `webglcontextrestored` event listeners in `ThreeVisualizer` to gracefully handle GPU resets (common on mobile devices when switching apps).
*   **🔊 Audio State:** Added visibility change listeners to automatically `resume()` the `AudioContext` when the tab returns to focus, fixing "silent" resume issues on iOS.

## [v0.7.1] - Mobile Performance Patch

### Fixed
*   **🔧 Asset Reliability:** Removed dependency on external HDR environment presets in "Liquid Sphere" mode. This fixes intermittent loading failures and out-of-memory crashes on low-end Android devices.

### Changed
*   **💡 Lighting System:** Replaced heavy IBL (Image Based Lighting) with a performance-optimized, multi-source local point light rig.

## [v0.7.0] - The "Aura" Rebirth

### Added
*   **✨ UI Overhaul:** Introduced the new 3-column "Control Center" layout (Visual / Audio / System).
*   **🧠 Gemini Integration:** First stable release featuring Google Gemini 3.0 Flash for real-time song identification and lyric fetching.
*   **🌊 WebGL Engines:** Added `SilkWaves`, `LiquidSphere`, and `LowPolyTerrain` 3D modes using `@react-three/fiber`.
*   **🎤 Audio Engine:** Rewrote the FFT analysis engine with customizable smoothing and sensitivity.
