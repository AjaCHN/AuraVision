
import { VisualizerMode, LyricsStyle } from '../../core/types';

export const fr = {
  common: {
    on: 'ON',
    off: 'OFF',
    visible: 'VISIBLE',
    hidden: 'MASQUÉ',
    active: 'ACTIF',
    muted: 'MUET',
    beta: 'BÊTA'
  },
  tabs: {
    visual: 'Visuel',
    text: 'Texte',
    audio: 'Audio',
    ai: 'Reconnaissance IA',
    system: 'Système'
  },
  hints: {
    mode: 'Sélectionnez le moteur mathématique principal pour générer les visuels.',
    theme: 'Appliquez une palette de couleurs soignée à la scène.',
    speed: 'Multiplicateur d\'échelle de temps. Les valeurs basses sont hypnotiques ; les hautes sont énergiques.',
    glow: 'Active le bloom post-traitement. Désactivez pour améliorer les performances.',
    trails: 'Contrôle la persistance des pixels. Des valeurs élevées créent un mouvement fluide, comme de la peinture.',
    sensitivity: 'Contrôle le gain audio. Des valeurs élevées créent des réactions explosives aux sons subtils.',
    smoothing: 'Amortissement temporel. Des valeurs élevées donnent un mouvement liquide ; basses sont nerveuses.',
    fftSize: 'Résolution spectrale. 4096 fournit des détails fins mais utilise plus de CPU.',
    lyrics: 'Active/désactive l\'identification de chanson et la récupération des paroles par IA.',
    lyricsStyle: 'Personnalisez la présentation visuelle des paroles synchronisées.',
    region: 'Oriente le moteur de recherche IA vers la musique de ce marché spécifique.',
    autoRotate: 'Change automatiquement de moteur visuel.',
    rotateInterval: 'Temps en secondes avant de passer au moteur visuel suivant.',
    cycleColors: 'Transitionne automatiquement et en douceur entre les thèmes de couleur.',
    colorInterval: 'Temps en secondes avant de se fondre doucement vers la palette suivante.',
    reset: 'Restaure tous les paramètres de l\'application aux valeurs d\'usine.',
    confirmReset: 'Confirmer la réinitialisation ? Cette action est irréversible.',
    resetVisual: 'Réinitialise uniquement l\'esthétique (Vitesse, Lueur, Traînées) par défaut.',
    randomize: 'Génère une combinaison fortuite de mode visuel et de couleurs.',
    fullscreen: 'Active/désactive le mode plein écran immersif.',
    help: 'Voir les raccourcis clavier et la documentation.',
    mic: 'Active ou coupe l\'entrée microphone.',
    device: 'Sélectionnez la source d\'entrée audio matérielle.',
    monitor: 'Dirige l\'entrée audio vers les haut-parleurs (Attention : risque de larsen).',
    wakeLock: 'Empêche l\'écran de s\'éteindre ou de s\'assombrir pendant que le visualiseur est actif.'
  },
  visualizerMode: 'Mode Visualiseur',
  styleTheme: 'Thème Visuel',
  settings: 'Avancé',
  sensitivity: 'Sensibilité',
  speed: 'Vitesse',
  glow: 'Lueur Néon',
  trails: 'Traînées',
  autoRotate: 'Cycle Auto',
  rotateInterval: 'Intervalle (s)',
  cycleColors: 'Cycle Couleurs',
  colorInterval: 'Intervalle (s)',
  monitorAudio: 'Retour Audio',
  audioInput: 'Entrée Audio',
  lyrics: 'Paroles',
  showLyrics: 'Activer l\'IA',
  displaySettings: 'Affichage',
  language: 'Langue',
  region: 'Marché Cible',
  startMic: 'Activer Audio',
  stopMic: 'Désactiver Audio',
  listening: 'Actif',
  identifying: 'Analyse IA...',
  startExperience: 'Lancer l\'Expérience',
  welcomeTitle: 'Aura Vision',
  welcomeText: 'Traduisez l\'audio en art génératif. Découvrez l\'identification musicale en temps réel et la visualisation immersive.',
  unsupportedTitle: 'Navigateur non supporté',
  unsupportedText: 'Aura Vision nécessite des fonctionnalités modernes (comme l\'accès au microphone) qui ne sont pas disponibles dans votre navigateur. Veuillez mettre à jour vers une version récente de Chrome, Firefox ou Safari.',
  hideOptions: 'Réduire',
  showOptions: 'Options',
  reset: 'Réinitialiser',
  confirmReset: 'Confirmer ?',
  resetVisual: 'Réinit. Visuel',
  resetText: 'Réinit. Texte',
  resetAudio: 'Réinit. Audio',
  resetAi: 'Réinit. IA',
  randomize: 'Aléatoire',
  help: 'Aide',
  close: 'Fermer',
  betaDisclaimer: 'La reconnaissance IA est actuellement en version bêta.',
  wrongSong: 'Mauvaise chanson ?',
  hideCursor: 'Masquer le curseur',
  customColor: 'Personnalisé',
  randomizeTooltip: 'Aléatoire (paramètres visuels)',
  smoothing: 'Lissage',
  fftSize: 'Résolution (FFT)',
  appInfo: 'À propos',
  appDescription: 'Une suite de visualisation immersive propulsée par l\'analyse spectrale en temps réel et l\'IA Gemini.',
  version: 'Version',
  defaultMic: 'Micro par défaut',
  customText: 'Texte Personnalisé',
  textProperties: 'Typographie & Mise en page',
  customTextPlaceholder: 'ENTRER TEXTE',
  showText: 'Afficher la superposition',
  pulseBeat: 'Pulsation au rythme',
  textSize: 'Taille de la police',
  textRotation: 'Rotation',
  textFont: 'Police',
  textOpacity: 'Opacity',
  textPosition: 'Position',
  quality: 'Qualité',
  qualities: {
    low: 'Basse',
    med: 'Moyenne',
    high: 'Haute'
  },
  visualPanel: {
    effects: 'Effets',
    automation: 'Automatisation',
    display: 'Affichage'
  },
  presets: {
    title: 'Préréglages Intelligents',
    hint: 'Appliquez une combinaison esthétique professionnelle en un clic.',
    select: 'Choisissez une ambiance...',
    calm: 'Hypnotique et Calme',
    party: 'Fête Énergique',
    psychedelic: 'Voyage Psychédélique',
    ambient: 'Concentration Ambiante'
  },
  recognitionSource: 'Source IA',
  lyricsPosition: 'Position des Paroles',
  lyricsFont: 'Police de caractères',
  lyricsFontSize: 'Taille de la police',
  simulatedDemo: 'Simulation (Démo)',
  positions: {
      top: 'Haut',
      center: 'Centre',
      bottom: 'Bas',
      tl: 'Haut Gauche',
      tc: 'Haut Milieu',
      tr: 'Haut Droite',
      ml: 'Milieu Gauche',
      mc: 'Centré',
      mr: 'Milieu Droite',
      bl: 'Bas Gauche',
      bc: 'Bas Milieu',
      br: 'Bas Droite'
  },
  wakeLock: 'Rester éveillé',
  system: {
    shortcuts: {
      mic: 'Micro',
      ui: 'UI',
      mode: 'Mode',
      random: 'Aléatoire'
    }
  },
  errors: {
    title: 'Erreur Audio',
    accessDenied: 'Accès refusé. Veuillez vérifier les permissions de votre navigateur.',
    noDevice: 'Aucun périphérique d\'entrée audio trouvé.',
    deviceBusy: 'Le périphérique audio est occupé ou invalide.',
    general: 'Impossible d\'accéder au périphérique audio.',
    tryDemo: 'Essayer le mode Démo (pas d\'audio)'
  },
  aiState: {
    active: 'Reconnaissance Active',
    enable: 'Activer Reconnaissance'
  },
  regions: {
    global: 'Global',
    US: 'USA / Ouest',
    CN: 'Chine',
    JP: 'Japon',
    KR: 'Corée',
    EU: 'Europe',
    LATAM: 'Amérique Latine'
  },
  modes: {
    [VisualizerMode.PLASMA]: 'Flux Plasma',
    [VisualizerMode.BARS]: 'Barres de Fréquence',
    [VisualizerMode.PARTICLES]: 'Champ d\'Étoiles',
    [VisualizerMode.TUNNEL]: 'Tunnel Géométrique',
    [VisualizerMode.RINGS]: 'Anneaux Néon',
    [VisualizerMode.NEBULA]: 'Nébuleuse Profonde',
    [VisualizerMode.LASERS]: 'Lasers de Concert',
    [VisualizerMode.FLUID_CURVES]: 'Danse des Aurores',
    [VisualizerMode.MACRO_BUBBLES]: 'Micro-vacuoles',
    [VisualizerMode.SILK]: 'Vagues de Soie',
    [VisualizerMode.LIQUID]: 'Sphère Liquide',
    [VisualizerMode.TERRAIN]: 'Terrain Low-Poly'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: 'Standard',
    [LyricsStyle.KARAOKE]: 'Karaoké',
    [LyricsStyle.MINIMAL]: 'Minimaliste'
  },
  helpModal: {
    title: 'Guide Aura Vision',
    tabs: {
        guide: 'Guide',
        shortcuts: 'Raccourcis',
        about: 'À propos'
    },
    intro: 'Aura Vision transforme votre entrée microphone en art numérique génératif hautement réactif grâce à une analyse spectrale avancée.',
    shortcutsTitle: 'Raccourcis Clavier',
    shortcutItems: {
      toggleMic: 'Activer Microphone',
      fullscreen: 'Plein Écran',
      randomize: 'Aléatoire',
      lyrics: 'Info Chanson',
      hideUi: 'Panneau de Contrôle',
      glow: 'Effet Lueur',
      trails: 'Effet Traînées',
      changeMode: 'Changer Mode',
      changeTheme: 'Changer Thème'
    },
    howItWorksTitle: 'Commencer',
    howItWorksSteps: [
      'Autorisez l\'accès au microphone pour commencer l\'analyse.',
      'Jouez de l\'audio haute fidélité près du capteur.',
      'Les visuels réagissent en temps réel à des fréquences spécifiques.',
      'Toutes les 30-45 secondes, l\'IA capture l\'audio pour identification.'
    ],
    projectInfoTitle: 'À Propos',
    projectInfoText: 'Propulsé par Google Gemini 3, React 19 et WebGL pour une expérience immersive.',
    privacyTitle: 'Confidentialité',
    privacyText: 'L\'analyse audio est locale. Seules des empreintes numériques cryptées sont envoyées à Gemini pour l\'identification musicale.',
    version: 'Release'
  },
  onboarding: {
    welcome: 'Bienvenue sur Aura Vision',
    subtitle: 'Visualisation Musicale IA',
    selectLanguage: 'Choisir la langue',
    next: 'Suivant',
    back: 'Retour',
    skip: 'Passer',
    finish: 'Commencer',
    features: {
      title: 'Fonctionnalités Clés',
      visuals: {
        title: 'Visuels',
        desc: '8+ moteurs physiques WebGL basés sur Three.js.'
      },
      ai: {
        title: 'Gemini IA',
        desc: 'Identification de chansons en temps réel powered by Google Gemini 3.'
      },
      privacy: {
        title: 'Confidentialité',
        desc: 'Analyse spectrale locale. Les données audio ne sont jamais stockées.'
      }
    },
    shortcuts: {
      title: 'Contrôles',
      desc: 'Maîtrisez l\'expérience avec ces touches.'
    }
  }
};