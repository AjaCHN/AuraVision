# 数据模型规范

## 概述
本文档详细描述了 SonicVision 项目中使用的所有数据类型、接口和枚举定义。这些数据模型是整个应用的基础，用于规范数据结构和类型检查，确保代码的类型安全和一致性。

## 核心类型定义

### 基本类型

#### Language
- **类型**：字符串字面量类型
- **定义**：
  ```typescript
  export type Language = 'en' | 'zh';
  ```
- **描述**：表示应用界面语言
- **值**：
  - `'en'`：英语
  - `'zh'`：简体中文
- **使用位置**：
  - App.tsx：语言状态管理
  - geminiService.ts：AI 响应语言设置
  - Controls.tsx：语言选择控件

#### Region
- **类型**：字符串字面量类型
- **定义**：
  ```typescript
  export type Region = 'global' | 'US' | 'CN' | 'JP' | 'KR' | 'EU' | 'LATAM';
  ```
- **描述**：表示用户所在区域，影响歌曲识别的区域优先级
- **值**：
  - `'global'`：全球
  - `'US'`：美国
  - `'CN'`：中国
  - `'JP'`：日本
  - `'KR'`：韩国
  - `'EU'`：欧洲
  - `'LATAM'`：拉丁美洲
- **使用位置**：
  - App.tsx：区域状态管理
  - geminiService.ts：AI 识别区域上下文
  - Controls.tsx：区域选择控件

### 枚举类型

#### VisualizerMode
- **类型**：枚举
- **定义**：
  ```typescript
  export enum VisualizerMode {
    BARS = 'BARS',
    PLASMA = 'PLASMA',
    PARTICLES = 'PARTICLES',
    TUNNEL = 'TUNNEL',
    SHAPES = 'SHAPES',
    RINGS = 'RINGS',
    NEBULA = 'NEBULA', 
    KALEIDOSCOPE = 'KALEIDOSCOPE',
    LASERS = 'LASERS',   
    STROBE = 'STROBE',   
    // WebGL Modes
    SILK = 'SILK',
    LIQUID = 'LIQUID',
    TERRAIN = 'TERRAIN'
  }
  ```
- **描述**：表示音频可视化的模式
- **分类**：
  - **2D 模式**：BARS, PLASMA, PARTICLES, TUNNEL, SHAPES, RINGS, NEBULA, KALEIDOSCOPE, LASERS, STROBE
  - **3D 模式**：SILK, LIQUID, TERRAIN
- **使用位置**：
  - App.tsx：可视化模式状态管理
  - VisualizerCanvas.tsx：2D 可视化渲染
  - ThreeVisualizer.tsx：3D 可视化渲染
  - Controls.tsx：模式选择控件

#### LyricsStyle
- **类型**：枚举
- **定义**：
  ```typescript
  export enum LyricsStyle {
    STANDARD = 'STANDARD',
    KARAOKE = 'KARAOKE',
    MINIMAL = 'MINIMAL'
  }
  ```
- **描述**：表示歌词显示的风格
- **值**：
  - `STANDARD`：标准风格
  - `KARAOKE`：卡拉OK风格，突出显示当前歌词
  - `MINIMAL`：极简风格，只显示必要信息
- **使用位置**：
  - App.tsx：歌词风格状态管理
  - VisualizerCanvas.tsx：歌词渲染
  - SongOverlay.tsx：歌曲信息覆盖层
  - Controls.tsx：歌词风格选择控件

### 接口类型

#### SongInfo
- **类型**：接口
- **定义**：
  ```typescript
  export interface SongInfo {
    title: string;
    artist: string;
    lyricsSnippet?: string;
    mood?: string;
    identified: boolean;
    searchUrl?: string;
    matchSource?: 'AI' | 'LOCAL';
  }
  ```
- **描述**：表示识别的歌曲信息
- **属性**：
  - `title`：歌曲标题
  - `artist`：艺术家名称
  - `lyricsSnippet`：歌词片段（可选）
  - `mood`：歌曲情绪（可选）
  - `identified`：是否成功识别
  - `searchUrl`：歌曲搜索链接（可选）
  - `matchSource`：匹配来源，'AI' 或 'LOCAL'（可选）
- **使用位置**：
  - App.tsx：当前歌曲状态管理
  - VisualizerCanvas.tsx：歌词显示
  - SongOverlay.tsx：歌曲信息展示
  - geminiService.ts：AI 识别结果
  - fingerprintService.ts：本地匹配结果

