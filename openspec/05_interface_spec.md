# OpenSpec: UI/UX 与交互规范

## 1. 视觉层级 (Z-Index)
- **Z-0:** 核心渲染器 (Canvas/WebGL)。
- **Z-20:** 歌曲信息与歌词徽章。
- **Z-30:** 迷你交互栏 (Mini Bar)。
- **Z-40:** 扩展设置面板 (Control Panel)。
- **Z-100:** 自定义文字层 (Custom Text Overlay)。

## 2. 交互状态与闲置检测
- **Idle Timeout:** 3000ms。
- **全平台支持:** 为了兼容平板电脑与触摸设备，检测逻辑必须包含 `touchstart` 和 `touchmove` 事件。
- **状态优先级:** 
  - 当 **扩展设置面板 (isExpanded)** 处于开启状态时，闲置计时器必须挂起，UI 保持完全可见。
  - 只有在迷你栏模式下，3000ms 无交互才会触发 `isIdle`。
- **Mini Bar 视觉转换:** 
  - **活跃状态:** `opacity-100`, `backdrop-blur-3xl`, `bg-black/60`。
  - **闲置状态 (Idle):** `opacity-[0.12]`, `translate-y-2`, **必须移除 backdrop-blur 效果**。
  - *设计目的：平板设备上的模糊滤镜开销较高，闲置时移除模糊可提升性能并确保 UI 完美融入背景。*

## 3. 键盘映射
- `Space`: `toggleMicrophone`
- `R`: `randomizeSettings`
- `F`: `toggleFullscreen`
- `L`: `setShowLyrics`
- `H`: 隐藏/显示 UI（面板模式下无效）。

## 4. 组件一致性
- **控制面板布局:** 采用 `grid-cols-1 lg:grid-cols-3` 的响应式网格。
- **触控优化:** 所有滑块 (Slider) 和按钮必须拥有至少 `44x44px` 的点击/触碰感应区域（符合 WCAG 2.1 规范）。
