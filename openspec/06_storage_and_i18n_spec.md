# OpenSpec: 持久化与本地化规范

## 1. 持久化存储 (LocalStorage)
- **前缀:** `av_v1_` (版本号用于隔离破坏性变更)。
- **Key 列表:**
  - `mode`: 当前渲染模式。
  - `theme`: 数组字符串化后的色盘。
  - `settings`: 完整的配置对象 (包含 `monitor`, `autoRotate`, `customText`, `rotateInterval` 等)。
  - `deviceId`: 用户选择的特定音频输入设备 ID。
  - `fingerprints`: 指纹缓存库。

## 2. 国际化 (i18n)
- **引擎:** 基于 React 状态的主动切换。
- **语言支持:** 
  - `en`: 默认 fallback。
  - `zh`: 适配中文语义与排版。
  - `ja`: 适配日文渲染。
- **数据结构:** 嵌套对象字典，支持带参数的 Hint 提示。

## 3. 区域感知 (Region Awareness)
- **自动检测:** 首次运行通过 `navigator.language` 自动选择匹配的市场区域。
- **作用域:** 影响 Gemini 搜索工具的地理偏移，提高本地歌曲识别率。

---
*Aura Vision Storage & i18n - Version 0.4.3*