
import { VisualizerMode, LyricsStyle } from '../../core/types';

export const es = {
  common: {
    on: 'ON',
    off: 'OFF',
    visible: 'VISIBLE',
    hidden: 'OCULTO',
    active: 'ACTIVO',
    muted: 'SILENCIO',
    beta: 'BETA'
  },
  tabs: {
    visual: 'Visual',
    text: 'Texto',
    audio: 'Audio',
    ai: 'Reconocimiento IA',
    system: 'Sistema'
  },
  hints: {
    mode: 'Elige un motor matemático central para generar los visuales.',
    theme: 'Aplica una paleta de colores curada a la escena.',
    speed: 'Multiplicador de escala de tiempo. Valores bajos son hipnóticos; altos son enérgicos.',
    glow: 'Habilita el resplandor de post-procesamiento. Desactiva para mejorar el rendimiento.',
    trails: 'Controla la persistencia de píxeles. Valores altos crean movimiento fluido tipo pintura.',
    sensitivity: 'Controla la ganancia de audio. Valores altos crean reacciones explosivas a sonidos sutiles.',
    smoothing: 'Amortiguación temporal. Valores altos dan movimiento líquido; bajos son nerviosos.',
    fftSize: 'Resolución espectral. 4096 proporciona gran detalle pero usa más CPU.',
    lyrics: 'Alterna la identificación de canciones y obtención de letras con IA.',
    lyricsStyle: 'Personaliza la presentación visual de las letras sincronizadas.',
    region: 'Orienta el motor de búsqueda IA hacia la música de este mercado específico.',
    autoRotate: 'Cicla automáticamente a través de diferentes motores visuales.',
    rotateInterval: 'Tiempo en segundos antes de cambiar al siguiente motor visual.',
    cycleColors: 'Transita automáticamente entre temas de color a lo largo del tiempo.',
    colorInterval: 'Tiempo en segundos antes de mezclarse suavemente con la siguiente paleta.',
    reset: 'Restaura toda la configuración de la aplicación a los valores de fábrica.',
    resetVisual: 'Restablece solo la estética (Velocidad, Brillo, Estelas) a los valores predeterminados.',
    randomize: 'Genera una combinación fortuita de modo visual y colores.',
    fullscreen: 'Alterna el modo inmersivo de pantalla completa.',
    help: 'Ver atajos de teclado y documentación.',
    mic: 'Activa o silencia la entrada del micrófono.',
    device: 'Selecciona la fuente de entrada de audio de hardware.',
    monitor: 'Envía la entrada de audio a los altavoces (Precaución: puede causar retroalimentación).',
    wakeLock: 'Evita que la pantalla se apague o se atenúe mientras el visualizador está activo.'
  },
  visualizerMode: 'Modo Visualizador',
  styleTheme: 'Tema Visual',
  settings: 'Avanzado',
  sensitivity: 'Sensibilidad',
  speed: 'Velocidad',
  glow: 'Brillo Neón',
  trails: 'Estelas',
  autoRotate: 'Ciclo Automático',
  rotateInterval: 'Intervalo (s)',
  cycleColors: 'Ciclo de Colores',
  colorInterval: 'Intervalo (s)',
  monitorAudio: 'Monitor de Audio',
  audioInput: 'Dispositivo de Entrada',
  lyrics: 'Letras',
  showLyrics: 'Habilitar IA',
  displaySettings: 'Visualización',
  language: 'Idioma',
  region: 'Mercado Objetivo',
  startMic: 'Activar Audio',
  stopMic: 'Desactivar Audio',
  listening: 'Activo',
  identifying: 'Analizando IA...',
  startExperience: 'Iniciar Experiencia',
  welcomeTitle: 'Aura Vision',
  welcomeText: 'Traduce audio en arte generativo. Experimenta la identificación de música en tiempo real y visualización inmersiva.',
  unsupportedTitle: 'Navegador no compatible',
  unsupportedText: 'Aura Vision requiere funciones modernas (como el acceso al micrófono) que no están disponibles en tu navegador. Por favor, actualiza a una versión reciente de Chrome, Firefox o Safari.',
  hideOptions: 'Colapsar',
  showOptions: 'Expandir Opciones',
  reset: 'Reiniciar Sistema',
  resetVisual: 'Reiniciar Estética',
  resetText: 'Reiniciar Texto',
  resetAudio: 'Reiniciar Audio',
  resetAi: 'Reiniciar IA',
  randomize: 'Aleatorio Inteligente',
  help: 'Soporte',
  close: 'Cerrar',
  betaDisclaimer: 'El reconocimiento por IA está actualmente en Beta.',
  wrongSong: '¿Canción incorrecta?',
  hideCursor: 'Ocultar Cursor',
  customColor: 'Personalizado',
  randomizeTooltip: 'Aleatorizar configuración visual',
  smoothing: 'Suavizado',
  fftSize: 'Resolución (FFT)',
  appInfo: 'Sobre la App',
  appDescription: 'Una suite de visualización inmersiva impulsada por análisis espectral en tiempo real y IA Gemini.',
  version: 'Versión',
  defaultMic: 'Micrófono Predeterminado',
  customText: 'Texto Personalizado',
  textProperties: 'Tipografía y Diseño',
  customTextPlaceholder: 'INGRESAR TEXTO',
  showText: 'Mostrar Superposición',
  pulseBeat: 'Pulsar con el Ritmo',
  textSize: 'Tamaño de Fuente',
  textRotation: 'Rotación',
  textFont: 'Fuente',
  textOpacity: 'Opacidad',
  textPosition: 'Posición',
  quality: 'Calidad Visual',
  qualities: {
    low: 'Baja',
    med: 'Media',
    high: 'Alta'
  },
  recognitionSource: 'Fuente de IA',
  lyricsPosition: 'Posición de Letras',
  lyricsFont: 'Familia de Fuentes',
  lyricsFontSize: 'Tamaño de Fuente',
  simulatedDemo: 'Simulado (Demo)',
  positions: {
      top: 'Arriba',
      center: 'Centro',
      bottom: 'Abajo',
      tl: 'Superior Izquierda',
      tc: 'Superior Centro',
      tr: 'Superior Derecha',
      ml: 'Medio Izquierda',
      mc: 'Centro',
      mr: 'Medio Derecha',
      bl: 'Inferior Izquierda',
      bc: 'Inferior Centro',
      br: 'Inferior Derecha'
  },
  wakeLock: 'No dormir',
  system: {
    shortcuts: {
      mic: 'Mic',
      ui: 'Interfaz',
      mode: 'Modo',
      random: 'Aleatorio'
    }
  },
  errors: {
    title: 'Error de Audio',
    accessDenied: 'Acceso denegado. Por favor revisa los permisos del micrófono.',
    noDevice: 'No se encontró dispositivo de entrada de audio.',
    deviceBusy: 'El dispositivo de audio está ocupado o no es válido.',
    general: 'No se pudo acceder al dispositivo de audio.',
    tryDemo: 'Pruebe el modo de demostración (sin audio)'
  },
  aiState: {
    active: 'Reconocimiento Activo',
    enable: 'Habilitar Reconocimiento'
  },
  regions: {
    global: 'Global',
    US: 'EE.UU. / Oeste',
    CN: 'China',
    JP: 'Japón',
    KR: 'Corea',
    EU: 'Europa',
    LATAM: 'Latinoamérica'
  },
  modes: {
    [VisualizerMode.PLASMA]: 'Flujo de Plasma',
    [VisualizerMode.BARS]: 'Barras de Frecuencia',
    [VisualizerMode.PARTICLES]: 'Campo Estelar',
    [VisualizerMode.TUNNEL]: 'Túnel Geométrico',
    [VisualizerMode.SHAPES]: 'Formas Abstractas',
    [VisualizerMode.RINGS]: 'Anillos de Neón',
    [VisualizerMode.NEBULA]: 'Nebulosa Profunda',
    [VisualizerMode.KALEIDOSCOPE]: 'Caleidoscopio',
    [VisualizerMode.LASERS]: 'Láseres de Concierto',
    [VisualizerMode.FLUID_CURVES]: 'Ondas de Seda',
    [VisualizerMode.MACRO_BUBBLES]: 'Burbujas Macro',
    [VisualizerMode.SILK]: 'Ondas de Seda',
    [VisualizerMode.LIQUID]: 'Esfera Líquida',
    [VisualizerMode.TERRAIN]: 'Terreno Low-Poly'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: 'Estándar',
    [LyricsStyle.KARAOKE]: 'Karaoke',
    [LyricsStyle.MINIMAL]: 'Minimalista'
  },
  helpModal: {
    title: 'Guía de Aura Vision',
    intro: 'Aura Vision transforma la entrada de tu micrófono en arte digital generativo utilizando análisis espectral avanzado.',
    shortcutsTitle: 'Atajos de Teclado',
    shortcutItems: {
      toggleMic: 'Activar Micrófono [Space]',
      fullscreen: 'Pantalla Completa [F]',
      randomize: 'Aleatorizar [R]',
      lyrics: 'Info de Canción [L]',
      hideUi: 'Panel de Control [H]',
      glow: 'Efecto Brillo [G]',
      trails: 'Efecto Estelas [T]',
      changeMode: 'Cambiar Modo [← →]',
      changeTheme: 'Cambiar Tema [↑ ↓]'
    },
    howItWorksTitle: 'Comenzando',
    howItWorksSteps: [
      'Autoriza el acceso al micrófono para comenzar el análisis.',
      'Reproduce audio de alta fidelidad cerca del sensor.',
      'Los visuales responden en tiempo real a frecuencias específicas.',
      'Cada 30-45 segundos, la IA captura audio para identificar la canción.'
    ],
    projectInfoTitle: 'Sobre el Proyecto',
    projectInfoText: 'Impulsado por Google Gemini 3, React 19 y WebGL para una experiencia visual de alto rendimiento.',
    privacyTitle: 'Privacidad',
    privacyText: 'El análisis de audio es local. Solo se envían firmas digitales anónimas a Gemini para la identificación de música.',
    version: 'Lanzamiento'
  },
  onboarding: {
    welcome: 'Bienvenido a Aura Vision',
    subtitle: 'Visualización de Música con IA de Nueva Generación',
    selectLanguage: 'Seleccionar Idioma',
    next: 'Siguiente',
    back: 'Volver',
    skip: 'Omitir',
    finish: 'Comenzar',
    features: {
      title: 'Características Principales',
      visuals: {
        title: 'Visuales Inmersivos',
        desc: 'Más de 8 motores de física WebGL impulsados por Three.js.'
      },
      ai: {
        title: 'Inteligencia Gemini AI',
        desc: 'Identificación de canciones en tiempo real y detección de estado de ánimo con Google Gemini 3.'
      },
      privacy: {
        title: 'Privacidad Primero',
        desc: 'Análisis espectral local. El audio nunca se almacena en servidores.'
      }
    },
    shortcuts: {
      title: 'Controles Rápidos',
      desc: 'Domina la experiencia con estas teclas.'
    }
  }
};