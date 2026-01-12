# OpenSpec 文档结构

## 概述
本文档提供了 SonicVision 项目的 OpenSpec 文档结构说明，帮助您了解文档的组织方式和导航指南。

## 目录结构

```
openspec/
├── README.md              # 文档结构说明（本文档）
├── AGENTS.md              # OpenSpec 指令（简短版本）
├── project.md             # 项目上下文和约定
├── specs/                 # 功能模块规范
│   ├── audio-processing.md    # 音频处理功能
│   ├── data-models.md         # 数据模型定义
│   ├── song-identification.md # 歌曲识别功能
│   ├── user-interface.md      # 用户界面组件
│   └── visualization.md       # 音频可视化功能
├── services/              # 服务层规范
│   ├── fingerprint-service.md # 音频指纹服务
│   └── gemini-service.md      # Google Gemini 识别服务
├── processes/             # 业务流程规范
│   └── business-flows.md      # 核心业务流程
└── technical/             # 技术实现细节
    └── implementation-details.md # 技术实现细节
```

## 文档导航指南

### 1. 项目级文档
- **project.md**：了解项目的整体目的、技术栈、约定和约束
- **AGENTS.md**：快速了解 OpenSpec 指令和规范驱动开发流程

### 2. 功能模块规范
- **visualization.md**：详细了解音频可视化功能，包括所有可视化模式和设置
- **audio-processing.md**：了解音频输入处理、设备管理和音频分析
- **song-identification.md**：详细了解歌曲识别功能，包括 AI 调用流程和本地缓存
- **user-interface.md**：了解用户界面组件、布局和交互流程
- **data-models.md**：查看所有数据类型、接口和枚举定义

### 3. 服务层规范
- **gemini-service.md**：详细了解 Google Gemini API 调用和歌曲识别服务
- **fingerprint-service.md**：了解音频指纹生成、本地匹配和缓存机制

### 4. 业务流程规范
- **business-flows.md**：了解核心业务流程，包括音频处理、歌曲识别、可视化渲染和用户交互

### 5. 技术实现细节
- **implementation-details.md**：深入了解技术实现细节，包括 WebGL 实现、本地存储、性能优化等

## 文档使用建议

### 新团队成员
1. 首先阅读 **project.md** 了解项目上下文
2. 然后阅读 **AGENTS.md** 了解开发流程
3. 根据需要阅读相关功能模块的规范文档

### 开发新功能
1. 阅读 **business-flows.md** 了解相关业务流程
2. 查看 **data-models.md** 了解相关数据模型
3. 参考相关功能模块的规范文档
4. 遵循 **project.md** 中的约定

### 维护和扩展
1. 参考 **technical/implementation-details.md** 了解技术细节
2. 检查相关服务层规范文档
3. 确保所有变更都反映在相应的规范文档中

## 文档更新指南

### 何时更新文档
- 添加新功能时
- 修改现有功能时
- 更改技术实现时
- 发现文档与代码不一致时

### 更新流程
1. 确定需要更新的文档
2. 进行必要的修改
3. 确保文档与代码实现一致
4. 更新相关的交叉引用
5. 检查文档格式是否标准化

## 文档格式规范

### Markdown 格式
- 使用标准 Markdown 语法
- 标题层级清晰（#、##、### 等）
- 代码块使用 ```typescript ``` 格式
- 列表使用 - 符号
- 强调使用 **bold** 格式
- 链接使用 [text](url) 格式

### 内容规范
- 保持语言一致（英文技术术语，中文说明）
- 使用清晰、简洁的语言
- 提供足够的细节但避免冗余
- 包含相关的代码示例和流程图
- 保持文档与代码实现同步

## 版本管理

- 文档版本与代码版本保持同步
- 重要变更在文档中注明
- 使用语义化版本号管理文档变更

## 联系方式

如有文档相关问题或建议，请联系项目维护者。