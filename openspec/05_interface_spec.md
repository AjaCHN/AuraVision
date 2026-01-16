# OpenSpec: UI/UX 与交互规范

## 1. 视觉层级 (Z-Index)
- **Z-0:** 核心渲染器 (Canvas/WebGL)。
- **Z-10:** 歌词覆盖层 (`LyricsOverlay`)。
- **Z-20:** 歌曲信息徽章 (`SongOverlay`)。
- **Z-100:** 自定义文字层 (`CustomTextOverlay`)。
- **Z-110:** 迷你控制条 (`MiniControls`)。
- **Z-120:** 扩展设置面板 (`Controls Panel`)。
- **Z-200:** 首次引导页 (`OnboardingOverlay`)。
- **Z-210:** 帮助与信息模态框 (`HelpModal`)。

## 2. 交互状态与闲置检测
- **Idle Timeout:** 3000ms。
- **平板兼容:** 必须包含 `touchstart` 事件监听以重置计时器。
- **Mini Bar 转换:** 闲置时透明度降低至 `0.12`，并移除 `backdrop-blur` 以优化移动端性能。

## 3. 控制面板布局规范 (Panel Layouts)
- **标签页顺序 (Tabs Order):** `Visual` (视觉), `Text` (文字), `AI` (识别), `Audio` (音频), `System` (系统)。
- **排版统一:** 所有设置项标题字号统一为 `text-xs` (12px)，保持视觉一致性。

## 4. 帮助模态框内容规范 (Help Modal Content)
- **Guide Tab (使用指南):** 必须包含以下四个标准步骤，确保与 README 一致：
  1. **Grant Permissions (授权权限):** 引导用户点击“开始”并允许麦克风访问。
  2. **Play Music (播放音乐):** 提示视觉效果将实时响应设备附近的音频。
  3. **Explore Modes (探索模式):** 指引用户通过快捷键 [H] 切换不同的渲染引擎。
  4. **AI Recognition (AI 识别):** 指引用户通过快捷键 [L] 识别曲目与情绪。

## 5. 键盘映射
- `Space`: `toggleMicrophone`
- `R`: `randomizeSettings`
- `F`: `toggleFullscreen`
- `L`: `setShowLyrics`
- `H`: `toggleExpanded`
- `G`: `toggleGlow`
- `T`: `toggleTrails`

---
*Aura Vision Interface - Version 0.7.5*