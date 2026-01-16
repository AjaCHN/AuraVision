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
    ai: 'Identification IA',
    system: 'Système'
  },
  hints: {
    mode: 'Sélectionnez le moteur mathématique principal pour générer les visuels.',
    theme: 'Appliquez une palette de couleurs soignée à la scène.',
    speed: 'Multiplicateur de temps. Les valeurs basses sont hypnotiques ; les hautes sont énergiques.',
    glow: 'Active le bloom post-traitement. Désactivez pour améliorer les performances.',
    trails: 'Contrôle la persistance des pixels. Des valeurs élevées créent un mouvement fluide.',
    sensitivity: 'Contrôle le gain audio. Des valeurs élevées créent des réactions explosives.',
    smoothing: 'Amortissement temporel. Des valeurs élevées donnent un mouvement fluide.',
    fftSize: 'Résolution spectrale. 4096 fournit des détails fins mais utilise plus de CPU.',
    lyrics: 'Active l\'identification de chanson et la récupération des paroles par IA.',
    lyricsStyle: 'Personnalisez la présentation visuelle des paroles synchronisées.',
    region: 'Oriente le moteur de recherche IA vers la musique de ce marché spécifique.',
    autoRotate: 'Change automatiquement de moteur visuel.',
    rotateInterval: 'Temps avant de passer au moteur visuel suivant.',
    cycleColors: 'Transitionne automatiquement entre les thèmes de couleur.',
    colorInterval: 'Temps avant de se fondre vers la palette suivante.',
    reset: 'Restaure tous les paramètres de l\'application aux valeurs d\'usine.',
    confirmReset: 'Confirmer la réinitialisation ? Cette action est irréversible.',
    resetVisual: 'Réinitialise uniquement l\'esthétique (Vitesse, Lueur, Traînées).',
    randomize: 'Génère une combinaison fortuite de mode visuel et de couleurs.',
    fullscreen: 'Active le mode plein écran immersif.',
    help: 'Voir les raccourcis clavier et la documentation.',
    mic: 'Active ou coupe l\'entrée microphone.',
    device: 'Sélectionnez la source d\'entrée audio matérielle.',
    monitor: 'Sortie vers haut-parleurs (Attention : risque de larsen).',
    wakeLock: 'Empêche l\'écran de s\'éteindre pendant que le visualiseur est actif.',
    showFps: 'Affichage des images par seconde en temps réel.',
    showTooltips: 'Affiche des indices flottants au survol des commandes.',
    doubleClickFullscreen: 'Double-cliquez n\'importe où pour basculer en plein écran.',
    autoHideUi: 'Masque automatiquement le panneau après une période d\'inactivité.',
    mirrorDisplay: 'Inverse l\'affichage horizontalement (utile pour la rétroprojection).'
  },
  visualizerMode: 'Mode Visualiseur',
  styleTheme: 'Thème Visuel',
  settings: 'Avancé',
  sensitivity: 'Sensibilité',
  speed: 'Vitesse d\'Évolution',
  glow: 'Éclat Néon',
  trails: 'Traînées de Mouvement',
  autoRotate: 'Cycle des Modes',
  rotateInterval: 'Intervalle (s)',
  cycleColors: 'Cycle des Couleurs',
  colorInterval: 'Intervalle (s)',
  cycleSpeed: 'Durée Cycle (s)',
  monitorAudio: 'Moniteur Audio',
  audioInput: 'Périphérique d\'Entrée',
  lyrics: 'Paroles IA',
  showLyrics: 'Activer l\'Identification',
  displaySettings: 'Affichage',
  language: 'Langue Système',
  region: 'Marché Cible',
  startMic: 'Activer Capture',
  stopMic: 'Arrêter Capture',
  listening: 'À l\'écoute',
  identifying: 'IA en cours d\'analyse...',
  startExperience: 'Lancer l\'Expérience',
  welcomeTitle: 'Aura Vision | Le Son de la Lumière',
  welcomeText: 'Transmutez chaque vibration en un chef-d\'œuvre génératif. Propulsé par Gemini IA pour une reconnaissance en temps réel, vivez le voyage synesthésique ultime.',
  unsupportedTitle: 'Navigateur non supporté',
  unsupportedText: 'Aura Vision nécessite des fonctionnalités Web Audio modernes. Veuillez utiliser une version récente de Chrome, Edge ou Safari.',
  hideOptions: 'Réduire',
  showOptions: 'Options',
  reset: 'Réinitialisation Système',
  resetVisual: 'Réinit. Esthétique',
  resetText: 'Réinit. Texte',
  resetAudio: 'Réinit. Audio',
  resetAi: 'Réinit. IA',
  randomize: 'Aléatoire Intelligent',
  help: 'Support & Guide',
  close: 'Fermer',
  betaDisclaimer: 'L\'identification IA est en phase Bêta.',
  wrongSong: 'Mauvaise chanson ? Réessayer',
  hideCursor: 'Masquer le curseur',
  customColor: 'Couleur Texte',
  randomizeTooltip: 'Aléatoire complet (R)',
  smoothing: 'Lissage',
  fftSize: 'Résolution (FFT)',
  appInfo: 'À propos',
  appDescription: 'Une suite de visualisation immersive propulsée par l\'analyse spectrale et l\'IA Gemini.',
  version: 'Build',
  defaultMic: 'Micro par défaut',
  customText: 'Texte Personnalisé',
  textProperties: 'Typographie & Mise en page',
  customTextPlaceholder: 'ENTRER TEXTE',
  showText: 'Afficher Superposition',
  pulseBeat: 'Pulsation au Rythme',
  textSize: 'Taille Police',
  textRotation: 'Rotation',
  textFont: 'Police',
  textOpacity: 'Opacité',
  textPosition: 'Position',
  quality: 'Qualité de Rendu',
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
  audioPanel: {
    info: 'Ajustez la sensibilité et le lissage pour personnaliser la réaction au son. Des tailles FFT plus élevées offrent plus de détails mais consomment plus de CPU.'
  },
  systemPanel: {
    interface: 'Interface',
    behavior: 'Comportement',
    maintenance: 'Maintenance'
  },
  showFps: 'Afficher FPS',
  showTooltips: 'Afficher Aide',
  doubleClickFullscreen: 'Double-clic Plein écran',
  autoHideUi: 'Masquer UI auto.',
  mirrorDisplay: 'Affichage Miroir',
  presets: {
    title: 'Préréglages Intelligents',
    hint: 'Appliquez des combinaisons esthétiques professionnelles en un clic.',
    select: 'Choisir une ambiance...',
    calm: 'Hypnotique & Calme',
    party: 'Fête Énergique',
    ambient: 'Focus Ambiant',
    cyberpunk: 'Cyberpunk Rush',
    retrowave: 'Retro Sunset',
    vocal: 'Focus Vocal'
  },
  recognitionSource: 'Fournisseur IA',
  lyricsPosition: 'Position',
  lyricsFont: 'Police',
  lyricsFontSize: 'Taille',
  simulatedDemo: 'Simulation (Demo)',
  positions: {
      top: 'Haut',
      center: 'Centre',
      bottom: 'Bas',
      tl: 'Haut Gauche',
      tc: 'Haut Milieu',
      tr: 'Haut Droite',
      ml: 'Milieu Gauche',
      mc: 'Centre',
      mr: 'Milieu Droite',
      bl: 'Bas Gauche',
      bc: 'Bas Milieu',
      br: 'Bas Droite'
  },
  wakeLock: 'Rester éveillé',
  system: {
    shortcuts: {
      mic: 'Micro',
      ui: 'Interface',
      mode: 'Mode',
      random: 'Hasard'
    }
  },
  errors: {
    title: 'Erreur Audio',
    accessDenied: 'Accès refusé. Vérifiez les permissions du micro.',
    noDevice: 'Aucun périphérique trouvé.',
    deviceBusy: 'Périphérique occupé ou invalide.',
    general: 'Impossible d\'accéder à l\'audio.',
    tryDemo: 'Mode Démo (Sans Audio)'
  },
  aiState: {
    active: 'Identification Active',
    enable: 'Lancer l\'Identification'
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
    [VisualizerMode.PARTICLES]: 'Voyage Stellaire',
    [VisualizerMode.TUNNEL]: 'Tunnel Géométrique',
    [VisualizerMode.RINGS]: 'Anneaux Néon',
    [VisualizerMode.NEBULA]: 'Nébuleuse Profonde',
    [VisualizerMode.LASERS]: 'Matrice Lasers',
    [VisualizerMode.FLUID_CURVES]: 'Danse des Aurores',
    [VisualizerMode.MACRO_BUBBLES]: 'Macro-bulles (DoF)',
    [VisualizerMode.SILK]: 'Soie Flottante (WebGL)',
    [VisualizerMode.LIQUID]: 'Sphère Liquide (WebGL)',
    [VisualizerMode.TERRAIN]: 'Relief Low-Poly (WebGL)'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: 'Mise en page Standard',
    [LyricsStyle.KARAOKE]: 'Dynamique',
    [LyricsStyle.MINIMAL]: 'Minimaliste'
  },
  helpModal: {
    title: 'Guide Aura Vision',
    tabs: {
        guide: 'Guide',
        shortcuts: 'Raccourcis',
        about: 'À propos'
    },
    intro: 'Aura Vision transforme votre entrée microphone en art numérique génératif basé sur une analyse spectrale de haute précision.',
    shortcutsTitle: 'Interaction Clavier',
    shortcutItems: {
      toggleMic: 'Activer Microphone',
      fullscreen: 'Plein écran',
      randomize: 'Aléatoire Esthétique',
      lyrics: 'Info Morceau IA',
      hideUi: 'Afficher/Masquer Panneau',
      glow: 'Effet Lueur Néon',
      trails: 'Effet Traînées',
      changeMode: 'Changer de Mode',
      changeTheme: 'Changer de Thème'
    },
    howItWorksTitle: 'Utilisation',
    howItWorksSteps: [
      '1. Autorisations : Cliquez sur "Lancer" et autorisez l\'accès au micro.',
      '2. Musique : Jouez du son à proximité, les visuels réagiront instantanément.',
      '3. Exploration : Ouvrez le panneau (H) pour basculer entre 12+ moteurs.',
      '4. Identification IA : Pressez L pour identifier le titre et l\'ambiance.'
    ],
    settingsTitle: 'Guide des Paramètres',
    settingsDesc: {
      sensitivity: 'Gain pour la réactivité visuelle au signal.',
      speed: 'Vitesse d\'évolution temporelle des algorithmes.',
      glow: 'Intensité de l\'illumination atmosphérique.',
      trails: 'Accumulation pour un mouvement fluide.',
      smoothing: 'Lissage temporel des données de fréquence.',
      fftSize: 'Précision de l\'analyse spectrale.'
    },
    projectInfoTitle: 'Description du Projet',
    aboutDescription: 'Expérience synesthésique de nouvelle génération. Aura Vision fusionne l\'analyse de précision avec Google Gemini 3 pour transformer le son en lumière vive. Idéal pour les VJs, streamers et installations immersives.',
    privacyTitle: 'Confidentialité & Sécurité',
    privacyText: 'L\'analyse audio est locale. Seules des signatures chiffrées sont envoyées à Gemini pour l\'identification ; aucun enregistrement n\'est stocké.',
    version: 'Release'
  },
  onboarding: {
    welcome: 'Bienvenue sur Aura Vision',
    subtitle: 'Moteur de Synesthésie IA de Nouvelle Génération',
    selectLanguage: 'Choisissez votre langue',
    next: 'Suivant',
    back: 'Retour',
    skip: 'Passer',
    finish: 'Démarrer App',
    features: {
      title: 'Caractéristiques Clés',
      visuals: {
        title: 'Art Génératif',
        desc: '12+ moteurs WebGL qui matérialisent les ondes sonores.'
      },
      ai: {
        title: 'Intelligence Gemini IA',
        desc: 'Identification instantanée des morceaux et ambiances via Google Gemini 3.'
      },
      privacy: {
        title: 'Sécurisé & Privé',
        desc: 'Le traitement reste local. Nous n\'enregistrons jamais vos données audio privées.'
      }
    },
    shortcuts: {
      title: 'Contrôle Dynamique',
      desc: 'Maîtrisez votre environnement avec ces touches.'
    }
  }
};