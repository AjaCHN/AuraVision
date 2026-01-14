
import { VisualizerMode, LyricsStyle } from '../../types';

export const zh = {
  common: {
    on: '开启',
    off: '关闭',
    visible: '显示',
    hidden: '隐藏',
    active: '启用',
    muted: '静音',
    beta: '测试版'
  },
  tabs: {
    visual: '视觉',
    text: '文字',
    audio: '音频',
    ai: '曲目识别',
    system: '系统'
  },
  hints: {
    mode: '选择用于生成视觉效果的数学渲染引擎。',
    theme: '应用精心调校的场景配色方案。',
    speed: '时间流速倍率。低数值催眠舒缓，高数值动感强烈。',
    glow: '开启后期泛光（Bloom）。关闭可提升低端设备性能。',
    trails: '控制光影残留时间。高数值可产生如油画般的流动感。',
    sensitivity: '控制音频增益。数值越高，微弱的声音也能引发剧烈的视觉爆发。',
    smoothing: '时域阻尼系数。高数值如液体般柔顺，低数值则反应锐利。',
    fftSize: '频谱采样精度。4096 提供极致细节但消耗更多 CPU 资源。',
    lyrics: '启用 AI 驱动的曲目识别与歌词同步展示。',
    lyricsStyle: '更改识别结果及歌词的排版风格。',
    region: '针对特定音乐市场优化 AI 搜索的匹配权重。',
    autoRotate: '自动循环切换不同的可视化引擎。',
    rotateInterval: '自动切换到下一个可视化引擎前的停留时间（秒）。',
    cycleColors: '随时间推移自动平滑过渡色彩主题。',
    colorInterval: '平滑过渡到下一个色彩主题前的停留时间（秒）。',
    reset: '将所有应用配置、语言及音频选项恢复至出厂状态。',
    resetVisual: '仅重置视觉参数（速度、光晕、拖尾）至默认值。',
    randomize: '随机生成一套意想不到的模式与配色组合。',
    fullscreen: '进入沉浸式全屏交互模式。',
    help: '查看快捷键操作指南与项目详细文档。',
    mic: '启动或静音系统麦克风信号。',
    device: '选择当前活动的音频输入硬件。',
    monitor: '通过扬声器监听输入信号（警告：可能产生啸叫）。',
    hideCursor: '自动隐藏鼠标指针以获得纯净视觉。',
    wakeLock: '启用后，只要可视化处于活动状态，屏幕将保持常亮。'
  },
  visualizerMode: '可视化模式',
  styleTheme: '视觉风格',
  settings: '高级设置',
  sensitivity: '响应灵敏度',
  speed: '演化速度',
  glow: '霓虹光晕',
  trails: '动态拖尾',
  autoRotate: '可视化模式循环',
  rotateInterval: '切换间隔 (秒)',
  cycleColors: '自动循环配色',
  colorInterval: '切换间隔 (秒)',
  monitorAudio: '音频监听',
  audioInput: '输入源选择',
  lyrics: 'AI 曲目识别',
  showLyrics: '启用自动识别',
  displaySettings: '显示设置',
  language: '界面语言',
  region: '音乐市场定位',
  startMic: '开启音频监听',
  stopMic: '停止音频监听',
  listening: '监听中',
  identifying: 'AI 正在解析曲目...',
  startExperience: '开启视听盛宴',
  welcomeTitle: 'Aura Vision',
  welcomeText: '将声波转化为数字艺术。通过实时频域分析与 AI 语义识别，开启前所未有的视听交互体验。',
  hideOptions: '收起',
  showOptions: '显示设置',
  reset: '重置全局设置',
  resetVisual: '重置视觉参数',
  resetText: '重置文字设置',
  resetAudio: '重置音频设置',
  resetAi: '重置识别设置',
  randomize: '随机美学组合',
  help: '帮助与说明',
  close: '关闭',
  betaDisclaimer: 'Beta 功能：识别准确度正在持续优化中。',
  wrongSong: '识别有误？点击重试',
  hideCursor: '隐藏鼠标指针',
  customColor: '文字颜色',
  randomizeTooltip: '随机视觉设置 (快捷鍵: R)',
  smoothing: '动态平滑度',
  fftSize: '频域分辨率 (FFT)',
  appInfo: '关于应用',
  appDescription: '一个基于实时频域分析与 Gemini AI 语义识别的沉浸式音乐可视化套件。',
  version: '版本号',
  defaultMic: '系统默认麦克风',
  customText: '自定义文字内容',
  textProperties: '排版与布局',
  customTextPlaceholder: '输入文字',
  showText: '显示文字图层',
  pulseBeat: '随节奏律动',
  textSize: '字体大小',
  textRotation: '旋转角度',
  textFont: '字体样式',
  textOpacity: '不透明度',
  quality: '渲染画质',
  qualities: {
    low: '低',
    med: '中',
    high: '高'
  },
  recognitionSource: 'AI 识别源',
  lyricsPosition: '歌词显示位置',
  simulatedDemo: '模拟演示 (Demo)',
  positions: {
      top: '顶部',
      center: '居中',
      bottom: '底部'
  },
  wakeLock: '禁止屏幕休眠',
  system: {
    shortcuts: {
      mic: '麦克风',
      ui: '界面',
      mode: '模式',
      random: '随机'
    }
  },
  errors: {
    title: '音频错误',
    accessDenied: '无法访问麦克风，请检查浏览器权限。',
    noDevice: '未检测到音频输入设备。',
    deviceBusy: '音频设备被占用或无效。',
    general: '无法访问音频设备。'
  },
  aiState: {
    active: '识别功能已开启',
    enable: '开启 AI 识别'
  },
  regions: {
    global: '全球',
    US: '美国 / 西方',
    CN: '中国大陆',
    JP: '日本',
    KR: '韩国',
    EU: '欧洲',
    LATAM: '拉丁美洲'
  },
  modes: {
    [VisualizerMode.PLASMA]: '流体等离子',
    [VisualizerMode.BARS]: '镜像频谱分析',
    [VisualizerMode.PARTICLES]: '速激星空',
    [VisualizerMode.TUNNEL]: '几何时空隧道',
    [VisualizerMode.SHAPES]: '抽象几何演化',
    [VisualizerMode.RINGS]: '霓虹共振环',
    [VisualizerMode.NEBULA]: '深空星云',
    [VisualizerMode.KALEIDOSCOPE]: '迷幻万花筒',
    [VisualizerMode.LASERS]: '舞台激光矩阵',
    [VisualizerMode.SILK]: '流光绸缎 (WebGL)',
    [VisualizerMode.LIQUID]: '液态星球 (WebGL)',
    [VisualizerMode.TERRAIN]: '低多边形山脈 (WebGL)'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: '标准排版',
    [LyricsStyle.KARAOKE]: '动态律动',
    [LyricsStyle.MINIMAL]: '极简主义'
  },
  helpModal: {
    title: 'Aura Vision 交互指南',
    intro: 'Aura Vision 是一款沉浸式的视听交互工具，它利用高精度麦克风采样，将音频信号实时转化为数学生成的数字艺术。',
    shortcutsTitle: '控制快捷键',
    shortcutItems: {
      toggleMic: '开启/关闭 音频采集',
      fullscreen: '切换全屏模式',
      randomize: '随机生成美学方案',
      lyrics: '显示/隐藏 识别信息',
      hideUi: '显示/隐藏 控制面板',
      glow: '开关霓虹光晕',
      trails: '开关动态拖尾',
      changeMode: '顺序切换可视化模式',
      changeTheme: '顺序切换颜色主题'
    },
    howItWorksTitle: '使用流程',
    howItWorksSteps: [
      '1. 授权麦克风权限以开启频域分析。',
      '2. 在感应器附近播放高保真音频。',
      '3. 视觉引擎将针对不同频段（低音/中音/高音）做出即时反应。',
      '4. AI 每隔约 30 秒会抓取一段特征码，联网识别歌曲并同步元数据。'
    ],
    settingsTitle: '参数定义',
    settingsDesc: {
      sensitivity: '控制视觉元素对振幅反应的增益。',
      speed: '调节生成算法在时间维度上的演化速率。',
      glow: '基于屏幕空间的后期泛光强度。',
      trails: '控制像素在画面上的停留时间，产生拖尾。',
      smoothing: '音频数据的阻尼系数，越高则过渡越圆滑。',
      fftSize: '决定了频谱分析的颗粒度，即频段数量。'
    },
    projectInfoTitle: '项目简介',
    projectInfoText: '由 Google Gemini 3 Flash 模型、React 19 以及硬件加速的 WebGL 技术栈强力驱动。',
    privacyTitle: '隐私与安全',
    privacyText: '音频分析完全在本地完成。仅在识别歌曲时，会将加密的频率特征临时发送至云端，绝不存储任何原始录音。',
    version: '发布版本'
  },
  onboarding: {
    welcome: '欢迎使用 Aura Vision',
    subtitle: '下一代 AI 音乐可视化引擎',
    selectLanguage: '选择语言',
    next: '下一步',
    skip: '跳过',
    finish: '开始体验',
    features: {
      title: '核心特性',
      visuals: {
        title: '沉浸式视觉',
        desc: '8+ 种基于 Three.js 开发的 WebGL 物理渲染引擎。'
      },
      ai: {
        title: 'Gemini AI 智能',
        desc: '由 Google Gemini 3 驱动的实时曲目识别与情绪分析。'
      },
      privacy: {
        title: '隐私优先',
        desc: '本地频谱分析。音频数据绝不上传至任何服务器。'
      }
    },
    shortcuts: {
      title: '快捷操作',
      desc: '使用以下按键快速掌控全局体验。'
    }
  }
};
