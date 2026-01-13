import React, { useState, useEffect, useRef, useCallback } from 'react';
import VisualizerCanvas from './components/VisualizerCanvas';
import ThreeVisualizer from './components/ThreeVisualizer';
import Controls, { SYSTEM_AUDIO_ID } from './components/Controls';
import SongOverlay from './components/SongOverlay';
import { VisualizerMode, SongInfo, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice } from './types';
import { COLOR_THEMES } from './constants';
import { identifySongFromAudio } from './services/geminiService';
import { TRANSLATIONS } from './translations';

const STORAGE_PREFIX = 'sv_v6_';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Ref to track the active audio context for robust cleanup
  const audioContextRef = useRef<AudioContext | null>(null);

  const getStorage = useCallback(<T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    const fullKey = STORAGE_PREFIX + key;
    const saved = localStorage.getItem(fullKey);
    if (saved !== null && saved !== 'undefined') {
      try {
        return JSON.parse(saved) as T;
      } catch (e) {
        console.warn(`Storage load failed for ${fullKey}:`, e);
        return fallback;
      }
    }
    return fallback;
  }, []);

  const detectDefaultRegion = (): Region => {
    const lang = navigator.language.toLowerCase();
    if (lang.includes('zh')) return 'CN';
    if (lang.includes('ja')) return 'JP';
    if (lang.includes('ko')) return 'KR';
    return 'global';
  };

  const [mode, setMode] = useState<VisualizerMode>(() => getStorage('mode', DEFAULT_MODE));
  const [colorTheme, setColorTheme] = useState<string[]>(() => getStorage('theme', COLOR_THEMES[DEFAULT_THEME_INDEX]));
  const [settings, setSettings] = useState<VisualizerSettings>(() => getStorage('settings', DEFAULT_SETTINGS));
  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(() => getStorage('lyricsStyle', DEFAULT_LYRICS_STYLE));
  const [showLyrics, setShowLyrics] = useState<boolean>(() => getStorage('showLyrics', DEFAULT_SHOW_LYRICS));
  const [language, setLanguage] = useState<Language>(() => getStorage('language', DEFAULT_LANGUAGE));
  const [region, setRegion] = useState<Region>(() => getStorage('region', detectDefaultRegion()));
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => getStorage('deviceId', ''));

  const [isIdentifying, setIsIdentifying] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);

  useEffect(() => {
    const data = { 
      mode, 
      theme: colorTheme, 
      settings, 
      lyricsStyle, 
      showLyrics, 
      language, 
      region, 
      deviceId: selectedDeviceId 
    };
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    });
  }, [mode, colorTheme, settings, lyricsStyle, showLyrics, language, region, selectedDeviceId]);

  useEffect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = settings.smoothing;
      if (analyser.fftSize !== settings.fftSize) {
        analyser.fftSize = settings.fftSize;
      }
    }
  }, [settings.smoothing, settings.fftSize, analyser]);

  const updateAudioDevices = useCallback(async () => {
    try {
      // Check if enumerateDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices
        .filter(d => d.kind === 'audioinput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 5)}` }));
      setAudioDevices(inputs);
    } catch (e) {
      console.warn("Device fetch warning:", e);
    }
  }, []);

  useEffect(() => {
    updateAudioDevices();
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', updateAudioDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', updateAudioDevices);
      };
    }
  }, [updateAudioDevices]);

  const randomizeSettings = useCallback(() => {
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    setColorTheme(randomTheme);
    const modes = Object.values(VisualizerMode);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    setMode(randomMode);
    setSettings(prev => ({
      ...prev,
      speed: 0.8 + Math.random() * 0.8,
      sensitivity: 1.2 + Math.random() * 1.0,
      glow: Math.random() > 0.15,
      trails: Math.random() > 0.2,
      smoothing: 0.7 + Math.random() * 0.2
    }));
  }, []);

  const resetAppSettings = useCallback(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
    });
    window.location.reload(); 
  }, []);

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

  const startMicrophone = useCallback(async (deviceId?: string) => {
    setErrorMessage(null);
    try {
      let stream: MediaStream;

      // 1. Clean up existing context before creating a new one
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (audioContext) {
        audioContext.close();
      }

      // 2. Acquire Stream
      if (deviceId === SYSTEM_AUDIO_ID) {
        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                console.warn("System audio sharing was cancelled by user.");
                setIsListening(false);
                return; // Exit gracefully without error message
            }
            throw err;
        }
        
        if (stream.getAudioTracks().length === 0) {
            stream.getTracks().forEach(t => t.stop());
            throw new Error("No audio track detected. Please check 'Share Audio' in the browser dialog.");
        }

        stream.getTracks()[0].onended = () => {
            setIsListening(false);
        };
      } else {
        try {
            const constraints: MediaStreamConstraints = { 
                audio: {
                  deviceId: deviceId ? { exact: deviceId } : undefined,
                  echoCancellation: false,
                  noiseSuppression: false,
                  autoGainControl: false
                }
            };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (e: any) {
             // Fallback: If specific device fails (e.g. unplugged), try default device
             if (deviceId && (e.name === 'OverconstrainedError' || e.name === 'NotFoundError' || e.name === 'NotReadableError')) {
                 console.warn(`Device ${deviceId} unavailable, falling back to default.`);
                 const fallbackConstraints = { 
                     audio: {
                       echoCancellation: false,
                       noiseSuppression: false,
                       autoGainControl: false
                     }
                 };
                 stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
                 // Don't update state here to avoid race condition loop
             } else {
                 throw e;
             }
        }
      }
      
      // 3. Create Audio Context
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ensure context is running (sometimes it starts suspended)
      if (context.state === 'suspended') {
        await context.resume();
      }

      const src = context.createMediaStreamSource(stream);
      const node = context.createAnalyser();
      node.fftSize = settings.fftSize;
      node.smoothingTimeConstant = settings.smoothing;
      src.connect(node);
      
      audioContextRef.current = context;
      setAudioContext(context);
      setAnalyser(node);
      setMediaStream(stream);
      setIsListening(true);

      // 4. Refresh devices list to get permission-gated labels
      updateAudioDevices();

    } catch (err: any) {
      // Graceful error handling
      const isPermissionError = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      
      if (isPermissionError) {
         console.warn("Microphone permission denied.");
      } else {
         console.error('Audio initialization error:', err);
      }
      
      setIsListening(false);
      
      let msg = "Could not access audio device.";
      if (isPermissionError) {
          msg = "Access denied. Please check your browser permissions for microphone.";
      } else if (err.name === 'NotFoundError') {
          msg = "No audio input device found.";
      } else if (err.name === 'NotReadableError') {
          msg = "Audio device is busy or invalid.";
      } else if (err.message) {
          msg = err.message;
      }
      setErrorMessage(msg);
    }
  }, [settings.fftSize, settings.smoothing, updateAudioDevices, audioContext]);

  const toggleMicrophone = useCallback(() => {
    if (isListening) {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAudioContext(null);
      setIsListening(false);
    } else {
      startMicrophone(selectedDeviceId);
    }
  }, [isListening, mediaStream, selectedDeviceId, startMicrophone]);

  // Restart microphone when device changes (only if already listening)
  useEffect(() => {
    if (isListening) {
      // Cleanup old stream
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      // Start new one
      startMicrophone(selectedDeviceId);
    }
    // Note: startMicrophone is intentionally excluded to prevent restart on settings change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

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
      interval = window.setInterval(() => performIdentification(mediaStream), 45000);
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
          <button onClick={() => { setHasStarted(true); startMicrophone(selectedDeviceId); }} className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all">{t.startExperience}</button>
          {errorMessage && (
             <div className="mt-4 p-3 bg-red-500/20 text-red-200 text-sm rounded-lg border border-red-500/30">
                 {errorMessage}
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black overflow-hidden relative ${settings.hideCursor ? 'cursor-none' : ''}`}>
      
      {/* Error Notification Toast */}
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 backdrop-blur-md max-w-md border border-red-500/50 animate-fade-in-up">
            <div className="p-2 bg-red-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="flex-1">
                <p className="font-bold text-sm text-red-100">Audio Error</p>
                <p className="text-xs text-red-200/80 leading-snug">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      )}

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