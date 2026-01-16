# OpenSpec: 部署与环境规范

## 1. 运行环境要求
- **Node.js**: 推荐版本 18.x 或 20.x (LTS)。
- **包管理器**: 推荐使用 `npm` (v9+) 或 `pnpm`。
- **浏览器权限**: 由于 Web Audio API 和 `getUserMedia` 的安全性限制，应用**必须**在 `localhost` 或带有 `HTTPS` 协议的域名下运行，否则无法访问麦克风。
- **React 锁定**: 本项目锁定 React 18.3.1 以确保与现有 3D 渲染组件的兼容性。

## 2. API 密钥配置 (Google Gemini)
本项目核心功能（曲目识别、语义分析）依赖 Google Gemini API。
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)。
2. 创建一个新的 API Key。
3. **本地开发**: 在项目根目录创建 `.env` 文件：
   ```env
   API_KEY=你的_GEMINI_API_KEY
   ```
4. **警告**: 切勿将包含真实密钥的 `.env` 文件提交至公共 Git 仓库。

## 3. 本地开发流程
```bash
# 1. 克隆仓库
git clone <repository-url>

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

## 4. 生产环境构建
执行以下命令生成优化后的静态资源：
```bash
npm run build
```
- **输出目录**: `build/`。
- **路径处理**: 已在 `vite.config.ts` 中配置 `base: './'`，支持部署到任何子路径或 IPFS。

## 5. 云平台部署方案

### 5.1 Vercel (推荐)
1. 导入 GitHub 仓库。
2. 在 **Environment Variables** 中添加 `API_KEY`。
3. 构建设置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 5.2 Netlify
1. 关联仓库并设置构建命令。
2. 在 **Site settings > Build & deploy > Environment** 中注入密钥。
3. 确保部署后开启 HTTPS。

## 6. 移动端与平板适配建议
- **PWA**: 建议部署为 PWA 以获得接近原生的全屏体验。
- **休眠锁**: 应用已集成 `WakeLock API`，但需确保在部署环境的权限策略中未禁用该功能。

---
*Aura Vision Deployment Guide - Version 0.7.5*