#### VisualizerSettings
- **类型**：接口
- **定义**：
  ```typescript
  export interface VisualizerSettings {
    sensitivity: number; // 1.0 to 3.0
    speed: number;       // 0.5 to 2.0
    glow: boolean;       // Enable shadowBlur
    trails: boolean;     // Enable transparency clearing
    autoRotate: boolean; // Automatically switch modes
    rotateInterval: number; // Seconds between rotation
    hideCursor: boolean; // Whether to hide the mouse cursor
  }
  ```
- **描述**：表示可视化效果的设置选项
- **属性**：
  - `sensitivity`：灵敏度，范围 1.0 到 3.0
  - `speed`：速度，范围 0.5 到 2.0
  - `glow`：是否启用发光效果
  - `trails`：是否启用轨迹效果
  - `autoRotate`：是否自动切换模式
  - `rotateInterval`：自动切换模式的时间间隔（秒）
  - `hideCursor`：是否隐藏鼠标光标
- **使用位置**：
  - App.tsx：可视化设置状态管理
  - VisualizerCanvas.tsx：2D 可视化渲染
  - ThreeVisualizer.tsx：3D 可视化渲染
  - Controls.tsx：设置调整控件

#### VisualizerConfig
- **类型**：接口
- **定义**：
  ```typescript
  export interface VisualizerConfig {
    mode: VisualizerMode;
    sensitivity: number;
    colorTheme: string[];
  }
  ```
- **描述**：表示可视化配置的简化版本
- **属性**：
  - `mode`：可视化模式
  - `sensitivity`：灵敏度
  - `colorTheme`：颜色主题数组
- **使用位置**：
  - 用于简化可视化配置的传递和存储

#### IVisualizerRenderer
- **类型**：接口
- **定义**：
  ```typescript
  export interface IVisualizerRenderer {
    init(canvas: HTMLCanvasElement): void;
    draw(
      ctx: CanvasRenderingContext2D, 
      data: Uint8Array, 
      width: number, 
      height: number, 
      colors: string[], 
      settings: VisualizerSettings,
      rotation: number
    ): void;
    cleanup?(): void;
  }
  ```
- **描述**：可视化渲染器的策略模式接口
- **方法**：
  - `init(canvas: HTMLCanvasElement)`：初始化渲染器
  - `draw(ctx, data, width, height, colors, settings, rotation)`：绘制可视化效果
  - `cleanup()`：清理资源（可选）
- **使用位置**：
  - visualizerStrategies.ts：实现不同的可视化渲染策略
  - VisualizerCanvas.tsx：使用渲染器绘制 2D 效果

#### AudioDevice
- **类型**：接口
- **定义**：
  ```typescript
  export interface AudioDevice {
    deviceId: string;
    label: string;
  }
  ```
- **描述**：表示音频输入设备
- **属性**：
  - `deviceId`：设备唯一标识符
  - `label`：设备名称
- **使用位置**：
  - App.tsx：音频设备列表状态管理
  - Controls.tsx：设备选择下拉菜单

## 数据模型关系

### 核心数据流

#### 应用状态
```
App.tsx
├── mode: VisualizerMode
├── colorTheme: string[]
├── settings: VisualizerSettings
├── isListening: boolean
├── isIdentifying: boolean
├── currentSong: SongInfo
├── lyricsStyle: LyricsStyle
├── showLyrics: boolean
├── language: Language
├── region: Region
├── audioDevices: AudioDevice[]
└── selectedDeviceId: string
```

#### 组件数据流
```
App.tsx → VisualizerCanvas
├── analyser: AnalyserNode
├── mode: VisualizerMode
├── colors: string[]
├── settings: VisualizerSettings
├── song: SongInfo
├── showLyrics: boolean
└── lyricsStyle: LyricsStyle

App.tsx → ThreeVisualizer
├── analyser: AnalyserNode
├── mode: VisualizerMode
├── colors: string[]
└── settings: VisualizerSettings

App.tsx → Controls
├── currentMode: VisualizerMode
├── setMode: Function
├── colorTheme: string[]
├── setColorTheme: Function
├── toggleMicrophone: Function
├── isListening: boolean
├── isIdentifying: boolean
├── lyricsStyle: LyricsStyle
├── setLyricsStyle: Function
├── showLyrics: boolean
├── setShowLyrics: Function
├── language: Language
├── setLanguage: Function
├── region: Region
├── setRegion: Function
├── settings: VisualizerSettings
├── setSettings: Function
├── resetSettings: Function
├── randomizeSettings: Function
├── audioDevices: AudioDevice[]
├── selectedDeviceId: string
└── onDeviceChange: Function

App.tsx → SongOverlay
├── song: SongInfo
├── lyricsStyle: LyricsStyle
├── showLyrics: boolean
├── language: Language
├── onRetry: Function
├── onClose: Function
├── analyser: AnalyserNode
└── sensitivity: number
```

