
# OpenSpec: UI/UX 与交互规范

## 1. 视觉层级 (Z-Index)
- **Z-0:** 核心渲染器 (Canvas/WebGL)。
- **Z-20:** 歌曲信息与歌词徽章。
- **Z-40:** 扩展设置面板 (Control Panel)。
- **Z-100:** 自定义文字层 (Custom Text Overlay)。
- **Z-130:** 引导页与帮助模态框。

## 2. 交互状态与闲置检测
- **Idle Timeout:** 3000ms。
- **平板兼容:** 必须包含 `touchstart` 事件监听以重置计时器。
- **Mini Bar 转换:** 闲置时透明度降低至 `0.12`，并移除 `backdrop-blur` 以优化移动端性能。

## 3. 控制面板布局规范 (Panel Layouts)
所有扩展设置面板在 `lg` 屏幕下遵循三列式网格布局 (`grid-cols-3`)。

### 3.1 自定义文字面板 (Custom Text Panel)
1. **第一列 (Content):** 文字内容输入、字体选择、显示开关。
2. **第二列 (Style):** 颜色选择器与预设色块。
3. **第三列 (Layout):** 缩放、旋转、不透明度及位置九宫格。

### 3.2 AI 识别面板 (AI Panel)
1. **第一列 (Core):** 识别开关、AI 供应商、区域选择。
2. **第二列 (Style):** 歌词展示风格主题。
3. **第三列 (Position):** 歌词位置九宫格及重置按钮。

## 4. 键盘映射
- `Space`: `toggleMicrophone`
- `R`: `randomizeSettings` (随机美学组合)
- `F`: `toggleFullscreen`
- `L`: `setShowLyrics` (开启曲目识别)
- `H`: `toggleExpanded` (隐藏/显示面板)
- `G`: `toggleGlow` (光晕效果)

## 5. 触控优化
- 点击区域 (Hit Targets): 最小 `44x44px`。
- 滑块 (Sliders): 支持连续拖拽且在移动端禁用页面回弹。

---
*Aura Vision Interface - Version 0.4.2*
