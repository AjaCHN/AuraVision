import { VisualizerMode, LyricsStyle } from '../../core/types';

export const ja = {
  common: {
    on: 'ON',
    off: 'OFF',
    visible: '表示',
    hidden: '非表示',
    active: '有効',
    muted: 'ミュート',
    beta: 'BETA'
  },
  tabs: {
    visual: 'ビジュアル',
    text: 'テキスト',
    audio: 'オーディオ',
    ai: 'AI 曲識別',
    system: 'システム'
  },
  hints: {
    mode: '視覚表現の核となる数理レンダリングエンジンを選択します。',
    theme: 'シーンに合わせて厳選されたカラーパレットを適用します。',
    speed: '時間の流動倍率。低値は催眠的に、高値はエネルギッシュに変化します。',
    glow: 'ポストプロセスのブルーム効果。負荷が高い場合はオフにしてください。',
    trails: 'ピクセルの残像強度。高値にすると油彩のような流動性が生まれます。',
    sensitivity: '音声利得の調整。微細な音に対する視覚的反応を増幅させます。',
    smoothing: '時域の減衰係数。高値は液体のように滑らかに、低値は鋭敏に反応します。',
    fftSize: 'スペクトル解析の解像度。4096は繊細ですがCPU負荷が高まります。',
    lyrics: 'AIによる楽曲特定と歌詞のリアルタイム表示を切り替えます。',
    lyricsStyle: '同期表示される歌詞や曲情報のタイポグラフィを変更します。',
    region: 'AI検索の重み付けを特定の音楽市場に合わせて最適化します。',
    autoRotate: '異なるビジュアルエンジンを一定時間で自動的に切り替えます。',
    rotateInterval: '次のエンジンへ移行するまでの待機時間（秒）。',
    cycleColors: 'カラーテーマを時間の経過とともに滑らかに遷移させます。',
    colorInterval: '次のカラーテーマへブレンドするまでの時間（秒）。',
    reset: 'アプリの全設定、言語、音響オプションを工場出荷状態に戻します。',
    confirmReset: '設定を初期化しますか？この操作は取り消せません。',
    resetVisual: '外観パラメータ（速度、光彩、残像）のみをリセットします。',
    randomize: '視覚モードと色彩を独創的な組み合わせで自動生成します。',
    fullscreen: '没入感のあるフルスクリーンモードに切り替えます。',
    help: 'ショートカットキーやドキュメントを確認します。',
    mic: 'マイク入力を有効化またはミュートします。',
    device: '使用するハードウェア・オーディオ入力ソースを選択します。',
    monitor: '入力をスピーカーへ出力します（ハウリングに注意してください）。',
    wakeLock: 'ビジュアライザ動作中、画面のスリープを防止します。',
    showFps: '左上にリアルタイムのフレームレートを表示します。',
    showTooltips: 'コントロールにホバーした際、ヘルプを表示します。',
    doubleClickFullscreen: '画面の任意の場所をダブルクリックして全画面表示を切り替えます。',
    autoHideUi: '無操作時にコントロールパネルを自動的に隠します。',
    mirrorDisplay: '描画内容を左右反転させます（背面投影やカメラ等に有効）。'
  },
  visualizerMode: 'ビジュアルモード',
  styleTheme: '視覚スタイル',
  settings: '詳細設定',
  sensitivity: '応答感度',
  speed: '進化速度',
  glow: 'ネオングロウ',
  trails: 'ダイナミック残像',
  autoRotate: 'モードの自動循環',
  rotateInterval: '間隔 (s)',
  cycleColors: 'カラーの自動循環',
  colorInterval: '間隔 (s)',
  cycleSpeed: 'サイクル周期 (s)',
  monitorAudio: 'モニタリング',
  audioInput: '入力デバイス',
  lyrics: 'AI 曲識別',
  showLyrics: '自動識別を有効化',
  displaySettings: '表示設定',
  language: '表示言語',
  region: 'ターゲット市場',
  startMic: 'オーディオを有効化',
  stopMic: 'オーディオを停止',
  listening: 'リスニング中',
  identifying: 'AIが解析中...',
  startExperience: '視覚体験を開始',
  welcomeTitle: 'Aura Vision | 光の旋律',
  welcomeText: '旋律を極光へ、リズムを色彩へ。Gemini AIを搭載した次世代の通感エンジンが、あなたの感性を拡張します。',
  unsupportedTitle: '非対応ブラウザ',
  unsupportedText: 'Aura Visionには最新のWeb Audio/Media機能が必要です。Chrome, Edge, または Safariの最新版をご利用ください。',
  hideOptions: 'パネルを隠す',
  showOptions: 'オプションを表示',
  reset: 'システムリセット',
  resetVisual: '外観をリセット',
  resetText: 'テキストをリセット',
  resetAudio: '音響をリセット',
  resetAi: 'AI設定をリセット',
  randomize: 'インテリジェント・ランダム',
  help: 'ヘルプとガイド',
  close: '閉じる',
  betaDisclaimer: 'AI認識は現在ベータ版です。精度は順次改善されます。',
  wrongSong: '曲が違いますか？再試行',
  hideCursor: 'カーソルを非表示',
  customColor: '文字色',
  randomizeTooltip: 'すべての設定をランダム化 (R)',
  smoothing: 'スムージング',
  fftSize: '解析解像度 (FFT)',
  appInfo: 'アプリ情報',
  appDescription: 'リアルタイムのスペクトル解析とGemini AIを融合させた没入型音楽ビジュアライザー。',
  version: 'ビルド',
  defaultMic: 'システム標準マイク',
  customText: 'カスタムテキスト',
  textProperties: 'タイポグラフィ',
  customTextPlaceholder: 'テキストを入力',
  showText: 'オーバーレイを表示',
  pulseBeat: 'ビートに同調',
  textSize: 'フォントサイズ',
  textRotation: '回転',
  textFont: 'フォント',
  textOpacity: '不透明度',
  textPosition: '表示位置',
  quality: '描画品質',
  qualities: {
    low: '低',
    med: '中',
    high: '高'
  },
  visualPanel: {
    effects: 'エフェクト',
    automation: 'オートメーション',
    display: '表示'
  },
  audioPanel: {
    info: '感度とスムージングを調整して、オーディオのダイナミクスに対する反応をカスタマイズします。FFT解像度を上げると精細になりますが、CPU負荷が増大します。'
  },
  systemPanel: {
    interface: 'インターフェース',
    behavior: 'システム挙動',
    maintenance: 'メンテナンス'
  },
  showFps: 'FPSを表示',
  showTooltips: 'ツールチップを表示',
  doubleClickFullscreen: 'ダブルクリック全画面',
  autoHideUi: 'UI自動非表示',
  mirrorDisplay: 'ミラー表示',
  presets: {
    title: 'スマートプリセット',
    hint: '専門家が調整したビジュアル設定を一クリックで適用します。',
    select: 'ムードを選択...',
    calm: '催眠的・穏やか',
    party: 'エネルギッシュ',
    ambient: 'アンビエント',
    cyberpunk: 'サイバーパンク',
    retrowave: 'レトロウェイブ',
    vocal: 'ボーカル特化'
  },
  recognitionSource: 'AIプロバイダー',
  lyricsPosition: '表示位置',
  lyricsFont: 'フォント',
  lyricsFontSize: 'サイズ',
  simulatedDemo: 'シミュレーション (Demo)',
  positions: {
      top: '上部',
      center: '中央',
      bottom: '下部',
      tl: '左上',
      tc: '中上',
      tr: '右上',
      ml: '左中央',
      mc: '中央',
      mr: '右中央',
      bl: '左下',
      bc: '中下',
      br: '右下'
  },
  wakeLock: 'スリープ無効化',
  system: {
    shortcuts: {
      mic: 'マイク',
      ui: 'UI',
      mode: 'モード',
      random: 'ランダム'
    }
  },
  errors: {
    title: 'オーディオエラー',
    accessDenied: 'マイクへのアクセスが拒否されました。ブラウザの権限設定を確認してください。',
    noDevice: '入力デバイスが見つかりません。',
    deviceBusy: 'デバイスが使用中または無効です。',
    general: 'オーディオデバイスにアクセスできません。',
    tryDemo: 'デモモードを試す (オーディオなし)'
  },
  aiState: {
    active: 'AI認識 有効',
    enable: 'AI認識を開始'
  },
  regions: {
    global: 'グローバル',
    US: '北米 / 西欧',
    CN: '中国',
    JP: '日本',
    KR: '韓国',
    EU: '欧州',
    LATAM: '中南米'
  },
  modes: {
    [VisualizerMode.PLASMA]: '流体プラズマ',
    [VisualizerMode.BARS]: 'スペクトルバー',
    [VisualizerMode.PARTICLES]: '星間航行',
    [VisualizerMode.TUNNEL]: '幾何学トンネル',
    [VisualizerMode.RINGS]: '共鳴ネオンリング',
    [VisualizerMode.NEBULA]: '深宇宙星雲',
    [VisualizerMode.LASERS]: 'レーザーマトリクス',
    [VisualizerMode.FLUID_CURVES]: '極光の舞',
    [VisualizerMode.MACRO_BUBBLES]: '微細液胞 (DoF)',
    [VisualizerMode.SILK]: '流光シルク (WebGL)',
    [VisualizerMode.LIQUID]: '流体惑星 (WebGL)',
    [VisualizerMode.TERRAIN]: 'ポリゴン山脈 (WebGL)'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: '標準レイアウト',
    [LyricsStyle.KARAOKE]: 'ダイナミック',
    [LyricsStyle.MINIMAL]: 'ミニマル'
  },
  helpModal: {
    title: 'Aura Vision 操作ガイド',
    tabs: {
        guide: 'ガイド',
        shortcuts: 'ショートカット',
        about: '詳細'
    },
    intro: 'Aura Visionは、高精度の音声サンプリングに基づき、音をリアルタイムで数理的なデジタルアートへ変換する通感ツールです。',
    shortcutsTitle: 'キーボード操作',
    shortcutItems: {
      toggleMic: 'マイクのオン/オフ',
      fullscreen: '全画面表示の切替',
      randomize: 'ビジュアルのランダム化',
      lyrics: 'AI認識の切替',
      hideUi: 'パネルの表示/非表示',
      glow: '光彩エフェクトの切替',
      trails: '残像エフェクトの切替',
      changeMode: 'モードの切り替え',
      changeTheme: 'テーマの切り替え'
    },
    howItWorksTitle: '使用方法',
    howItWorksSteps: [
      '1. 権限の許可: 「開始」をクリックし、マイクへのアクセスを許可します。',
      '2. 音楽の再生: デバイスの近くで音楽を流すと、ビジュアルが反応し始めます。',
      '3. モード探索: 設定パネル（Hキー）から12種類以上のエンジンを試せます。',
      '4. AI認識: Lキーで現在の楽曲情報と雰囲気の解析を開始します。'
    ],
    settingsTitle: '主要パラメータ解説',
    settingsDesc: {
      sensitivity: '音声信号に対する反応の増幅率を調整します。',
      speed: '生成アルゴリズムの時間的な進化速度を制御します。',
      glow: '画面全体の光の広がりを調整し、雰囲気を高めます。',
      trails: 'ピクセルの残像時間を制御し、動きの滑らかさを生みます。',
      smoothing: '音声データの平滑化係数。高いほど滑らかになります。',
      fftSize: 'スペクトル解析の細かさ（サンプル数）を決定します。'
    },
    projectInfoTitle: 'プロジェクトについて',
    aboutDescription: '次世代の通感インタラクティブ体験。Aura Visionは、Web Audioによる高精度解析とGoogle Gemini 3を融合させ、無形の音波を生命感あふれる光へと変換します。VJ、配信、空間演出に最適です。',
    privacyTitle: 'プライバシーと安全',
    privacyText: '音声解析はローカルで完結します。認識時のみ暗号化された特徴量を一時的に送信し、生録音データを保存することはありません。',
    version: 'リリース'
  },
  onboarding: {
    welcome: 'Aura Visionへようこそ',
    subtitle: '次世代 AI 通感エンジン',
    selectLanguage: '言語を選択してください',
    next: '次へ',
    back: '戻る',
    skip: 'スキップ',
    finish: '体験を開始',
    features: {
      title: '主な特徴',
      visuals: {
        title: '生成的な芸術作品',
        desc: 'WebGLベースの12種類以上の数理エンジンが音を具現化します。'
      },
      ai: {
        title: 'Gemini AI インテリジェンス',
        desc: '楽曲メタデータと雰囲気をGoogle Gemini 3が瞬時に解析します。'
      },
      privacy: {
        title: 'セキュア＆プライベート',
        desc: '解析はローカルで実行されます。音声データが記録・保存されることはありません。'
      }
    },
    shortcuts: {
      title: 'ダイナミック・コントロール',
      desc: 'キーボードを操り、光の指揮者になりましょう。'
    }
  }
};