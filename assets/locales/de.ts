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
    speed: 'Zeit-Multiplikator. Niedrige Werte sind hypnotisch; hohe Werte energetisch.',
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
    confirmReset: 'Zurücksetzen bestätigen? Diese Aktion kann nicht rückgängig gemacht werden.',
    resetVisual: 'Setzt nur die Ästhetik (Geschwindigkeit, Leuchten, Spuren) zurück.',
    randomize: 'Erzeugt eine zufällige Kombination aus visuellem Modus und Farben.',
    fullscreen: 'Schaltet den immersiven Vollbildmodus um.',
    help: 'Tastaturkürzel und Dokumentation anzeigen.',
    mic: 'Mikrofoneingang aktivieren oder stummschalten.',
    device: 'Wählen Sie die Hardware-Audioeingangsquelle.',
    monitor: 'Audioeingang auf Lautsprecher leiten (Vorsicht: Rückkopplungsgefahr).',
    wakeLock: 'Verhindert, dass der Bildschirm ausgeschaltet oder gedimmt wird, während der Visualizer aktiv ist.',
    showFps: 'Echtzeit-Anzeige der Bilder pro Sekunde.',
    showTooltips: 'Hilfreiche Hinweise beim Überfahren von Steuerelementen.',
    doubleClickFullscreen: 'Doppelklick zum Umschalten des Vollbildmodus.',
    autoHideUi: 'Bedienfeld bei Inaktivität automatisch ausblenden.',
    mirrorDisplay: 'Visualisierung horizontal spiegeln (nützlich für Rückprojektionen).'
  },
  visualizerMode: 'Visualizer-Modus',
  styleTheme: 'Visuelles Thema',
  settings: 'Erweitert',
  sensitivity: 'Reaktionsempfindlichkeit',
  speed: 'Evolutionsgeschwindigkeit',
  glow: 'Neon-Glühen',
  trails: 'Bewegungsspuren',
  autoRotate: 'Modus-Zyklus',
  rotateInterval: 'Intervall (s)',
  cycleColors: 'Farb-Zyklus',
  colorInterval: 'Intervall (s)',
  cycleSpeed: 'Zyklusdauer (s)',
  monitorAudio: 'Monitoring',
  audioInput: 'Eingabegerät',
  lyrics: 'KI-Erkennung',
  showLyrics: 'Erkennung aktivieren',
  displaySettings: 'Anzeige',
  language: 'Sprache',
  region: 'Zielmarkt',
  startMic: 'Capture Starten',
  stopMic: 'Capture Stoppen',
  listening: 'Aktiv',
  identifying: 'KI analysiert Track...',
  startExperience: 'Erlebnis Starten',
  welcomeTitle: 'Aura Vision | Der Klang des Lichts',
  welcomeText: 'Verwandeln Sie jede Schwingung in ein generatives Meisterwerk. Angetrieben von Gemini AI für Echtzeit-Erkennung – erleben Sie die ultimative synästhetische Reise.',
  unsupportedTitle: 'Browser nicht unterstützt',
  unsupportedText: 'Aura Vision erfordert moderne Web Audio Funktionen. Bitte nutzen Sie eine aktuelle Version von Chrome, Edge oder Safari.',
  hideOptions: 'Einklappen',
  showOptions: 'Optionen anzeigen',
  reset: 'System zurücksetzen',
  resetVisual: 'Ästhetik zurücksetzen',
  resetText: 'Text zurücksetzen',
  resetAudio: 'Audio zurücksetzen',
  resetAi: 'KI zurücksetzen',
  randomize: 'Intelligenter Zufall',
  help: 'Hilfe & Guide',
  close: 'Schließen',
  betaDisclaimer: 'KI-Erkennung befindet sich in der Beta-Phase.',
  wrongSong: 'Falscher Song? Erneut versuchen',
  hideCursor: 'Mauszeiger verbergen',
  customColor: 'Textfarbe',
  randomizeTooltip: 'Alle Einstellungen randomisieren (R)',
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
  quality: 'Renderqualität',
  qualities: {
    low: 'Niedrig',
    med: 'Mittel',
    high: 'Hoch'
  },
  visualPanel: {
    effects: 'Effekte',
    automation: 'Automatisierung',
    display: 'Anzeige'
  },
  audioPanel: {
    info: 'Passen Sie Empfindlichkeit und Glättung an, um die Reaktion auf die Audiodynamik zu optimieren. Höhere FFT-Werte bieten mehr Details, belasten aber die CPU.'
  },
  systemPanel: {
    interface: 'Oberfläche',
    behavior: 'Verhalten',
    maintenance: 'Wartung'
  },
  showFps: 'FPS anzeigen',
  showTooltips: 'Tooltips anzeigen',
  doubleClickFullscreen: 'Doppelklick Vollbild',
  autoHideUi: 'Auto-Hide UI',
  mirrorDisplay: 'Spiegeln',
  presets: {
    title: 'Smart Presets',
    hint: 'Wenden Sie kuratierte ästhetische Kombinationen mit einem Klick an.',
    select: 'Stimmung wählen...',
    calm: 'Hypnotisch & Ruhig',
    party: 'Energetische Party',
    ambient: 'Ambient Fokus',
    cyberpunk: 'Cyberpunk Rush',
    retrowave: 'Retro Sunset',
    vocal: 'Vocal Fokus'
  },
  recognitionSource: 'KI-Anbieter',
  lyricsPosition: 'Position',
  lyricsFont: 'Schriftart',
  lyricsFontSize: 'Größe',
  simulatedDemo: 'Simulation (Demo)',
  positions: {
      top: 'Oben',
      center: 'Mitte',
      bottom: 'Unten',
      tl: 'Oben Links',
      tc: 'Oben Mitte',
      tr: 'Oben Rechts',
      ml: 'Mitte Links',
      mc: 'Zentrum',
      mr: 'Mitte Rechts',
      bl: 'Unten Links',
      bc: 'Unten Mitte',
      br: 'Unten Rechts'
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
    accessDenied: 'Zugriff verweigert. Bitte überprüfen Sie die Mikrofonberechtigungen.',
    noDevice: 'Kein Gerät gefunden.',
    deviceBusy: 'Gerät belegt oder ungültig.',
    general: 'Zugriff auf Audio fehlgeschlagen.',
    tryDemo: 'Demo-Modus (Kein Audio)'
  },
  aiState: {
    active: 'Erkennung Aktiv',
    enable: 'KI-Erkennung starten'
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
    [VisualizerMode.PLASMA]: 'Fluid-Plasma',
    [VisualizerMode.BARS]: 'Frequenzbalken',
    [VisualizerMode.PARTICLES]: 'Sternenfeld',
    [VisualizerMode.TUNNEL]: 'Geometrischer Tunnel',
    [VisualizerMode.RINGS]: 'Neon-Ringe',
    [VisualizerMode.NEBULA]: 'Deep Nebula',
    [VisualizerMode.LASERS]: 'Konzert-Laser',
    [VisualizerMode.FLUID_CURVES]: 'Aura-Wellen',
    [VisualizerMode.MACRO_BUBBLES]: 'Makro-Blasen (DoF)',
    [VisualizerMode.SILK]: 'Seidenwellen (WebGL)',
    [VisualizerMode.LIQUID]: 'Flüssige Sphäre (WebGL)',
    [VisualizerMode.TERRAIN]: 'Low-Poly Terrain (WebGL)'
  },
  lyricsStyles: {
    [LyricsStyle.STANDARD]: 'Standard Layout',
    [LyricsStyle.KARAOKE]: 'Dynamisch',
    [LyricsStyle.MINIMAL]: 'Minimalistisch'
  },
  helpModal: {
    title: 'Aura Vision Guide',
    tabs: {
        guide: 'Anleitung',
        shortcuts: 'Kürzel',
        about: 'Über'
    },
    intro: 'Aura Vision verwandelt Mikrofon-Input basierend auf Echtzeit-Spektralanalyse in mathematisch generierte digitale Kunst.',
    shortcutsTitle: 'Tastatur-Steuerung',
    shortcutItems: {
      toggleMic: 'Audio Ein/Aus',
      fullscreen: 'Vollbild umschalten',
      randomize: 'Ästhetik-Zufall',
      lyrics: 'Track-Info umschalten',
      hideUi: 'Panel ein/ausblenden',
      glow: 'Glüheffekt umschalten',
      trails: 'Spureneffekt umschalten',
      changeMode: 'Modus wechseln',
      changeTheme: 'Thema wechseln'
    },
    howItWorksTitle: 'Verwendung',
    howItWorksSteps: [
      '1. Berechtigungen: Klicken Sie auf "Start" und erlauben Sie den Mikrofonzugriff.',
      '2. Musik abspielen: Die Visuals reagieren sofort auf Klänge in Ihrer Nähe.',
      '3. Modi erkunden: Öffnen Sie das Panel (H), um zwischen 12+ Engines zu wählen.',
      '4. KI-Erkennung: Drücken Sie L, um den aktuellen Song und die Stimmung zu analysieren.'
    ],
    settingsTitle: 'Parameter Guide',
    settingsDesc: {
      sensitivity: 'Verstärkung für die visuelle Reaktivität.',
      speed: 'Zeitliche Evolutionsrate der Algorithmen.',
      glow: 'Intensität der atmosphärischen Beleuchtung.',
      trails: 'Akkumulation für flüssige Bewegungen.',
      smoothing: 'Zeitliche Dämpfung der Frequenzdaten.',
      fftSize: 'Präzision der Spektralanalyse.'
    },
    projectInfoTitle: 'Über das Projekt',
    aboutDescription: 'Synästhetisches Erlebnis der nächsten Generation. Aura Vision fusioniert Präzisions-Analyse mit Google Gemini 3, um Schall in lebendiges Licht zu wandeln. Ideal für VJs, Streamer und Rauminszenierungen.',
    privacyTitle: 'Datenschutz & Sicherheit',
    privacyText: 'Die Audioanalyse erfolgt lokal. Nur verschlüsselte Merkmale werden zur Songerkennung an Gemini gesendet; es werden keine Aufnahmen gespeichert.',
    version: 'Release'
  },
  onboarding: {
    welcome: 'Willkommen bei Aura Vision',
    subtitle: 'Nächste Generation der KI-Synästhesie',
    selectLanguage: 'Sprache wählen',
    next: 'Weiter',
    back: 'Zurück',
    skip: 'Überspringen',
    finish: 'App Starten',
    features: {
      title: 'Kernfunktionen',
      visuals: {
        title: 'Generative Kunst',
        desc: '12+ WebGL-basierte Engines, die Schallwellen materialisieren.'
      },
      ai: {
        title: 'Gemini KI Intelligenz',
        desc: 'Sofortige Erkennung von Tracks und Stimmung durch Google Gemini 3.'
      },
      privacy: {
        title: 'Sicher & Privat',
        desc: 'Die Verarbeitung bleibt lokal. Wir speichern niemals Ihre privaten Audiodaten.'
      }
    },
    shortcuts: {
      title: 'Dynamische Steuerung',
      desc: 'Beherrschen Sie das Licht mit Ihren Tasten.'
    }
  }
};