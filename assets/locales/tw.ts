
import { VisualizerMode, LyricsStyle } from '../../types';

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
    resetVisual: '僅重置視覺參數（速度、光暈、殘影）至預設值。',
    randomize: '隨機生成一套意想不到的模式與配色組合。',
    fullscreen: '進入沉浸式全螢幕互動模式。',
    help: '查看快捷鍵操作指南與專案詳細文件。',
    mic: '啟動或靜音系統麥克風訊號。',
    device: '選擇當前活動的音訊輸入硬體。',
    monitor: '透過揚聲器監聽輸入訊號（警告：可能產生回音）。',
    hideCursor: '自動隱藏滑鼠游標以獲得純淨視覺。',
    wakeLock: '啟用後，只要視覺化處於活動狀態，螢幕將保持常亮。'
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
  welcomeTitle: 'Aura Vision',
  welcomeText: '將聲波轉化為數位藝術。透過即時頻域分析與 AI 語意辨識，開啟前所未有的視聽互動體驗。',
  hideOptions: '收起',
  showOptions: '顯示設定',
  reset: '重置全域設定',
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
  defaultMic: '系統預設麥크風',
  customText: '自訂文字內容',
  textProperties: '排版與佈局',
  customTextPlaceholder: '輸入文字',
  showText: '顯示文字圖層',
  pulseBeat: '隨節奏律動',
  textSize: '字體大小',
  textRotation: '旋轉角度',
  textFont: '字體樣式',
  textOpacity: '不透明度',
  quality: '渲染畫質',
  qualities: {
    low: '低',
    med: '中',
    high: '高'
  },
  recognitionSource: 'AI 辨識源',
  lyricsPosition: '歌詞顯示位置',
  simulatedDemo: '模擬演示 (Demo)',
  positions: {
      top: '頂部',
      center: '居中',
      bottom: '底部'
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
    general: '無法存取音訊裝置。'
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
    [VisualizerMode.PARTICLES]: '速激星空',
    [VisualizerMode.TUNNEL]: '幾何時空隧道',
    [VisualizerMode.SHAPES]: '抽象幾何演化',
    [VisualizerMode.RINGS]: '霓虹共振環',
    [VisualizerMode.NEBULA]: '深空星云',
    [VisualizerMode.KALEIDOSCOPE]: '迷幻萬花筒',
    [VisualizerMode.LASERS]: '舞台雷射矩陣',
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
    intro: 'Aura Vision 是一款沉浸式的視聽互動工具，它利用高精度麥克風取樣，將音訊訊號即時轉化為數學生成的數位藝術。',
    shortcutsTitle: '控制快捷鍵',
    shortcutItems: {
      toggleMic: '開啟/關閉 音訊採集',
      fullscreen: '切換全螢幕模式',
      randomize: '隨機生成美學方案',
      lyrics: '顯示/隱藏 辨識資訊',
      hideUi: '顯示/隱藏 控制面板',
      glow: '開關霓虹光暈',
      trails: '開關動態殘影',
      changeMode: '順序切換視覺化模式',
      changeTheme: '順序切換顏色主題'
    },
    howItWorksTitle: '使用流程',
    howItWorksSteps: [
      '1. 授權麥克風權限以開啟頻域分析。',
      '2. 在感應器附近播放高保真音訊。',
      '3. 視覺引擎將針對不同頻段（低音/中音/高音）做出即時反應。',
      '4. AI 每隔約 30 秒會抓取一段特徵碼，聯網辨識歌曲並同步元資料。'
    ],
    settingsTitle: '參數定義',
    settingsDesc: {
      sensitivity: '控制視覺元素對振幅反應的增益。',
      speed: '調節生成演算法在時間維度上的演化速率。',
      glow: '基於螢幕空間的後期泛光強度。',
      trails: '控制像素在畫面上的停留時間，產生殘影。',
      smoothing: '音訊資料的阻尼係數，越高則過渡越圓滑。',
      fftSize: '決定了頻譜分析的顆粒度，即評段數量。'
    },
    projectInfoTitle: '專案簡介',
    projectInfoText: '由 Google Gemini 3 Flash 專案、React 19 以及硬體加速的 WebGL 技術棧強力驅動。',
    privacyTitle: '隱私與安全',
    privacyText: '音訊分析完全在本地完成。僅在辨識歌曲時，會將加密的頻率特徵臨時發送至雲端，絕不儲存任何原始錄音。',
    version: '發布版本'
  },
  onboarding: {
    welcome: '歡迎使用 Aura Vision',
    subtitle: '下一代 AI 音樂視覺化引擎',
    selectLanguage: '選擇語言',
    next: '下一步',
    skip: '跳過',
    finish: '開始體驗',
    features: {
      title: '核心特性',
      visuals: {
        title: '沉浸式視覺',
        desc: '8+ 種基於 Three.js 開發的 WebGL 物理渲染引擎。'
      },
      ai: {
        title: 'Gemini AI 智慧',
        desc: '由 Google Gemini 3 驅動的即時曲目辨識與情緒分析。'
      },
      privacy: {
        title: '隱私優先',
        desc: '本地頻譜分析。音訊資料絕不傳送至任何伺服器。'
      }
    },
    shortcuts: {
      title: '快捷操作',
      desc: '使用以下按鍵快速掌控全域體驗。'
    }
  }
};
