
# OpenSpec: UI/UX 与交互规范

## 1. 视觉层级 (Z-Index)
- **Z-0:** 核心渲染器 (Canvas/WebGL)。
- **Z-20:** 歌曲信息与歌词徽章 (Song Badge & Lyrics)。
- **Z-30:** 迷你交互栏 (Mini Bar)。
- **Z-40:** 扩展设置面板 (Control Panel)。
- **Z-50:** 模态框与全局提示 (Help/Identifying)。
- **Z-100:** 自定义文字层 (Custom Text Overlay) - *Override: 确保显示在所有其他 UI 元素之上，以实现强视觉冲击。样式已更新为白色填充+深色阴影描边，移除混合模式以适应黑色背景。*

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
- **控制面板布局 (Visual Panel Layout):**
  - **Column 1:** 模式选择列表 (2列布局 `grid-cols-2`)。
  - **Column 2:** 视觉主题 (Colors) + 核心滑块 (Speed/Sensitivity)。
  - **Column 3:** 高级选项 (Toggles, Quality) + 重置按钮。
- **控制面板卡片 (Settings Cards):**
  - 所有设置卡片应使用 `h-full` 填满网格行高。
  - 内部容器需添加唯一 `id` 便于调试 (如 `container-visual-modes`)。
  - 背景色应尽量减少透明度 (`bg-white/10` 或更深) 以提高文字对比度。
- **排版 (Typography):**
  - 设置选项标签统一使用 `text-[11px]` 或 `text-xs`，确保可读性。
  - 按钮文字大小不低于 `10px`。
- **开关组件 (Toggles):**
  - 样式更新：移除开关上的状态文字（如 "ON/OFF"），采用纯视觉化的胶囊开关设计。
  - 所有自动循环（Auto Rotate/Cycle Colors）功能必须使用标准的滑动开关 (`SettingsToggle`) 样式。
  - 开关激活状态下需展开并显示相关联的滑块（如间隔时间）。