#### 服务数据流
```
geminiService.ts
├── identifySongFromAudio(base64Audio, mimeType, language, region): Promise<SongInfo | null>
└── 返回: SongInfo

fingerprintService.ts
├── generateFingerprint(audioData): Promise<number[]>
├── findLocalMatch(features): SongInfo | null
└── saveToLocalCache(features, songInfo): void
```

## 类型使用规范

### 类型导入
- **统一导入**：从 `./types` 模块导入所有类型定义
- **导入方式**：使用命名导入，避免命名冲突

### 类型检查
- **TypeScript 严格模式**：启用严格模式进行类型检查
- **类型断言**：仅在必要时使用类型断言，并确保安全性
- **可选属性**：正确使用可选属性（`?`）标记可能不存在的属性

### 枚举使用
- **枚举值访问**：使用枚举名称访问值，避免硬编码字符串
- **枚举遍历**：使用 `Object.values()` 遍历枚举值

### 接口扩展
- **接口继承**：当需要扩展现有接口时，使用接口继承
- **类型组合**：使用交叉类型（`&`）组合多个类型

## 数据模型版本管理

### 版本控制
- **类型变更**：当修改现有类型时，考虑向后兼容性
- **存储版本**：在本地存储中使用版本号管理数据结构变更

### 示例
```typescript
// 存储版本化的设置
localStorage.setItem('sv_settings_v2', JSON.stringify(settings));

// 读取版本化的设置
const [settings, setSettings] = useState<VisualizerSettings>(() => 
  getStorage('sv_settings_v2', DEFAULT_SETTINGS)
);
```

## 未来扩展

### 计划中的数据模型

#### UserPreferences
- **描述**：用户偏好设置的综合接口
- **属性**：
  - `visualizer`: VisualizerConfig
  - `audio`: AudioPreferences
  - `interface`: InterfacePreferences
  - `language`: Language
  - `region`: Region

#### AudioPreferences
- **描述**：音频相关的偏好设置
- **属性**：
  - `deviceId`: string
  - `inputGain`: number
  - `noiseReduction`: boolean

#### InterfacePreferences
- **描述**：界面相关的偏好设置
- **属性**：
  - `theme`: 'light' | 'dark' | 'auto'
  - `layout`: 'default' | 'compact' | 'expanded'
  - `animationLevel`: 'none' | 'minimal' | 'full'

### 类型系统优化

#### 泛型使用
- **方向**：在适当的地方使用泛型，提高代码复用性
- **示例**：
  ```typescript
  export interface IStorageService<T> {
    save(key: string, data: T): void;
    load(key: string): T | null;
    remove(key: string): void;
  }
  ```

#### 条件类型
- **方向**：使用条件类型处理复杂的类型逻辑
- **示例**：
  ```typescript
  export type VisualizerSpecificSettings<M extends VisualizerMode> = 
    M extends VisualizerMode.SILK ? SilkSettings :
    M extends VisualizerMode.LIQUID ? LiquidSettings :
    M extends VisualizerMode.TERRAIN ? TerrainSettings :
    VisualizerSettings;
  ```

## 测试策略

### 类型测试

#### TypeScript 编译检查
- **工具**：`tsc --noEmit`
- **目的**：确保所有类型定义正确，无类型错误

#### 类型断言测试
- **工具**：单元测试
- **目的**：验证类型断言的安全性和正确性

### 数据模型验证

#### 接口实现测试
- **工具**：单元测试
- **目的**：确保所有接口实现正确，无遗漏方法

#### 数据完整性测试
- **工具**：集成测试
- **目的**：验证数据在不同组件和服务之间传递的完整性

### 性能测试

#### 大型数据结构
- **工具**：性能分析工具
- **目的**：确保大型数据结构的处理性能

#### 内存使用
- **工具**：内存分析工具
- **目的**：监控数据模型的内存使用情况