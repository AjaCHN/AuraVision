
import { VisualizerMode, LyricsStyle } from '../../types';

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
    resetVisual: 'Reset only aesthetics (Speed, Glow, Trails) to defaults.',
    randomize: 'Generate a serendipitous combination of visual mode and colors.',
    fullscreen: 'Toggle immersive full-screen mode.',
    help: 'View keyboard shortcuts and documentation.',
    mic: 'Activate or mute microphone input.',
    device: 'Select the hardware audio input source.',
    monitor: 'Route audio input to speakers (Caution: may cause feedback loop).',
    wakeLock: 'Prevent the screen from turning off or dimming while the visualizer is active.'
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
  welcomeTitle: 'Aura Vision',
  welcomeText: 'Translate audio into generative art. Experience real-time music identification and immersive visualization.',
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
  quality: 'Visual Quality',
  qualities: {
    low: 'Low',
    med: 'Medium',
    high: 'High'
  },
  recognitionSource: 'AI Provider',
  lyricsPosition: 'Lyrics Position',
  simulatedDemo: 'Simulated (Demo)',
  positions: {
      top: 'Top',
      center: 'Center',
      bottom: 'Bottom'
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
    general: 'Could not access audio device.'
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
    [VisualizerMode.PARTICLES]: 'Starfield',
    [VisualizerMode.TUNNEL]: 'Geometric Tunnel',
    [VisualizerMode.SHAPES]: 'Abstract Shapes',
    [VisualizerMode.RINGS]: 'Neon Rings',
    [VisualizerMode.NEBULA]: 'Deep Nebula',
    [VisualizerMode.KALEIDOSCOPE]: 'Kaleidoscope',
    [VisualizerMode.LASERS]: 'Concert Lasers',
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
    howItWorksTitle: 'Getting Started',
    howItWorksSteps: [
      '1. Authorize microphone access to begin analysis.',
      '2. Play high-fidelity audio near the sensor.',
      '3. Visuals respond in real-time to specific frequencies.',
      '4. Every 30s, AI snapshots audio to identify metadata.'
    ],
    settingsTitle: 'Parameter Guide',
    settingsDesc: {
      sensitivity: 'Gain control for audio-reactive elements.',
      speed: 'Temporal frequency of the generative patterns.',
      glow: 'Intensidad del resplandor de post-procesamiento.',
      trails: 'Temporal accumulation for fluid movement.',
      smoothing: 'Temporal damping of the frequency data.',
      fftSize: 'Sub-band count for spectral resolution.'
    },
    projectInfoTitle: 'Project Description',
    projectInfoText: 'Powered by Google Gemini 3 Flash, React 19, and hardware-accelerated WebGL.',
    privacyTitle: 'Privacy Policy',
    privacyText: 'Audio is analyzed locally. Temporary high-frequency snapshots are sent to Gemini solely for identification.',
    version: 'Release'
  },
  onboarding: {
    welcome: 'Welcome to Aura Vision',
    subtitle: 'Next-Gen AI Music Visualization',
    selectLanguage: 'Select Language',
    next: 'Next',
    skip: 'Skip',
    finish: 'Get Started',
    features: {
      title: 'Core Features',
      visuals: {
        title: 'Immersive Visuals',
        desc: '8+ Physics-based WebGL engines powered by Three.js.'
      },
      ai: {
        title: 'Gemini AI Intelligence',
        desc: 'Real-time song identification and mood detection powered by Google Gemini 3.'
      },
      privacy: {
        title: 'Privacy First',
        desc: 'Local spectral analysis. Audio is never stored on servers.'
      }
    },
    shortcuts: {
      title: 'Quick Controls',
      desc: 'Master the experience with these keys.'
    }
  }
};
