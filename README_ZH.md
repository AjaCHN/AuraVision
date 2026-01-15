
# Aura Vision 🎵👁️

### AI 驱动的 3D 音乐可视化与曲目识别系统 (v0.7.0)

[English](README.md) | [在线演示](https://aura.tanox.net/)

<p align="center">
  <img src="./assets/images/aura-banner.jpg" alt="Aura Vision 横幅" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-white?logo=three.js&logoColor=black" />
  <img src="https://img.shields.io/badge/AI-Gemini%203.0-8E75B2?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/License-GPL%20v2-blue.svg" />
  <img src="https://img.shields.io/badge/SEO-已优化-success" />
</p>

**Aura Vision** 是一款将实时音频转化为沉浸式 3D 生成艺术的高端 Web 应用。它结合了先进的频谱分析技术与 **Google Gemini 3.0** 多模态大模型，不仅能随律动起舞，更能实时识别歌曲内容并自动调整视觉情绪。

---

### ✨ v0.7.0 更新：极光动态优化

*   **🌌 极光之舞 (Fluid Curves) 重构:** 重新调校了“极光之舞”模式的数学参数。波形在水平方向上被拉长了 **50%**，降低了频率密度，从而营造出更接近真实北极光那种宏大、舒展的流动感。
*   **🌍 国际化修复:** 修正了西班牙语（模式名称重复）和日语（显示为汉字而非假名）的翻译错误。
*   **📚 规范同步:** 更新了 OpenSpec 渲染文档，补充了关于 Fluid Curves 算法的定义。

### ✨ v0.6.9 更新：多语言与规范同步

*   **🌍 国际化打磨:** 深度优化了繁体中文、日语及英语的文案。
*   **📚 OpenSpec 同步:** 将系统架构规范文档与最新的代码库状态完全对齐。

### ✨ v0.6.8 更新：视觉引擎打磨

*   **🌌 星际穿越 (原速激星空):** 引入了动态原点漂移（Lissajous 轨迹）算法。
*   **🫧 微观液泡:** 新增**景深 (Depth of Field)** 模拟。

---

## 📸 视觉展示

| 流光绸缎 (WebGL) | 液态星球 (3D) | 低多边形山脉 (3D) |
| :---: | :---: | :---: |
| ![流光](./assets/images/showcase-silk.jpg) | ![星球](./assets/images/showcase-liquid.jpg) | ![地形](./assets/images/showcase-terrain.jpg) |

---

## 🎮 使用指南

**🚀 快速开始:** 直接在电脑、平板或手机的现代浏览器 (Chrome, Edge, Safari) 中访问 **[在线演示](https://aura.tanox.net/)** 即可，无需安装，即点即用。

1.  **授权权限:** 点击“开始体验”或底部麦克风图标，允许浏览器访问麦克风。
2.  **播放音乐:** 在设备附近播放高保真音频。视觉效果将根据麦克风采集的声音实时跳动。
3.  **探索模式:** 打开**设置面板** (或按 `H`) 切换 12+ 种视觉引擎与色彩主题。
4.  **AI 识别:** 按 `L` 键或开启“AI 曲目识别”以分析当前播放的歌曲及其情绪 (需配置 Gemini API Key)。

### ⌨️ 快捷键列表

| 按键 | 功能 |
| :--- | :--- |
| **Space (空格)** | 开启/关闭 麦克风 |
| **F** | 切换全屏模式 |
| **R** | 随机切换视觉风格 |
| **L** | 显示/隐藏 AI 识别信息 |
| **H** | 展开/收起 控制面板 |
| **G** | 开关光晕特效 (Glow) |
| **T** | 开关拖尾特效 (Trails) |
| **← / →** | 切换可视化模式 |

---

## 🚀 核心应用场景

Aura Vision 适配多种专业与个人场景：

*   **📺 直播互动 (OBS/音乐主播):** 显著提升直播间的视觉档次。
*   **🎭 现场 VJ 与 派对:** 为 DJ 现场或家庭聚会提供即插即用的视觉支持。
*   **🌿 环境氛围装饰:** 投屏到智能电视，营造高端的数字化氛围。
*   **🧘 冥想与放松:** 打造视觉上的疗愈与宁静空间。
*   **💻 专注力助手:** 配合 Lo-fi 音乐，提供不干扰注意力的动态背景。

## ✨ 功能亮点

*   **🧠 Gemini 3.0 深度集成:** 实时曲目识别、歌手信息抓取及情绪感知。
*   **🎨 14+ 渲染引擎:** 从经典的频谱条到复杂的 WebGL 场景，现已全面优化。
*   **🎶 智能美学预设:** 一键应用专业 VJ 设计的视觉氛围。
*   **🔠 感官文字系统:** 支持自定义文字，可随节奏实时震动、缩放。
*   **🌍 全球本地化:** 深度适配中、英、日、韩等多国市场语言。

## 🛠️ 技术架构

*   **图形引擎:** Three.js & React Three Fiber
*   **人工智能:** Google Generative AI (Gemini 3 Flash)
*   **前端框架:** React 18.3.1, Tailwind CSS
*   **音频处理:** Web Audio API (实时 FFT)

---
*Made with 💜 using React and Google Gemini API*
