
import { VisualizerMode, LyricsStyle } from '../../types';

export const ja = {
  common: {
    on: 'ON',
    off: 'OFF',
    visible: '表示',
    hidden: '非表示',
    active: '有効',
    muted: 'ミュート',
    beta: 'ベータ'
  },
  tabs: {
    visual: 'ビジュアル',
    text: 'テキスト',
    audio: 'オーディオ',
    ai: '曲識別',
    system: 'システム'
  },
  hints: {
    mode: 'ビジュアルを生成するための数学的レンダリングエンジンを選択します。',
    theme: 'シーンに厳選されたカラーパレットを適用します。',
    speed: 'タイムスケールの倍率。低い値は催眠的、高い値はエネルギッシュです。',
    glow: 'ポストプロセスのブルームを有効化。オフにするとパフォーマンスが向上します。',
    trails: 'ピクセルの残像時間を制御。高い値は流体のような動きを作ります。',
    sensitivity: 'オーディオゲインを制御。値が高いと微細な音にも激しく反応します。',
    smoothing: '時間的減衰。高い値は液体のように滑らか、低い値は鋭敏に反応します。',
    fftSize: 'スペクトル解像度。4096は詳細ですがCPU負荷が高くなります。',
    lyrics: 'AIによる曲識別と歌詞の自動取得を有効にします。',
    lyricsStyle: '同期された歌詞の視覚的プレゼンテーションをカスタマイズします。',
    region: 'AI検索エンジンを特定の音楽市場に重点を置くように調整します。',
    autoRotate: '異なるビジュアルエンジンを自動的に循環させます。',
    rotateInterval: '次のビジュアルエンジンに切り替わるまでの時間（秒）。',
    cycleColors: '時間の経過とともにカラーテーマを自動的に滑らかに移行させます。',
    colorInterval: '次のカラーパレットに滑らかにブレンドするまでの時間（秒）。',
    reset: 'すべてのアプリケーション設定を工場出荷時の状態に戻します。',
    resetVisual: '外観設定（速度、グロー、トレイル）のみをデフォルトに戻します。',
    randomize: 'ビジュアルモードと色の意外な組み合わせを生成します。',
    fullscreen: '没入型のフルスクリーンモードに切り替えます。',
    help: 'キーボードショートカットとドキュメントを表示します。',
    mic: 'マイク入力を有効化またはミュートします。',
    device: 'ハードウェアオーディオ入力ソースを選択します。',
    monitor: 'オーディオ入力をスピーカーに出力します（ハウリングに注意）。',
    wakeLock: 'ビジュアライザーが動作中、画面のスリープを無効にします。'
  },
  visualizerMode: 'ビジュアライザモード',
  styleTheme: 'ビジュアルテーマ',
  settings: '詳細設定',
  sensitivity: '感度',
  speed: '演習速度',
  glow: 'ネオングロー',
  trails: '残像エフェクト',
  autoRotate: '自動切替',
  rotateInterval: '間隔 (秒)',
  cycleColors: '自動カラー切替',
  colorInterval: '間隔 (秒)',
  monitorAudio: '音声モニター',
  audioInput: '入力ソース',
  lyrics: 'AI曲識別',
  showLyrics: '自動識別を有効にする',
  displaySettings: '表示設定',
  language: '言語',
  region: '音楽地域',
  startMic: 'オーディオ入力を開始',
  stopMic: 'オーディオ入力を停止',
  listening: 'アクティブ',
  identifying: 'AI解析中...',
  startExperience: '体験を開始',
  welcomeTitle: 'Aura Vision',
  welcomeText: 'オーディオを生成的なデジタルアートに変換します。リアルタイムのスペクトル分析とAI認識による没入型体験。',
  hideOptions: '閉じる',
  showOptions: 'オプションを表示',
  reset: '全体リセット',
  resetVisual: 'ビジュアルリセット',
  resetText: 'テキストリセット',
  resetAudio: 'オーディオリセット',
  resetAi: 'AI設定リセット',
  randomize: 'スマートランダム',
  help: 'ヘルプ',
  close: '閉じる',
  betaDisclaimer: 'Beta版: 識別精度は継続的に改善されています。',
  wrongSong: '曲が違いますか？',
  hideCursor: 'カーソルを隠す',
  customColor: 'カスタム',
  randomizeTooltip: 'すべてのビジュアル設定をランダム化',
  smoothing: 'スムージング',
  fftSize: '解像度 (FFT)',
  appInfo: 'アプリ情報',
  appDescription: 'リアルタイムのオーディオ分析とAI認識を活用した没入型の音楽可视化体験。',
  version: 'バージョン',
  defaultMic: 'デフォルトのマイク',
  customText: 'カスタムテキスト内容',
  textProperties: 'タイポグラフィとレイアウト',
  customTextPlaceholder: 'テキストを入力',
  showText: '表示切り替え',
  pulseBeat: 'ビート連동',
  textSize: 'フォントサイズ',
  textRotation: '回転角度',
  textFont: 'フォントファミリー',
  textOpacity: '不透明度',
  quality: '画質',
  qualities: {
    low: '低',
    med: '中',
    high: '高'
  },
  recognitionSource: 'AIプロバイダー',
  lyricsPosition: '歌詞の位置',
  simulatedDemo: 'シミュレーション (デモ)',
  positions: {
      top: '上',
      center: '中央',
      bottom: '下'
  },
  wakeLock: 'スリープ防止',
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
    accessDenied: 'アクセスが拒否されました。マイクの権限を確認してください。',
    noDevice: 'オーディオ入力デバイスが見つかりません。',
    deviceBusy: 'デバイスが使用中または無効です。',
    general: 'オーディオデバイスにアクセスできません。'
  },
  aiState: {
    active: '認識機能が有効',
    enable: 'AI認識を有効にする'
  },
  regions: {
    global: 'グローバル',
    US: '米国 / 西欧',
    CN: '中国',
    JP: '日本',
    KR: '韓国',
    EU: 'ヨーロッパ',
    LATAM: 'ラテンアメリカ'
  },
  modes: {
    [VisualizerMode.PLASMA]: 'プラズマ・フロウ',
    [VisualizerMode.BARS]: 'スペクトラム・バー',
    [VisualizerMode.PARTICLES]: 'スターフィールド',
    [VisualizerMode.TUNNEL]: 'ジオメトリック・トンネル',
    [VisualizerMode.SHAPES]: 'アブストラクト・シェイプ',
    [VisualizerMode.RINGS]: 'ネオン・リング',
    [VisualizerMode.NEBULA]: 'ディープ・ネブラ',
    [VisualizerMode.KALEIDOSCOPE]: '万華鏡',
    [VisualizerMode.LASERS]: 'コンサート・レーザー',
    [VisualizerMode.SILK]: 'シルク・ウェーブ',
    [VisualizerMode.LIQUID]: 'リキッド・スフィア',
    [VisualizerMode.TERRAIN]: 'ローポリ・テレイン'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: '標準',
    [LyricsStyle.KARAOKE]: 'カラオケ',
    [LyricsStyle.MINIMAL]: 'ミニマル'
  },
  helpModal: {
    title: 'Aura Vision ガイド',
    intro: 'Aura Visionは、デバイスのマイクを使用して音楽と同期したリアルタイムのアートを生成する没入型の視聴覚体験です。',
    shortcutsTitle: 'ショートカットキー',
    shortcutItems: {
      toggleMic: 'マイク開始 / 停止',
      fullscreen: '全画面切替',
      randomize: 'ランダム設定',
      lyrics: 'AI情報 表示 / 非表示',
      hideUi: 'パネル 表示 / 非表示',
      glow: 'グロー切替',
      trails: '残像切替',
      changeMode: 'モード変更',
      changeTheme: 'テーマ変更'
    },
    howItWorksTitle: '使い方',
    howItWorksSteps: [
      '1. マイクの使用を許可します。',
      '2. 高品質のオーディオを再生します。',
      '3. 周波数とビートに即座に反応します。',
      '4. 約30秒ごとにAIが曲を識別します。'
    ],
    settingsTitle: '設定ガイド',
    settingsDesc: {
      sensitivity: '音量に対する反応の感度。',
      speed: 'アニメーションの変化の速さ。',
      glow: 'ネオングローの効果強度。',
      trails: '滑らかな動きのための残像量。',
      smoothing: '反応の滑らかさの調整。',
      fftSize: 'スペクトラムの解像度。'
    },
    projectInfoTitle: 'プロジェクト概要',
    projectInfoText: 'Google Gemini 3 Flash、React 19、WebGLを搭載。',
    privacyTitle: 'プライバシー',
    privacyText: 'オーディオはローカルで処理されます。曲の識別のために一時的にデータが送信されますが、保存はされません。',
    version: 'リリース'
  },
  onboarding: {
    welcome: 'Aura Visionへようこそ',
    subtitle: '次世代AI音楽ビジュアライザー',
    selectLanguage: '言語を選択',
    next: '次へ',
    skip: 'スキップ',
    finish: '始める',
    features: {
      title: '主な機能',
      visuals: {
        title: '没入型ビジュアル',
        desc: 'Three.jsによる8種類以上のWebGL物理レンダリングエンジン。'
      },
      ai: {
        title: 'Gemini AI インテリジェンス',
        desc: 'Google Gemini 3によるリアルタイム의 曲識別とムード分析。'
      },
      privacy: {
        title: 'プライバシー優先',
        desc: 'ローカルスペクトル分析。音声データがサーバーに保存されることはありません。'
      }
    },
    shortcuts: {
      title: 'クイックコントロール',
      desc: 'キーボードショートカットで体験をマスターしましょう。'
    }
  }
};
