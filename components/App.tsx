
import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import VisualizerCanvas from './visualizers/VisualizerCanvas';
import ThreeVisualizer from './visualizers/ThreeVisualizer';
import Controls from './controls/Controls';
import SongOverlay from './ui/SongOverlay';
import CustomTextOverlay from './ui/CustomTextOverlay';
import LyricsOverlay from './ui/LyricsOverlay';
import { OnboardingOverlay } from './ui/OnboardingOverlay'; 
import { VisualizerMode, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice, SongInfo } from '../core/types';
import { COLOR_THEMES } from '../core/constants';
import { TRANSLATIONS } from '../core/i18n';
import { useAudio } from '../core/hooks/useAudio';
import { useLocalStorage } from '../core/hooks/useLocalStorage';
import { useIdentification } from '../core/hooks/useIdentification';

// --- State Management: AppContext ---

interface AppContextType {
  mode: VisualizerMode; setMode: React.Dispatch<React.SetStateAction<VisualizerMode>>;
  colorTheme: string[]; setColorTheme: React.Dispatch<React.SetStateAction<string[]>>;
  settings: VisualizerSettings; setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
  lyricsStyle: LyricsStyle; setLyricsStyle: React.Dispatch<React.SetStateAction<LyricsStyle>>;
  showLyrics: boolean; setShowLyrics: React.Dispatch<React.SetStateAction<boolean>>;
  language: Language; setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  region: Region; setRegion: React.Dispatch<React.SetStateAction<Region>>;
  selectedDeviceId: string; onDeviceChange: React.Dispatch<React.SetStateAction<string>>;
  
  isListening: boolean; isSimulating: boolean; isIdentifying: boolean;
  analyser: AnalyserNode | null; mediaStream: MediaStream | null; audioDevices: AudioDevice[];
  currentSong: SongInfo | null; setCurrentSong: React.Dispatch<React.SetStateAction<SongInfo | null>>;
  errorMessage: string | null; setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  
  toggleMicrophone: (deviceId: string) => void;
  startDemoMode: () => Promise<void>;
  performIdentification: (stream: MediaStream) => Promise<void>;
  randomizeSettings: () => void;
  resetSettings: () => void;
  resetVisualSettings: () => void;
  resetTextSettings: () => void;
  resetAudioSettings: () => void;
  resetAiSettings: () => void;
  t: any;
}

const AppContext = createContext<AppContextType | null>(null);
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

// --- Constants & Defaults ---

const ONBOARDING_KEY = 'av_v1_has_onboarded'; 
const DEFAULT_MODE = VisualizerMode.PLASMA; 
const DEFAULT_THEME_INDEX = 1; 
const DEFAULT_SETTINGS: VisualizerSettings = {
  sensitivity: 1.5, speed: 1.0, glow: true, trails: true, autoRotate: false, rotateInterval: 30,
  cycleColors: false, colorInterval: 45, hideCursor: false, smoothing: 0.8, fftSize: 512, 
  quality: 'high', monitor: false, wakeLock: false, customText: 'AURA', showCustomText: false,
  textPulse: true, customTextRotation: 0, customTextSize: 12, customTextFont: 'Inter, sans-serif',
  customTextOpacity: 0.35, customTextColor: '#ffffff', customTextPosition: 'mc', lyricsPosition: 'mc',
  recognitionProvider: 'GEMINI'
};
const DEFAULT_LYRICS_STYLE = LyricsStyle.KARAOKE; 
const DEFAULT_SHOW_LYRICS = false;
const DEFAULT_LANGUAGE: Language = 'en'; 

// --- Main App Component (Provider) ---

