import { VisualizerMode, LyricsStyle } from '../../core/types';

export const en = {
  common: {
    on: 'ON',
    off: 'OFF',
    visible: 'VISIBLE',
    hidden: 'HIDDEN',
    active: 'ACTIVE',
    muted: 'MUTED',
    beta: 'BETA'
  },
  tabs: {
    visual: 'Visual',
    text: 'Text',
    audio: 'Audio',
    ai: 'AI Recognition',
    system: 'System'
  },
  hints: {
    mode: 'Select the core mathematical engine for generating visuals.',
    theme: 'Apply a curated color palette to the scene.',
    speed: 'Time-scale multiplier. Low values are hypnotic; high values are energetic.',
    glow: 'Enable post-processing bloom. Disable to improve performance.',
    trails: 'Controls pixel persistence. High values create fluid, paint-like motion.',
    sensitivity: 'Controls audio gain. Higher values create explosive reactions to subtle sounds.',
    smoothing: 'Temporal damping. Higher values yield liquid-like movement; lower is twitchy.',
    fftSize: 'Spectral resolution. 4096 provides fine detail but uses more CPU.',
    lyrics: 'Toggle AI-powered song identification and lyric fetching.',
    lyricsStyle: 'Customize the visual presentation of the synchronized lyrics.',
    region: 'Bias the AI search engine towards music from this specific market.',
    autoRotate: 'Automatically cycle through different visual engines.',
    rotateInterval: 'Time in seconds before switching to the next visual engine.',
    cycleColors: 'Transita automatically between color themes over time.',
    colorInterval: 'Time in seconds before smoothly blending to the next color palette.',
    reset: 'Restore all application settings to factory defaults.',
    confirmReset: 'Confirm Reset? This action cannot be undone.',
    resetVisual: 'Reset only aesthetics (Speed, Glow, Trails) to defaults.',
    randomize: 'Generate a serendipitous combination of visual mode and colors.',
    fullscreen: 'Toggle immersive full-screen mode.',
    help: 'View keyboard shortcuts and documentation.',
    mic: 'Activate or mute microphone input.',
    device: 'Select the hardware audio input source.',
    monitor: 'Route audio input to speakers (Caution: may cause feedback loop).',
    wakeLock: 'Prevent the screen from turning off or dimming while the visualizer is active.',
    showFps: 'Display a real-time frames-per-second counter.',
    showTooltips: 'Enable helpful floating hints when hovering over controls.',
    doubleClickFullscreen: 'Toggle fullscreen mode by double-clicking anywhere on the visualizer.',
    autoHideUi: 'Automatically hide the control panel after a period of inactivity.',
    mirrorDisplay: 'Flip the visualizer output horizontally (useful for rear projection or webcam).'
  },
  visualizerMode: 'Visualizer Mode',
  styleTheme: 'Visual Theme',
  settings: 'Advanced',
  sensitivity: 'Response Sensitivity',
  speed: 'Animation Speed',
  glow: 'Neon Glow',
  trails: 'Motion Trails',
  autoRotate: 'Visualizer Mode Cycle',
  rotateInterval: 'Interval (s)',
  cycleColors: 'Auto-Cycle Colors',
  colorInterval: 'Interval (s)',
  cycleSpeed: 'Cycle Duration (s)',
  monitorAudio: 'Monitor Audio',
  audioInput: 'Input Device',
  lyrics: 'Lyrics',
  showLyrics: 'Enable AI Recognition',
  displaySettings: 'Display Settings',
  language: 'UI Language',
  region: 'Target Market',
  startMic: 'Enable Audio',
  stopMic: 'Disable Audio',
  listening: 'Active',
  identifying: 'AI Analyzing...',
  startExperience: 'Launch Experience',
  welcomeTitle: 'Aura Vision | The Sound of Light',
  welcomeText: 'Transmute every vibration into generative masterpieces. Powered by Gemini AI for real-time recognition, experience the ultimate synesthetic journey.',
  unsupportedTitle: 'Incompatible Browser',
  unsupportedText: 'Aura Vision requires modern Web Audio and Media features. Please switch to a recent version of Chrome, Edge, or Safari to continue.',
  hideOptions: 'Collapse',
  showOptions: 'Expand Options',
  reset: 'Reset System',
  resetVisual: 'Reset Aesthetics',
  resetText: 'Reset Text',
  resetAudio: 'Reset Audio',
  resetAi: 'Reset AI',
  randomize: 'Smart Random',
  help: 'Support',
  close: 'Dismiss',
  betaDisclaimer: 'AI Recognition is currently in Beta.',
  wrongSong: 'Not the right song?',
  hideCursor: 'Hide Cursor',
  customColor: 'Custom',
  randomizeTooltip: 'Randomize all visual settings',
  smoothing: 'Smoothing',
  fftSize: 'Resolution (FFT)',
  appInfo: 'About App',
  appDescription: 'An immersive visualization suite driven by real-time spectral analysis and Gemini AI recognition.',
  version: 'Build',
  defaultMic: 'Default Microphone',
  customText: 'Custom Text Content',
  textProperties: 'Typography & Layout',
  customTextPlaceholder: 'ENTER TEXT',
  showText: 'Show Overlay',
  pulseBeat: 'Pulse with Beat',
  textSize: 'Font Size',
  textRotation: 'Rotation',
  textFont: 'Font Family',
  textOpacity: 'Opacity',
  textPosition: 'Text Position',
  quality: 'Visual Quality',
  qualities: {
    low: 'Low',
    med: 'Medium',
    high: 'High'
  },
  visualPanel: {
    effects: 'Effects',
    automation: 'Automation',
    display: 'Display'
  },
  audioPanel: {
    info: 'Adjust input sensitivity and smoothing to customize how the visualizer reacts to audio dynamics. Higher FFT sizes provide more spectral detail but consume more CPU.'
  },
  systemPanel: {
    interface: 'Interface',
    behavior: 'Behavior',
    maintenance: 'Maintenance'
  },
  showFps: 'Show FPS',
  showTooltips: 'Show Tooltips',
  doubleClickFullscreen: 'Double-Click Fullscreen',
  autoHideUi: 'Automatically hide the control panel after a period of inactivity.',
  mirrorDisplay: 'Mirror Display',
  presets: {
    title: 'Smart Presets',
    hint: 'Apply a professionally curated aesthetic combination with one click.',
    select: 'Select a mood...',
    calm: 'Hypnotic & Calm',
    party: 'Energetic Party',
    ambient: 'Ambient Focus',
    cyberpunk: 'Cyberpunk Rush',
    retrowave: 'Retro Sunset',
    vocal: 'Vocal Focus'
  },
  recognitionSource: 'AI Provider',
  lyricsPosition: 'Lyrics Position',
  lyricsFont: 'Font Family',
  lyricsFontSize: 'Font Size',
  simulatedDemo: 'Simulated (Demo)',
  positions: {
      top: 'Top',
      center: 'Center',
      bottom: 'Bottom',
      tl: 'Top Left',
      tc: 'Top Center',
      tr: 'Top Right',
      ml: 'Mid Left',
      mc: 'Center',
      mr: 'Mid Right',
      bl: 'Bottom Left',
      bc: 'Bottom Center',
      br: 'Bottom Right'
  },
  wakeLock: 'Stay Awake',
  system: {
    shortcuts: {
      mic: 'Mic',
      ui: 'UI',
      mode: 'Mode',
      random: 'Random'
    }
  },
  errors: {
    title: 'Audio Error',
    accessDenied: 'Access denied. Please check your browser permissions for microphone.',
    noDevice: 'No audio input device found.',
    deviceBusy: 'Audio device is busy or invalid.',
    general: 'Could not access audio device.',
    tryDemo: 'Try Demo Mode (No Audio)'
  },
  aiState: {
    active: 'Recognition Active',
    enable: 'Enable AI Recognition'
  },
  regions: {
    global: 'Global',
    US: 'USA / West',
    CN: 'China',
    JP: 'Japan',
    KR: 'Korea',
    EU: 'Europe',
    LATAM: 'Latin America'
  },
  modes: {
    [VisualizerMode.PLASMA]: 'Plasma Flow',
    [VisualizerMode.BARS]: 'Frequency Bars',
    [VisualizerMode.PARTICLES]: 'Starfield (Drift)',
    [VisualizerMode.TUNNEL]: 'Geometric Tunnel',
    [VisualizerMode.RINGS]: 'Neon Rings',
    [VisualizerMode.NEBULA]: 'Deep Nebula',
    [VisualizerMode.LASERS]: 'Concert Lasers',
    [VisualizerMode.FLUID_CURVES]: 'Aura Waves',
    [VisualizerMode.MACRO_BUBBLES]: 'Macro Bubbles (DoF)',
    [VisualizerMode.SILK]: 'Silk Waves',
    [VisualizerMode.LIQUID]: 'Liquid Sphere',
    [VisualizerMode.TERRAIN]: 'Low-Poly Terrain'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: 'Standard',
    [LyricsStyle.KARAOKE]: 'Karaoke',
    [LyricsStyle.MINIMAL]: 'Minimalist'
  },
  helpModal: {
    title: 'Aura Vision Guide',
    tabs: {
        guide: 'Guide',
        shortcuts: 'Shortcuts',
        about: 'About'
    },
    intro: 'Aura Vision transforms your microphone input into highly responsive, generative digital art using advanced spectral analysis.',
    shortcutsTitle: 'Keyboard Interaction',
    shortcutItems: {
      toggleMic: 'Toggle Audio Input',
      fullscreen: 'Enter Fullscreen',
      randomize: 'Randomize Aesthetic',
      lyrics: 'Toggle AI Info',
      hideUi: 'Toggle Control Panel',
      glow: 'Toggle Bloom',
      trails: 'Toggle Motion Blur',
      changeMode: 'Cycle Modes',
      changeTheme: 'Cycle Themes'
    },
    howItWorksTitle: 'How to Use',
    howItWorksSteps: [
      '1. Grant Permissions: Click "Start" and allow the browser to access your audio input.',
      '2. Play Music: Play audio near your device. The visuals react to the microphone in real-time.',
      '3. Explore Modes: Open the Options panel (or press H) to switch visual engines.',
      '4. AI Recognition: Press L to identify the current song and its aesthetic mood.'
    ],
    settingsTitle: 'Parameter Guide',
    settingsDesc: {
      sensitivity: 'Gain control for audio-reactive elements.',
      speed: 'Temporal frequency of the generative patterns.',
      glow: 'Bloom intensity for atmospheric depth.',
      trails: 'Temporal accumulation for fluid movement.',
      smoothing: 'Temporal damping of the frequency data.',
      fftSize: 'Sub-band count for spectral resolution.'
    },
    projectInfoTitle: 'Project Description',
    aboutDescription: 'A next-generation synesthetic experience. Aura Vision fuses high-precision Web Audio spectral analysis with Google\'s Gemini 3 AI to transform sound into living, reactive light. Designed for VJs, Streamers, and immersive environments.',
    privacyTitle: 'Privacy Policy',
    privacyText: 'Audio is analyzed locally. Temporary high-frequency snapshots are sent to Gemini solely for identification.',
    version: 'Release'
  },
  onboarding: {
    welcome: 'Welcome to Aura Vision',
    subtitle: 'Next-Gen AI Synesthesia Engine',
    selectLanguage: 'Choose your language',
    next: 'Proceed',
    back: 'Previous',
    skip: 'Skip',
    finish: 'Launch App',
    features: {
      title: 'Experience Features',
      visuals: {
        title: 'Generative Masterpieces',
        desc: '12+ reactive engines powered by WebGL and math-driven procedural art.'
      },
      ai: {
        title: 'Gemini AI Intelligence',
        desc: 'Instant recognition of tracks and aesthetic mood through advanced AI grounding.'
      },
      privacy: {
        title: 'Secure & Private',
        desc: 'Processing stays local. We never record or store your private audio data.'
      }
    },
    shortcuts: {
      title: 'Dynamic Controls',
      desc: 'Master your environment with these keys.'
    }
  }
};