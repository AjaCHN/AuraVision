import { VisualizerMode, LyricsStyle } from '../../core/types';

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
    confirmReset: '确认重置？此操作不可撤销。',
    resetVisual: '仅重置视觉参数（速度、光晕、拖尾）至默认值。',
    randomize: '随机生成一套意想不到的模式与配色组合。',
    fullscreen: '进入沉浸式全屏交互模式。',
    help: '查看快捷键操作指南与项目详细文档。',
    mic: '启动或静音系统麦克风信号。',
    device: '选择当前活动的音频输入硬件。',
    monitor: '通过扬声器监听输入信号（警告：可能产生啸叫）。',
    hideCursor: '自动隐藏鼠标指针以获得纯净视觉。',
    wakeLock: '启用后，只要可视化处于活动状态，屏幕将保持常亮。',
    showFps: '在屏幕左上角显示实时的帧率（FPS）计数器。',
    showTooltips: '鼠标悬停在控件上时显示帮助提示。',
    doubleClickFullscreen: '允许通过双击屏幕任意位置切换全屏模式。',
    autoHideUi: '在无操作时自动隐藏底部控制面板。',
    mirrorDisplay: '水平翻转画面（适用于背投或摄像头模式）。'
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
  cycleSpeed: '循环周期 (秒)',
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
  welcomeTitle: 'Aura Vision | 灵动视界',
  welcomeText: '将旋律凝炼为极光，让节奏跃然屏上。融合 Gemini AI 实时曲目识别，为您开启感官交响的全新维度。',
  unsupportedTitle: '浏览器不受支持',
  unsupportedText: 'Aura Vision 需要现代浏览器功能（例如麦克风访问权限）才能运行。请更新到最新版本的 Chrome、Edge 或 Safari。',
  hideOptions: '收起',
  showOptions: '显示设置',
  reset: '重置全局设置',
  confirmReset: '确认重置？',
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
  randomizeTooltip: '随机视觉设置 (快捷键: R)',
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
  textPosition: '显示位置',
  quality: '渲染画质',
  qualities: {
    low: '低',
    med: '中',
    high: '高'
  },
  visualPanel: {
    effects: '特效',
    automation: '自动化',
    display: '显示'
  },
  audioPanel: {
    info: '调节“灵敏度”以改变视觉对声音的反应强度，“平滑度”控制动画的流畅性。更高的 FFT 分辨率能提供更精细的细节，但会增加 CPU 负载。'
  },
  systemPanel: {
    interface: '界面交互',
    behavior: '系统行为',
    maintenance: '维护与信息'
  },
  showFps: '显示帧率',
  showTooltips: '显示提示',
  doubleClickFullscreen: '双击全屏',
  autoHideUi: '自动隐藏 UI',
  mirrorDisplay: '镜像翻转',
  presets: {
    title: '智能预设',
    hint: '一键应用由专家精心调校的视觉参数组合。',
    select: '选择一种心境...',
    calm: '催眠舒缓',
    party: '动感派对',
    ambient: '静谧氛围',
    cyberpunk: '赛博朋克',
    retrowave: '复古夕阳',
    vocal: '人声专注'
  },
  recognitionSource: 'AI 识别源',
  lyricsPosition: '歌词显示位置',
  lyricsFont: '字体样式',
  lyricsFontSize: '字体大小',
  simulatedDemo: '模拟演示 (Demo)',
  positions: {
      top: '顶部',
      center: '居中',
      bottom: '底部',
      tl: '左上',
      tc: '中上',
      tr: '右上',
      ml: '左中',
      mc: '正中',
      mr: '右中',
      bl: '左下',
      bc: '中下',
      br: '右下'
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
    general: '无法访问音频设备。',
    tryDemo: '进入演示模式 (无音频)'
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
    [VisualizerMode.PARTICLES]: '星际穿越', 
    [VisualizerMode.TUNNEL]: '几何时空隧道',
    [VisualizerMode.RINGS]: '霓虹共振环',
    [VisualizerMode.NEBULA]: '深空星云',
    [VisualizerMode.LASERS]: '舞台激光矩阵',
    [VisualizerMode.FLUID_CURVES]: '极光之舞',
    [VisualizerMode.MACRO_BUBBLES]: '微观液泡 (景深)', 
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
    tabs: {
        guide: '指南',
        shortcuts: '快捷键',
        about: '关于'
    },
    intro: 'Aura Vision 是一款沉浸式的视听交互工具，它利用高精度麦克风采样，将音频信号实时转化为数学生成的数字艺术。',
    shortcutsTitle: '快捷操作键',
    shortcutItems: {
      toggleMic: '麦克风',
      fullscreen: '全屏',
      randomize: '随机',
      lyrics: '曲目识别',
      hideUi: '显示/隐藏面板',
      glow: '霓虹光晕',
      trails: '动态拖尾',
      changeMode: '切换模式',
      changeTheme: '切换配色'
    },
    howItWorksTitle: '使用指南',
    howItWorksSteps: [
      '1. 授权权限：点击“开启体验”并允许浏览器访问麦克风。',
      '2. 播放音乐：在设备附近播放音乐，视觉效果将根据实时采样跳动。',
      '3. 探索模式：打开设置面板 (按 H) 切换 12+ 种视觉引擎。',
      '4. AI 识别：按 L 键开启“AI 曲目识别”以分析当前歌曲及其情绪。'
    ],
    settingsTitle: '核心参数指南',
    settingsDesc: {
      sensitivity: '控制视觉元素对振幅反应的增益。',
      speed: '调节生成算法在时间维度上的演化速率。',
      glow: '后期处理中的全域泛光强度，增强氛围感。',
      trails: '控制像素在画面上的停留时间，产生运动模糊效果。',
      smoothing: '音频数据的平滑系数，越高则过渡越圆滑。',
      fftSize: '决定了频谱分析的颗粒度，即频段采样数量。'
    },
    projectInfoTitle: '项目简介',
    aboutDescription: '下一代通感交互体验。Aura Vision 融合了高精度实时频谱分析与 Google Gemini 3 多模态人工智能，将无形的声波转化为有生命的动态光影艺术。适用于 VJ 演出、直播背景、专注陪伴及空间氛围装饰。',
    privacyTitle: '隐私与安全',
    privacyText: '音频分析完全在本地完成。仅在识别歌曲时，会将加密的频率特征临时发送至云端，绝不存储或上传任何原始录音数据。',
    version: '版本号'
  },
  onboarding: {
    welcome: '欢迎体验 Aura Vision',
    subtitle: '新一代 AI 音乐通感引擎',
    selectLanguage: '选择您的语言',
    next: '继续',
    back: '返回',
    skip: '跳过',
    finish: '立即开启',
    features: {
      title: '核心特性',
      visuals: {
        title: '生成式艺术杰作',
        desc: '12+ 种基于 WebGL 的数学动力学引擎，将声波具象化。'
      },
      ai: {
        title: 'Gemini AI 智能大脑',
        desc: '实时识别曲目元数据与视觉情绪，由 Google Gemini 3 提供支持。'
      },
      privacy: {
        title: '隐私安全保障',
        desc: '音频分析完全在本地运行，我们绝不记录或存储您的私人声音数据。'
      }
    },
    shortcuts: {
      title: '极速交互',
      desc: '通过以下快捷键，像指挥家一样掌控全场。'
    }
  }
};