const App: React.FC = () => {
  const { getStorage, setStorage, clearStorage } = useLocalStorage();
  const [hasStarted, setHasStarted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem(ONBOARDING_KEY));
  
  const wakeLockRef = useRef<any>(null);

  const detectDefaultRegion = (): Region => {
    const lang = navigator.language.toLowerCase();
    if (lang.includes('zh')) return 'CN';
    if (lang.includes('ja')) return 'JP';
    if (lang.includes('ko')) return 'KR';
    return 'global';
  };

  const [mode, setMode] = useState<VisualizerMode>(() => getStorage('mode', DEFAULT_MODE));
  const [colorTheme, setColorTheme] = useState<string[]>(() => getStorage('theme', COLOR_THEMES[DEFAULT_THEME_INDEX]));
  // FIX: The original `getStorage` call was not typed, causing a TypeScript error.
  // Refactored to properly type the retrieved settings and ensure `showCustomText` is handled correctly.
  const [settings, setSettings] = useState<VisualizerSettings>(() => {
    const savedSettings = getStorage<Partial<VisualizerSettings>>('settings', {});
    return { 
      ...DEFAULT_SETTINGS, 
      ...savedSettings, 
      showCustomText: savedSettings.showCustomText ?? false 
    };
  });
  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(() => getStorage('lyricsStyle', DEFAULT_LYRICS_STYLE));
  const [showLyrics, setShowLyrics] = useState<boolean>(() => getStorage('showLyrics', DEFAULT_SHOW_LYRICS));
  const [language, setLanguage] = useState<Language>(() => { const saved = getStorage<Language>('language', DEFAULT_LANGUAGE); return TRANSLATIONS[saved] ? saved : DEFAULT_LANGUAGE; });
  const [region, setRegion] = useState<Region>(() => getStorage('region', detectDefaultRegion()));
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => getStorage('deviceId', ''));

  const t = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];

  const { isListening, isSimulating, analyser, mediaStream, audioDevices, errorMessage, setErrorMessage, startMicrophone, startDemoMode, toggleMicrophone } = useAudio({ settings, language });
  const { isIdentifying, currentSong, setCurrentSong, performIdentification } = useIdentification({ language, region, provider: settings.recognitionProvider, showLyrics });

  const requestWakeLock = useCallback(async () => {
    if ('wakeLock' in navigator && settings.wakeLock && hasStarted) {
      try {
        if (wakeLockRef.current) await wakeLockRef.current.release();
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err: any) { console.warn(`[WakeLock] Failed: ${err.message}`); }
    }
  }, [settings.wakeLock, hasStarted]);

  useEffect(() => {
    if (settings.wakeLock && hasStarted) requestWakeLock();
    else if (wakeLockRef.current) wakeLockRef.current.release().then(() => { wakeLockRef.current = null; });
    const handleVisibilityChange = () => { if (wakeLockRef.current !== null && document.visibilityState === 'visible') requestWakeLock(); };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => { document.removeEventListener('visibilitychange', handleVisibilityChange); if (wakeLockRef.current) wakeLockRef.current.release(); };
  }, [settings.wakeLock, hasStarted, requestWakeLock]);

  useEffect(() => {
    setStorage('mode', mode); setStorage('theme', colorTheme); setStorage('settings', settings);
    setStorage('lyricsStyle', lyricsStyle); setStorage('showLyrics', showLyrics);
    setStorage('language', language); setStorage('region', region); setStorage('deviceId', selectedDeviceId);
  }, [mode, colorTheme, settings, lyricsStyle, showLyrics, language, region, selectedDeviceId, setStorage]);

  const handleOnboardingComplete = () => { localStorage.setItem(ONBOARDING_KEY, 'true'); setShowOnboarding(false); };

  const randomizeSettings = useCallback(() => {
    setColorTheme(COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)]);
    const modes = Object.values(VisualizerMode);
    setMode(modes[Math.floor(Math.random() * modes.length)]);
    setSettings(p => ({ ...p, speed: 0.8 + Math.random() * 0.8, sensitivity: 1.2 + Math.random() * 1.0, glow: Math.random() > 0.15, trails: Math.random() > 0.2, smoothing: 0.7 + Math.random() * 0.2 }));
  }, []);

  const resetSettings = useCallback(() => { clearStorage(); localStorage.removeItem(ONBOARDING_KEY); window.location.reload(); }, [clearStorage]);
  const resetVisualSettings = useCallback(() => {
    setMode(DEFAULT_MODE); setColorTheme(COLOR_THEMES[DEFAULT_THEME_INDEX]);
    setSettings(p => ({ ...p, speed: DEFAULT_SETTINGS.speed, sensitivity: DEFAULT_SETTINGS.sensitivity, glow: DEFAULT_SETTINGS.glow, trails: DEFAULT_SETTINGS.trails, autoRotate: DEFAULT_SETTINGS.autoRotate, cycleColors: DEFAULT_SETTINGS.cycleColors, smoothing: DEFAULT_SETTINGS.smoothing, hideCursor: DEFAULT_SETTINGS.hideCursor, quality: DEFAULT_SETTINGS.quality }));
  }, []);
  const resetTextSettings = useCallback(() => setSettings(p => ({ ...p, customText: DEFAULT_SETTINGS.customText, showCustomText: DEFAULT_SETTINGS.showCustomText, textPulse: DEFAULT_SETTINGS.textPulse, customTextRotation: DEFAULT_SETTINGS.customTextRotation, customTextSize: DEFAULT_SETTINGS.customTextSize, customTextFont: DEFAULT_SETTINGS.customTextFont, customTextOpacity: DEFAULT_SETTINGS.customTextOpacity, customTextColor: DEFAULT_SETTINGS.customTextColor, customTextPosition: DEFAULT_SETTINGS.customTextPosition })), []);
  const resetAudioSettings = useCallback(() => setSettings(p => ({ ...p, sensitivity: DEFAULT_SETTINGS.sensitivity, smoothing: DEFAULT_SETTINGS.smoothing, fftSize: DEFAULT_SETTINGS.fftSize })), []);
  const resetAiSettings = useCallback(() => {
    setShowLyrics(DEFAULT_SHOW_LYRICS); setLyricsStyle(DEFAULT_LYRICS_STYLE); setRegion(detectDefaultRegion());
    setSettings(p => ({ ...p, lyricsPosition: DEFAULT_SETTINGS.lyricsPosition, recognitionProvider: DEFAULT_SETTINGS.recognitionProvider }));
  }, []);

  useEffect(() => {
    let interval: number;
    if (isListening && mediaStream && showLyrics && !isSimulating) {
      performIdentification(mediaStream);
      interval = window.setInterval(() => performIdentification(mediaStream), 45000);
    }
    return () => clearInterval(interval);
  }, [isListening, mediaStream, showLyrics, performIdentification, isSimulating]);

  const contextValue: AppContextType = {
    mode, setMode, colorTheme, setColorTheme, settings, setSettings, lyricsStyle, setLyricsStyle, showLyrics, setShowLyrics,
    language, setLanguage, region, setRegion, selectedDeviceId, onDeviceChange: setSelectedDeviceId, isListening,
    isSimulating, isIdentifying, analyser, mediaStream, audioDevices, currentSong, setCurrentSong, errorMessage, setErrorMessage,
    toggleMicrophone, startDemoMode, performIdentification, randomizeSettings, resetSettings,
    resetVisualSettings, resetTextSettings, resetAudioSettings, resetAiSettings, t,
  };

  if (showOnboarding) return <OnboardingOverlay language={language} setLanguage={setLanguage} onComplete={handleOnboardingComplete} />;

  if (!hasStarted) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-fade-in-up">
          <h1 className="text-5xl font-black bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-4 text-transparent">{t?.welcomeTitle || "Aura Vision"}</h1>
          <p className="text-gray-400 text-sm">{t?.welcomeText || "Translate audio into generative art."}</p>
          <div className="flex flex-col gap-3">
             <button onClick={() => { setHasStarted(true); startMicrophone(selectedDeviceId); }} className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all">{t?.startExperience || "Start"}</button>
             <button onClick={() => { setHasStarted(true); startDemoMode(); }} className="px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-sm border border-white/10">{t?.errors?.tryDemo || "Try Demo Mode"}</button>
          </div>
          {errorMessage && <div className="p-3 bg-red-500/20 text-red-200 text-xs rounded-lg border border-red-500/30 leading-relaxed">{errorMessage}</div>}
        </div>
      </div>
    );
  }

  const isThreeMode = mode === VisualizerMode.SILK || mode === VisualizerMode.LIQUID || mode === VisualizerMode.TERRAIN;
  
  return (
    <AppContext.Provider value={contextValue}>
      <div className={`h-[100dvh] bg-black overflow-hidden relative ${settings.hideCursor ? 'cursor-none' : ''}`}>
        {errorMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-red-900/90 text-white px-6 py-4 rounded-xl border border-red-500/50 animate-fade-in-up flex flex-col sm:flex-row items-center gap-4 shadow-2xl max-w-[90vw]">
              <div className="flex-1 text-xs font-medium">{errorMessage}</div>
              <div className="flex items-center gap-3">
                 <button onClick={startDemoMode} className="whitespace-nowrap px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">{t?.errors?.tryDemo || "Demo Mode"}</button>
                 <button onClick={() => setErrorMessage(null)} className="p-2 hover:bg-white/10 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
          </div>
        )}
        {isSimulating && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[140] bg-blue-600/20 backdrop-blur-md border border-blue-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Demo Mode</span>
          </div>
        )}
        {isThreeMode ? <ThreeVisualizer analyser={analyser} mode={mode} colors={colorTheme} settings={settings} /> : <VisualizerCanvas analyser={analyser} mode={mode} colors={colorTheme} settings={settings} />}
        <CustomTextOverlay settings={settings} analyser={analyser} />
        <LyricsOverlay settings={settings} song={currentSong} showLyrics={showLyrics} lyricsStyle={lyricsStyle} analyser={analyser} />
        <SongOverlay song={currentSong} lyricsStyle={lyricsStyle} showLyrics={showLyrics} language={language} onRetry={() => mediaStream && performIdentification(mediaStream)} onClose={() => setCurrentSong(null)} analyser={analyser} sensitivity={settings.sensitivity} />
        <Controls />
      </div>
    </AppContext.Provider>
  );
};

export default App;