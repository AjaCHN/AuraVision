import { VisualizerMode, LyricsStyle } from '../../core/types';

export const tw = {
  common: {
    on: '開啟',
    off: '關閉',
    visible: '顯示',
    hidden: '隱藏',
    active: '啟用',
    muted: '靜音',
    beta: '測試版'
  },
  tabs: {
    visual: '視覺',
    text: '文字',
    audio: '音訊',
    ai: '曲目辨識',
    system: '系統'
  },
  hints: {
    mode: '選擇用於生成視覺效果的數學渲染引擎。',
    theme: '應用精心調校的場景配色方案。',
    speed: '時間流速倍率。低數值催眠舒緩，高數值動感強烈。',
    glow: '開啟後期泛光（Bloom）。關閉可提升低階裝置效能。',
    trails: '控制光影殘留時間。高數值可產生如油畫般的流動感。',
    sensitivity: '控制音訊增益。數值越高，微弱的聲音也能引發劇烈的視覺爆發。',
    smoothing: '時域阻尼係數。高數值如液體般柔順，低數值則反應銳利。',
    fftSize: '頻譜採樣精度。4096 提供極致細節但消耗更多 CPU 資源。',
    lyrics: '啟用 AI 驅動的曲目辨識與歌詞同步展示。',
    lyricsStyle: '更改辨識結果及歌詞的排版風格。',
    region: '針對特定音樂市場優化 AI 搜尋的匹配權重。',
    autoRotate: '自動循環切換不同的視覺化引擎。',
    rotateInterval: '自動切換到下一個視覺化引擎前的停留時間（秒）。',
    cycleColors: '隨時間推移自動平滑過渡色彩主題。',
    colorInterval: '平滑過渡到下一個色彩主題前的停留時間（秒）。',
    reset: '將所有應用設定、語言及音訊選項恢復至原廠狀態。',
    confirmReset: '確認重設？此操作無法復原。',
    resetVisual: '僅重置視覺參數（速度、光暈、殘影）至預設值。',
    randomize: '隨機生成一套意想不到的模式與配色組合。',
    fullscreen: '進入沉浸式全螢幕互動模式。',
    help: '查看快捷鍵操作指南與專案詳細文件。',
    mic: '啟動或靜音系統麥克風訊號。',
    device: '選擇當前活動的音訊輸入硬體。',
    monitor: '透過揚聲器監聽輸入訊號（警告：可能產生回音）。',
    hideCursor: '自動隱藏滑鼠游標以獲得純淨視覺。',
    wakeLock: '啟用後，只要視覺化處於活動狀態，螢幕將保持常亮。',
    showFps: '在螢幕左上角顯示即時的幀率（FPS）計數器。',
    showTooltips: '滑鼠懸停在控制項上時顯示幫助提示。',
    doubleClickFullscreen: '允許透過雙擊螢幕任意位置切換全螢幕模式。',
    autoHideUi: '在無操作時自動隱藏底部控制面板。',
    mirrorDisplay: '水平翻轉畫面（適用於背投或攝影機模式）。'
  },
  visualizerMode: '視覺化模式',
  styleTheme: '視覺風格',
  settings: '進階設定',
  sensitivity: '響應靈敏度',
  speed: '演化速度',
  glow: '霓虹光暈',
  trails: '動態殘影',
  autoRotate: '視覺化模式循環',
  rotateInterval: '切換間隔 (秒)',
  cycleColors: '自動循環配色',
  colorInterval: '切換間隔 (秒)',
  monitorAudio: '音訊監聽',
  audioInput: '輸入來源選擇',
  lyrics: 'AI 曲目辨識',
  showLyrics: '啟用自動辨識',
  displaySettings: '顯示設定',
  language: '介面語言',
  region: '音樂市場定位',
  startMic: '開啟音訊監聽',
  stopMic: '停止音訊監聽',
  listening: '監聽中',
  identifying: 'AI 正在解析曲目...',
  startExperience: '開啟視聽盛宴',
  welcomeTitle: 'Aura Vision | 靈動視界',
  welcomeText: '將律動凝煉為藝術，讓節奏躍然屏上。融合 Gemini AI 實時曲目識別，為您開啟感官交響的全新維度。',
  unsupportedTitle: '瀏覽器不受支援',
  unsupportedText: 'Aura Vision 需要現代瀏覽器功能（例如麥克風存取權限）才能運作。請更新至最新版本的 Chrome、Firefox 或 Safari。',
  hideOptions: '收起',
  showOptions: '顯示設定',
  reset: '重置全域設定',
  confirmReset: '確認重設？',
  resetVisual: '重置視覺參數',
  resetText: '重置文字設定',
  resetAudio: '重置音訊設定',
  resetAi: '重置辨識設定',
  randomize: '隨機美學組合',
  help: '說明與協助',
  close: '關閉',
  betaDisclaimer: 'Beta 功能：辨識準確度正在持續優化中。',
  wrongSong: '辨識有誤？點擊重試',
  hideCursor: '隱藏滑鼠游標',
  customColor: '文字顏色',
  randomizeTooltip: '隨機視覺設定 (快捷鍵: R)',
  smoothing: '動態平滑度',
  fftSize: '頻域解析度 (FFT)',
  appInfo: '關於應用',
  appDescription: '一個基於即時頻域分析與 Gemini AI 語意辨識的沉浸式音樂視覺化套件。',
  version: '版本號',
  defaultMic: '系統預設麥克風',
  customText: '自訂文字內容',
  textProperties: '排版與佈局',
  customTextPlaceholder: '輸入文字',
  showText: '顯示文字圖層',
  pulseBeat: '隨節奏律動',
  textSize: '字體大小',
  textRotation: '旋轉角度',
  textFont: '字體樣式',
  textOpacity: '不透明度',
  textPosition: '顯示位置',
  quality: '渲染畫質',
  qualities: {
    low: '低',
    med: '中',
    high: '高'
  },
  visualPanel: {
    effects: '特效',
    automation: '自動化',
    display: '顯示'
  },
  audioPanel: {
    info: '調節「靈敏度」以改變視覺對聲音的反應強度，「平滑度」控制動畫的流暢性。更高的 FFT 解析度能提供更精細的細節，但會增加 CPU 負載。'
  },
  systemPanel: {
    interface: '介面互動',
    behavior: '系統行為',
    maintenance: '維護與資訊'
  },
  showFps: '顯示幀率',
  showTooltips: '顯示提示',
  doubleClickFullscreen: '雙擊全螢幕',
  autoHideUi: '自動隱藏 UI',
  mirrorDisplay: '鏡像翻轉',
  presets: {
    title: '智慧預設',
    hint: '一鍵應用由專家精心調校的視覺參數組合。',
    select: '選擇一種心境...',
    calm: '催眠舒緩',
    party: '動感派對',
    ambient: '靜謐氛圍',
    cyberpunk: '賽博龐克',
    retrowave: '復古夕陽',
    vocal: '人聲專注'
  },
  recognitionSource: 'AI 辨識源',
  lyricsPosition: '歌詞顯示位置',
  lyricsFont: '字體樣式',
  lyricsFontSize: '字體大小',
  simulatedDemo: '模擬演示 (Demo)',
  positions: {
      top: '頂部',
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
  wakeLock: '禁止螢幕休眠',
  system: {
    shortcuts: {
      mic: '麥克風',
      ui: '介面',
      mode: '模式',
      random: '隨機'
    }
  },
  errors: {
    title: '音訊錯誤',
    accessDenied: '無法存取麥克風，請檢查瀏覽器權限。',
    noDevice: '未偵測到音訊輸入裝置。',
    deviceBusy: '音訊裝置被佔用或無效。',
    general: '無法存取音訊裝置。',
    tryDemo: '嘗試演示模式 (無音訊)'
  },
  aiState: {
    active: '辨識功能已開啟',
    enable: '開啟 AI 辨識'
  },
  regions: {
    global: '全球',
    US: '美國 / 西方',
    CN: '中國大陸',
    JP: '日本',
    KR: '韓國',
    EU: '歐洲',
    LATAM: '拉丁美洲'
  },
  modes: {
    [VisualizerMode.PLASMA]: '流體電漿',
    [VisualizerMode.BARS]: '鏡像頻譜分析',
    [VisualizerMode.PARTICLES]: '星際穿越', 
    [VisualizerMode.TUNNEL]: '幾何時空隧道',
    [VisualizerMode.RINGS]: '霓虹共振環',
    [VisualizerMode.NEBULA]: '深空星云',
    [VisualizerMode.LASERS]: '舞台雷射矩陣',
    [VisualizerMode.FLUID_CURVES]: '極光之舞',
    [VisualizerMode.MACRO_BUBBLES]: '微觀液泡 (景深)', 
    [VisualizerMode.SILK]: '流光綢緞 (WebGL)',
    [VisualizerMode.LIQUID]: '液態星球 (WebGL)',
    [VisualizerMode.TERRAIN]: '低多邊形山脈 (WebGL)'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: '標準排版',
    [LyricsStyle.KARAOKE]: '動態律動',
    [LyricsStyle.MINIMAL]: '極簡主義'
  },
  helpModal: {
    title: 'Aura Vision 互動指南',
    tabs: {
        guide: '指南',
        shortcuts: '快捷鍵',
        about: '關於'
    },
    intro: 'Aura Vision 是一款沉浸式的視聽互動工具，它利用高精度麥克風取樣，將音訊訊號即時轉化為數學生成的數位藝術。',
    shortcutsTitle: '控制快捷鍵',
    shortcutItems: {
      toggleMic: '麥克風',
      fullscreen: '全螢幕',
      randomize: '隨機',
      lyrics: '曲目辨識',
      hideUi: '顯示/隱藏面板',
      glow: '霓虹光暈',
      trails: '動態殘影',
      changeMode: '切換模式',
      changeTheme: '切換配色'
    },
    howItWorksTitle: '使用流程',
    howItWorksSteps: [
      '1. 授權權限：點擊「開啟體驗」並允許瀏覽器訪問麥克風。',
      '2. 播放音樂：在設備附近播放音樂，視覺效果將根據實時採樣跳動。',
      '3. 探索模式：打開設置面板 (按 H) 切換 12+ 種視覺引擎。',
      '4. AI 辨識：按 L 鍵開啟「AI 曲目辨識」以分析當前歌曲及其情緒。'
    ],
    settingsTitle: '核心參數指南',
    settingsDesc: {
      sensitivity: '控制視覺元素對振幅反應的增益。',
      speed: '調節生成演算法在時間維度上的演化速率。',
      glow: '後期處理中的全域泛光強度，增強氛圍感。',
      trails: '控制像素在畫面上的停留時間，產生運動模糊效果。',
      smoothing: '音訊資料的平滑係數，越高則過渡越圓滑。',
      fftSize: '決定了頻譜分析的顆粒度，即頻段採樣數量。'
    },
    projectInfoTitle: '專案簡介',
    aboutDescription: '下一代通感互動體驗。Aura Vision 融合了高精度即時頻譜分析與 Google Gemini 3 多模態人工智慧，將無形的聲波轉化為有生命的動態光影藝術。適用於 VJ 演出、直播背景、專注陪伴及空間氛圍裝飾。',
    privacyTitle: '隱私與安全',
    privacyText: '音訊分析完全在本地完成。僅在辨識歌曲時，會將加密的頻率特徵臨時發送至雲端，絕不存儲或上傳任何原始錄音數據。',
    version: '版本號'
  },
  onboarding: {
    welcome: '歡迎體驗 Aura Vision',
    subtitle: '新一代 AI 音樂通感引擎',
    selectLanguage: '選擇您的語言',
    next: '繼續',
    back: '返回',
    skip: '跳過',
    finish: '立即開啟',
    features: {
      title: '核心特性',
      visuals: {
        title: '生成式藝術傑作',
        desc: '12+ 種基於 WebGL 的數學動力學引擎，將聲波具象化。'
      },
      ai: {
        title: 'Gemini AI 智能大腦',
        desc: '實時識別曲目元數據與視覺情緒，由 Google Gemini 3 提供支持。'
      },
      privacy: {
        title: '隱私安全保障',
        desc: '音訊分析完全在本地運行，我們絕不記錄或存儲您的私人聲音數據。'
      }
    },
    shortcuts: {
      title: '極速交互',
      desc: '通過以下快捷鍵，像指揮家一樣掌控全場。'
    }
  }
};