# OpenSpec: 持久化与本地化规范

## 1. 持久化存储 (LocalStorage)
- **前缀:** `av_v1_` (版本号用于隔离破坏性变更)。
- **Key 列表:**
  - `language`: 用户手动选择的语言键。
  - `mode`: 当前渲染模式。
  - `theme`: 数组字符串化后的色盘。
  - `settings`: 完整的配置对象 (包含 `monitor`, `autoRotate`, `customText` 等)。
  - `fingerprints`: 指纹缓存库。
  - `has_onboarded`: 首次引导完成状态。

## 2. 国际化 (i18n) 与自动检测
- **检测策略 (Browser-First):** 
  - 首次运行且无 LocalStorage 记录时，应用将查询 `navigator.language`。
  - **特例处理:** `zh-TW`, `zh-HK` 自动映射至繁体中文 (`tw`)，其余 `zh` 映射至简体中文 (`zh`)。
- **支持列表 (v0.7.5):** 
  - 英语 (en), 简体中文 (zh), 繁体中文 (tw), 日本语 (ja), 西班牙语 (es), 韩语 (ko), 德语 (de), 法语 (fr), 俄语 (ru), 阿拉伯语 (ar)。

## 3. 专业术语标准化 (v0.7.5)
为了对齐 **"AI Synesthesia Engine" (AI 通感引擎)** 的定位，所有翻译必须遵循以下标准：
- **AI Recognition** -> AI 通感识别 / AI Identification。
- **Visualizer Mode** -> 视觉引擎 / Visual Engine。
- **Start** -> 开启体验 / Launch Experience。

## 4. 区域化 AI 策略
- **Region Mapping:** 根据选择的 UI 语言自动映射默认搜索市场。
- **CN Market:** 优化中文歌曲的元数据搜索权重。
- **Linguistic Logic:** 识别结果必须返回原声脚本（如 日语歌曲返回假名/汉字而非罗马音）。

---
*Aura Vision Storage & i18n - Version 0.7.5*