
import React, { useState, useEffect, useRef, useCallback } from 'react';
import VisualizerCanvas from './components/VisualizerCanvas';
import ThreeVisualizer from './components/ThreeVisualizer';
import Controls from './components/Controls';
import SongOverlay from './components/SongOverlay';
import { VisualizerMode, SongInfo, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice } from './types';
import { COLOR_THEMES } from './constants';
import { identifySongFromAudio } from './services/geminiService';
import { TRANSLATIONS } from './translations';

const DEFAULT_MODE = VisualizerMode.PLASMA; 
const DEFAULT_THEME_INDEX = 1; 
const DEFAULT_SETTINGS: VisualizerSettings = {
  sensitivity: 1.5,
  speed: 1.0,
  glow: true,
  trails: true,
  autoRotate: false,
  rotateInterval: 30,
  hideCursor: false,
  smoothing: 0.8,
  fftSize: 512, 
  quality: 'high'
};
const DEFAULT_LYRICS_STYLE = LyricsStyle.KARAOKE; 
const DEFAULT_SHOW_LYRICS = false;
const DEFAULT_LANGUAGE: Language = 'en'; 

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const getStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        return fallback;
      }
    }
    return fallback;
  };

  const detectDefaultRegion = (): Region => {
    const lang = navigator.language.toLowerCase();
    if (lang.includes('zh')) return 'CN';
    if (lang.includes('ja')) return 'JP';
    if (lang.includes('ko')) return 'KR';
    return 'global';
  };

  const [mode, setMode] = useState<VisualizerMode>(() => getStorage('sv_mode_v4', DEFAULT_MODE));
  const [colorTheme, setColorTheme] = useState<string[]>(() => getStorage('sv_theme', COLOR_THEMES[DEFAULT_THEME_INDEX]));
  const [settings, setSettings] = useState<VisualizerSettings>(() => getStorage('sv_settings_v3', DEFAULT_SETTINGS));
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);
  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(() => getStorage('sv_lyrics_style_v3', DEFAULT_LYRICS_STYLE));
  const [showLyrics, setShowLyrics] = useState<boolean>(() => getStorage('sv_show_lyrics', DEFAULT_SHOW_LYRICS));
  const [language, setLanguage] = useState<Language>(() => getStorage('sv_language', DEFAULT_LANGUAGE));
  const [region, setRegion] = useState<Region>(() => getStorage('sv_region', detectDefaultRegion()));

  useEffect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = settings.smoothing;
      if (analyser.fftSize !== settings.fftSize) {
        analyser.fftSize = settings.fftSize;
      }
    }
    localStorage.setItem('sv_settings_v3', JSON.stringify(settings));
    localStorage.setItem('sv_mode_v4', JSON.stringify(mode));
    localStorage.setItem('sv_show_lyrics', JSON.stringify(showLyrics));
    localStorage.setItem('sv_language', JSON.stringify(language));
    localStorage.setItem('sv_theme', JSON.stringify(colorTheme));
    localStorage.setItem('sv_lyrics_style_v3', JSON.stringify(lyricsStyle));
    localStorage.setItem('sv_region', JSON.stringify(region));
  }, [settings, mode, showLyrics, language, colorTheme, lyricsStyle, region, analyser]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 5)}` }));
        setAudioDevices(inputs);
      } catch (e) {
        console.error("Device fetch error:", e);
      }
    };
    fetchDevices();
  }, []);

  /**
   * Smart Random Logic
   * Ensures high-quality visual results by avoiding extreme/unstable parameter sets.
   */
  const randomizeSettings = useCallback(() => {
    // 1. Theme selection from expanded library
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    setColorTheme(randomTheme);

    // 2. Mode selection
    const modes = Object.values(VisualizerMode);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    setMode(randomMode);

    // 3. Smart parameter randomization (Sweet-spot ranges)
    setSettings(prev => ({
      ...prev,
      speed: 0.8 + Math.random() * 0.8, // Range [0.8, 1.6] - Dynamic but not chaotic
      sensitivity: 1.2 + Math.random() * 1.0, // Range [1.2, 2.2] - Strong response
      glow: Math.random() > 0.15, // 85% chance of Glow for better aesthetics
      trails: Math.random() > 0.2, // 80% chance of Trails for smoother motion
      smoothing: 0.7 + Math.random() * 0.2 // Range [0.7, 0.9] - Smooth but responsive
    }));
  }, []);

  /**
   * Full Factory Reset
   */
  const resetAppSettings = useCallback(() => {
    localStorage.clear(); 
    setSettings(DEFAULT_SETTINGS);
    setMode(DEFAULT_MODE);
    setColorTheme(COLOR_THEMES[DEFAULT_THEME_INDEX]);
    setLanguage(DEFAULT_LANGUAGE);
    setRegion(detectDefaultRegion());
    setLyricsStyle(DEFAULT_LYRICS_STYLE);
    setShowLyrics(DEFAULT_SHOW_LYRICS);
    setSelectedDeviceId('');
    setCurrentSong(null);
    // Reload can be used to ensure a clean state, but state resetting is usually enough
    window.location.reload(); 
  }, []);

  /**
   * Reset Visual Effects ONLY
   */
  const resetVisualSettings = useCallback(() => {
    setMode(DEFAULT_MODE);
    setColorTheme(COLOR_THEMES[DEFAULT_THEME_INDEX]);
    setSettings(prev => ({
      ...prev,
      speed: DEFAULT_SETTINGS.speed,
      glow: DEFAULT_SETTINGS.glow,
      trails: DEFAULT_SETTINGS.trails,
      autoRotate: DEFAULT_SETTINGS.autoRotate,
      smoothing: DEFAULT_SETTINGS.smoothing
    }));
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isListening && settings.autoRotate) {
      interval = window.setInterval(() => {
        const modes = Object.values(VisualizerMode);
        const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
        setMode(modes[nextIndex]);
      }, settings.rotateInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, settings.autoRotate, settings.rotateInterval, mode]);

  const startMicrophone = async (deviceId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: deviceId ? { deviceId: { exact: deviceId } } : {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const src = context.createMediaStreamSource(stream);
      const node = context.createAnalyser();
      node.fftSize = settings.fftSize;
      node.smoothingTimeConstant = settings.smoothing;
      src.connect(node);
      
      setAudioContext(context);
      setAnalyser(node);
      setMediaStream(stream);
      setIsListening(true);
    } catch (err) {
      console.error('Mic initialization error:', err);
      setIsListening(false);
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      if (audioContext) audioContext.close();
      setIsListening(false);
    } else {
      startMicrophone(selectedDeviceId);
    }
  };

  useEffect(() => {
    if (isListening && selectedDeviceId) {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      startMicrophone(selectedDeviceId);
    }
  }, [selectedDeviceId]);

  const performIdentification = useCallback(async (stream: MediaStream) => {
    if (!showLyrics || isIdentifying) return;
    setIsIdentifying(true);
    try {
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          const info = await identifySongFromAudio(base64Data, 'audio/webm', language, region);
          if (info && info.identified) setCurrentSong(info);
          setIsIdentifying(false);
        };
      };
      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), 5000); 
    } catch (e) {
      setIsIdentifying(false);
    }
  }, [showLyrics, isIdentifying, language, region]);

  useEffect(() => {
    let interval: number;
    if (isListening && mediaStream && showLyrics) {
      performIdentification(mediaStream);
      interval = window.setInterval(() => performIdentification(mediaStream), 30000);
    }
    return () => clearInterval(interval);
  }, [isListening, mediaStream, showLyrics, performIdentification]);

  const isThreeMode = mode === VisualizerMode.SILK || mode === VisualizerMode.LIQUID || mode === VisualizerMode.TERRAIN;
  const t = TRANSLATIONS[language];

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-fade-in-up">
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">{t.welcomeTitle}</h1>
          <p className="text-gray-400 text-sm leading-relaxed">{t.welcomeText}</p>
          <button onClick={() => { setHasStarted(true); startMicrophone(); }} className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all">{t.startExperience}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black overflow-hidden relative ${settings.hideCursor ? 'cursor-none' : ''}`}>
      {isThreeMode ? (
        <ThreeVisualizer analyser={analyser} mode={mode} colors={colorTheme} settings={settings} />
      ) : (
        <VisualizerCanvas analyser={analyser} mode={mode} colors={colorTheme} settings={settings} song={currentSong} showLyrics={showLyrics} lyricsStyle={lyricsStyle} />
      )}
      <SongOverlay song={currentSong} lyricsStyle={lyricsStyle} showLyrics={showLyrics} language={language} onRetry={() => mediaStream && performIdentification(mediaStream)} onClose={() => setCurrentSong(null)} analyser={analyser} sensitivity={settings.sensitivity} />
      <Controls 
        currentMode={mode} setMode={setMode} colorTheme={colorTheme} setColorTheme={setColorTheme}
        toggleMicrophone={toggleMicrophone} isListening={isListening} isIdentifying={isIdentifying}
        lyricsStyle={lyricsStyle} setLyricsStyle={setLyricsStyle} showLyrics={showLyrics} setShowLyrics={setShowLyrics}
        language={language} setLanguage={setLanguage} region={region} setRegion={setRegion}
        settings={settings} setSettings={setSettings} 
        resetSettings={resetAppSettings}
        resetVisualSettings={resetVisualSettings}
        randomizeSettings={randomizeSettings}
        audioDevices={audioDevices} selectedDeviceId={selectedDeviceId} onDeviceChange={setSelectedDeviceId}
      />
    </div>
  );
};

export default App;
