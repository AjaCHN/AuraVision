
# OpenSpec: UI/UX 与交互规范

## 1. 视觉层级 (Z-Index)
- **Z-0:** 核心渲染器 (Canvas/WebGL)。
- **Z-10:** 歌词叠加层 (Lyrics Overlay)。
- **Z-20:** 歌曲信息徽章 (Song Badge)。
- **Z-30:** 迷你交互栏 (Mini Bar)。
- **Z-40:** 扩展设置面板 (Control Panel)。
- **Z-50:** 模态框与全局提示 (Help/Identifying)。

## 2. 交互状态
- **Idle Timeout:** 3000ms。
- **Mini Bar Behavioral Spec:** 
  - 非闲置: `opacity-100`, `translate-y-0`。
  - 闲置: `opacity-[0.15]`, `translate-y-2`。
- **Transitions:** 统一使用 `duration-700` 与 `ease-out`。

## 3. 键盘映射
- `Space`: `toggleMicrophone`
- `R`: `randomizeSettings`
- `F`: `toggleFullscreen`
- `L`: `setShowLyrics`
- `H`: 临时隐藏/显示 UI。
- `Arrow Keys`: 切换预设与主题。

## 4. 组件一致性 (UI Consistency)
- **控制面板卡片 (Settings Cards):**
  - 所有设置卡片应使用 `h-full` 填满网格行高。
  - 内部列表容器（如模式列表、主题列表）必须使用 `flex-1` 配合 `min-h-0`，移除固定 `max-h`，以适应不同分辨率。
- **按钮与输入框对齐:**
  - 主操作按钮（如“开启 AI 识别”）高度必须与标准 `CustomSelect` 输入框保持一致。
  - 标准内边距统一为 `py-3.5` (约 52px 总高度)。
- **开关组件 (Toggles):**
  - 所有自动循环（Auto Rotate/Cycle Colors）功能必须使用标准的滑动开关 (`SettingsToggle`) 样式。
  - 开关激活状态下需展开并显示相关联的滑块（如间隔时间）。
