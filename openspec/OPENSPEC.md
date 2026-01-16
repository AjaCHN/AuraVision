# Aura Vision - OpenSpec 规范主文档

本项目严格遵循 **OpenSpec** 标准进行架构设计与文档编写。Aura Vision 是一项融合了高性能实时频谱分析与 Google Gemini 3 系列生成式 AI 的沉浸式视听交互实验。

## 核心规范体系 (Current Standard)

以下文档位于 `openspec/` 目录下，代表了本项目的最新技术标准：

1.  **[01 架构与设计规范](./01_architecture_spec.md)**
    *   技术栈、核心生命周期、模块化数据流。
2.  **[02 音频引擎与信号规范](./02_audio_engine_spec.md)**
    *   Web Audio 采集、FFT 分析、声学指纹特征提取算法。
3.  **[03 视觉生成渲染规范](./03_rendering_spec.md)**
    *   2D 策略模式渲染器、3D WebGL 顶点位移算法。
4.  **[04 AI 智能与语义规范](./04_ai_integration_spec.md)**
    *   Gemini 3 模型配置、搜索增强 (Search Grounding) 与结构化输出 Schema。
5.  **[05 UI/UX 与交互规范](./05_interface_spec.md)**
    *   状态转换逻辑、面板布局系统、闲置隐藏策略、快捷键映射表。
6.  **[06 持久化与国际化规范](./06_storage_and_i18n_spec.md)**
    *   LocalStorage Schema、多语言字典结构与区域偏好。
7.  **[07 部署与环境规范](./07_deployment_guide.md)**
    *   API 配置、构建流程、多平台托管与生产安全。

---
*Aura Vision Project Specification - Version 0.7.5*