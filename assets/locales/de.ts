import { VisualizerMode, LyricsStyle } from '../../core/types';

export const de = {
  common: {
    on: 'AN',
    off: 'AUS',
    visible: 'SICHTBAR',
    hidden: 'VERSTECKT',
    active: 'AKTIV',
    muted: 'STUMM',
    beta: 'BETA'
  },
  tabs: {
    visual: 'Visuell',
    text: 'Text',
    audio: 'Audio',
    ai: 'KI-Erkennung',
    system: 'System'
  },
  hints: {
    mode: 'Wählen Sie den mathematischen Kern für die Generation von Visuals.',
    theme: 'Wenden Sie eine kuratierte Farbpalette auf die Szene an.',
    speed: 'Zeit-Multiplikator. Niedrige Werte sind hypnotisch; hohe Werte sind energetisch.',
    glow: 'Aktiviert Post-Processing-Bloom. Deaktivieren für bessere Leistung.',
    trails: 'Steuert die Pixel-Persistenz. Hohe Werte erzeugen flüssige, malerische Bewegungen.',
    sensitivity: 'Steuert die Audioverstärkung. Höhere Werte erzeugen explosive Reaktionen auf leise Geräusche.',
    smoothing: 'Zeitliche Dämpfung. Höhere Werte ergeben flüssige Bewegungen; niedriger ist zackig.',
    fftSize: 'Spektrale Auflösung. 4096 bietet feine Details, verbraucht aber mehr CPU.',
    lyrics: 'KI-gestützte Songidentifikation und Textabruf umschalten.',
    lyricsStyle: 'Passen Sie die visuelle Darstellung der synchronisierten Texte an.',
    region: 'Richtet die KI-Suchmaschine auf Musik dieses spezifischen Marktes aus.',
    autoRotate: 'Wechselt automatisch durch verschiedene visuelle Engines.',
    rotateInterval: 'Zeit in Sekunden vor dem Wechsel zur nächsten visuellen Engine.',
    cycleColors: 'Wechselt automatisch und fließend zwischen Farbthemen.',
    colorInterval: 'Zeit in Sekunden vor dem sanften Überblenden zur nächsten Farbpalette.',
    reset: 'Setzt alle Anwendungseinstellungen auf die Werkseinstellungen zurück.',
    resetVisual: 'Setzt nur die Ästhetik (Geschwindigkeit, Leuchten, Spuren) zurück.',
    randomize: 'Erzeugt eine zufällige Kombination aus visuellem Modus und Farben.',
    fullscreen: 'Schaltet den immersiven Vollbildmodus um.',
    help: 'Tastaturkürzel und Dokumentation anzeigen.',
    mic: 'Mikrofoneingang aktivieren oder stummschalten.',
    device: 'Wählen Sie die Hardware-Audioeingangsquelle.',
    monitor: 'Audioeingang auf Lautsprecher leiten (Vorsicht: Rückkopplungsgefahr).',
    wakeLock: 'Verhindert, dass der Bildschirm ausgeschaltet oder gedimmt wird, während der Visualizer aktiv ist.'
  },
  visualizerMode: 'Visualizer-Modus',
  styleTheme: 'Visuelles Thema',
  settings: 'Erweitert',
  sensitivity: 'Reaktionsempfindlichkeit',
  speed: 'Animationsgeschwindigkeit',
  glow: 'Neon-Glühen',
  trails: 'Bewegungsspuren',
  autoRotate: 'Modus-Zyklus',
  rotateInterval: 'Intervall (s)',
  cycleColors: 'Farb-Zyklus',
  colorInterval: 'Intervall (s)',
  monitorAudio: 'Audio überwachen',
  audioInput: 'Eingabegerät',
  lyrics: 'Songtexte',
  showLyrics: 'KI aktivieren',
  displaySettings: 'Anzeige',
  language: 'Sprache',
  region: 'Zielmarkt',
  startMic: 'Audio aktivieren',
  stopMic: 'Audio deaktivieren',
  listening: 'Aktiv',
  identifying: 'KI analysiert...',
  startExperience: 'Erlebnis starten',
  welcomeTitle: 'Aura Vision',
  welcomeText: 'Verwandeln Sie Audio in generative Kunst. Erleben Sie Echtzeit-Musikidentifikation und immersive Visualisierung.',
  hideOptions: 'Einklappen',
  showOptions: 'Optionen',
  reset: 'System zurücksetzen',
  resetVisual: 'Ästhetik zurücksetzen',
  resetText: 'Text zurücksetzen',
  resetAudio: 'Audio zurücksetzen',
  resetAi: 'KI zurücksetzen',
  randomize: 'Smart Random',
  help: 'Hilfe',
  close: 'Schließen',
  betaDisclaimer: 'Die KI-Erkennung befindet sich derzeit in der Beta-Phase.',
  wrongSong: 'Falscher Song?',
  hideCursor: 'Mauszeiger verbergen',
  customColor: 'Benutzerdefiniert',
  randomizeTooltip: 'Alle visuellen Einstellungen randomisieren',
  smoothing: 'Glättung',
  fftSize: 'Auflösung (FFT)',
  appInfo: 'Über die App',
  appDescription: 'Eine immersive Visualisierungssuite, angetrieben durch Echtzeit-Spektralanalyse und Gemini KI.',
  version: 'Build',
  defaultMic: 'Standardmikrofon',
  customText: 'Benutzerdefinierter Text',
  textProperties: 'Typografie & Layout',
  customTextPlaceholder: 'TEXT EINGEBEN',
  showText: 'Overlay anzeigen',
  pulseBeat: 'Pulsieren im Takt',
  textSize: 'Schriftgröße',
  textRotation: 'Drehung',
  textFont: 'Schriftart',
  textOpacity: 'Deckkraft',
  textPosition: 'Position',
  quality: 'Qualität',
  qualities: {
    low: 'Niedrig',
    med: 'Mittel',
    high: 'Hoch'
  },
  recognitionSource: 'KI-Anbieter',
  lyricsPosition: 'Textposition',
  simulatedDemo: 'Simuliert (Demo)',
  positions: {
      top: 'Oben',
      center: 'Mitte',
      bottom: 'Unten',
      tl: 'Oben links',
      tc: 'Oben mittig',
      tr: 'Oben rechts',
      ml: 'Mitte links',
      mc: 'Zentriert',
      mr: 'Mitte rechts',
      bl: 'Unten links',
      bc: 'Unten mittig',
      br: 'Unten rechts'
  },
  wakeLock: 'Wach bleiben',
  system: {
    shortcuts: {
      mic: 'Mikro',
      ui: 'UI',
      mode: 'Modus',
      random: 'Zufall'
    }
  },
  errors: {
    title: 'Audio-Fehler',
    accessDenied: 'Zugriff verweigert. Bitte überprüfen Sie Ihre Browser-Berechtigungen.',
    noDevice: 'Kein Audio-Eingabegerät gefunden.',
    deviceBusy: 'Audiogerät ist beschäftigt oder ungültig.',
    general: 'Zugriff auf Audiogerät nicht möglich.',
    tryDemo: 'Demo-Modus versuchen (Kein Audio)'
  },
  aiState: {
    active: 'Erkennung aktiv',
    enable: 'Erkennung aktivieren'
  },
  regions: {
    global: 'Global',
    US: 'USA / Westen',
    CN: 'China',
    JP: 'Japan',
    KR: 'Korea',
    EU: 'Europa',
    LATAM: 'Lateinamerika'
  },
  modes: {
    [VisualizerMode.PLASMA]: 'Plasma-Fluss',
    [VisualizerMode.BARS]: 'Frequenzbalken',
    [VisualizerMode.PARTICLES]: 'Sternenfeld',
    [VisualizerMode.TUNNEL]: 'Geometrischer Tunnel',
    [VisualizerMode.SHAPES]: 'Abstrakte Formen',
    [VisualizerMode.RINGS]: 'Neon-Ringe',
    [VisualizerMode.NEBULA]: 'Tiefer Nebel',
    [VisualizerMode.KALEIDOSCOPE]: 'Kaleidoskop',
    [VisualizerMode.LASERS]: 'Konzert-Laser',
    [VisualizerMode.SILK]: 'Seidenwellen',
    [VisualizerMode.LIQUID]: 'Flüssige Sphäre',
    [VisualizerMode.TERRAIN]: 'Low-Poly Terrain'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: 'Standard',
    [LyricsStyle.KARAOKE]: 'Karaoke',
    [LyricsStyle.MINIMAL]: 'Minimalistisch'
  },
  helpModal: {
    title: 'Aura Vision Anleitung',
    intro: 'Aura Vision verwandelt Ihren Mikrofoneingang mithilfe fortschrittlicher Spektralanalyse in reaktionsschnelle, generative digitale Kunst.',
    shortcutsTitle: 'Tastaturkürzel',
    shortcutItems: {
      toggleMic: 'Audio-Eingang [Space]',
      fullscreen: 'Vollbild [F]',
      randomize: 'Zufall [R]',
      lyrics: 'Song-Info [L]',
      hideUi: 'Bedienfeld [H]',
      glow: 'Leuchten [G]',
      trails: 'Spuren [T]',
      changeMode: 'Modus ändern [← →]',
      changeTheme: 'Thema ändern [↑ ↓]'
    },
    howItWorksTitle: 'Erste Schritte',
    howItWorksSteps: [
      'Erlauben Sie den Mikrofonzugriff, um die Analyse zu starten.',
      'Spielen Sie High-Fidelity-Audio in der Nähe des Sensors ab.',
      'Visuals reagieren in Echtzeit auf bestimmte Frequenzen.',
      'Alle 30-45 Sekunden erstellt die KI einen Schnappschuss zur Identifikation.'
    ],
    projectInfoTitle: 'Über Aura Vision',
    projectInfoText: 'Dieses Projekt kombiniert Echtzeit-Spektralanalyse mit der Leistungsfähigkeit von Google Gemini 3, React 19 und WebGL für ein immersives Erlebnis.',
    privacyTitle: 'Privatsphäre',
    privacyText: 'Die Audioanalyse erfolgt ausschließlich lokal in Ihrem Browser. Nur zur Songerkennung werden verschlüsselte Frequenzmerkmale an Gemini gesendet.',
    version: 'Release'
  },
  onboarding: {
    welcome: 'Willkommen bei Aura Vision',
    subtitle: 'KI-Musikvisualisierung der nächsten Generation',
    selectLanguage: 'Sprache wählen',
    next: 'Weiter',
    skip: 'Überspringen',
    finish: 'Starten',
    features: {
      title: 'Hauptfunktionen',
      visuals: {
        title: 'Immersive Visuals',
        desc: '8+ physikbasierte WebGL-Engines, betrieben von Three.js.'
      },
      ai: {
        title: 'Gemini KI',
        desc: 'Echtzeit-Songidentifikation und Stimmungserkennung powered by Google Gemini 3.'
      },
      privacy: {
        title: 'Datenschutz',
        desc: 'Lokale Spektralanalyse. Audiodaten werden niemals auf Servern gespeichert.'
      }
    },
    shortcuts: {
      title: 'Schnellsteuerung',
      desc: 'Meistern Sie das Erlebnis mit diesen Tasten.'
    }
  }
};