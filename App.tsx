import React, { useState, useEffect, useRef } from 'react';
import VisualizerCanvas from './components/VisualizerCanvas';
import ThreeVisualizer from './components/ThreeVisualizer'; // New WebGL Component
import Controls from './components/Controls';
import SongOverlay from './components/SongOverlay';
import { VisualizerMode, SongInfo, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice } from './types';
import { COLOR_THEMES } from './constants';
import { identifySongFromAudio } from './services/geminiService';
import { TRANSLATIONS } from './translations';

// Default Constants
const DEFAULT_MODE = VisualizerMode.PLASMA; 
const DEFAULT_THEME_INDEX = 1; 
const DEFAULT_SETTINGS: VisualizerSettings = {
  sensitivity: 1.5,
  speed: 1.0,
  glow: true,
  trails: true,
  autoRotate: false,
  rotateInterval: 30
};
const DEFAULT_LYRICS_STYLE = LyricsStyle.KARAOKE; 
const DEFAULT_SHOW_LYRICS = true;
const DEFAULT_LANGUAGE: Language = 'zh';

const App: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  
  // Audio Input State
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Wake Lock Ref
  const wakeLockRef = useRef<any>(null);

  // Helper for localStorage
  const getStorage = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof fallback === 'object' && fallback !== null) {
            return { ...fallback, ...parsed };
        }
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
    if (lang.includes('es') || lang.includes('pt')) return 'LATAM';
    if (lang.includes('en-us')) return 'US';
    return 'global';
  };

  const [mode, setMode] = useState<VisualizerMode>(() => getStorage('sv_mode_v4', DEFAULT_MODE));
  const [colorTheme, setColorTheme] = useState<string[]>(() => getStorage('sv_theme', COLOR_THEMES[DEFAULT_THEME_INDEX]));
  const [settings, setSettings] = useState<VisualizerSettings>(() => getStorage('sv_settings_v2', DEFAULT_SETTINGS));
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);
  const [lyricsStyle, setLyricsStyle] = useState<LyricsStyle>(() => getStorage('sv_lyrics_style_v3', DEFAULT_LYRICS_STYLE));
  const [showLyrics, setShowLyrics] = useState<boolean>(() => getStorage('sv_show_lyrics', DEFAULT_SHOW_LYRICS));
  const [language, setLanguage] = useState<Language>(() => getStorage('sv_language', DEFAULT_LANGUAGE));
  const [region, setRegion] = useState<Region>(() => getStorage('sv_region', detectDefaultRegion()));

  const languageRef = useRef(language);
  const regionRef = useRef(region);

  useEffect(() => localStorage.setItem('sv_mode_v4', JSON.stringify(mode)), [mode]);
  useEffect(() => localStorage.setItem('sv_theme', JSON.stringify(colorTheme)), [colorTheme]);
  useEffect(() => localStorage.setItem('sv_settings_v2', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('sv_lyrics_style_v3', JSON.stringify(lyricsStyle)), [lyricsStyle]);
  useEffect(() => localStorage.setItem('sv_show_lyrics', JSON.stringify(showLyrics)), [showLyrics]);
  useEffect(() => localStorage.setItem('sv_language', JSON.stringify(language)), [language]);
  useEffect(() => localStorage.setItem('sv_region', JSON.stringify(region)), [region]);

  useEffect(() => {
    languageRef.current = language;
    regionRef.current = region;
  }, [language, region]);

  // Load Audio Devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Need to ask for permission first to get labels
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}...` }));
        
        setAudioDevices(inputs);
        // Default to first if none selected, or keep selection if exists
        if (!selectedDeviceId && inputs.length > 0) {
             // Try to find "default" or just take first
             const defaultDevice = inputs.find(d => d.deviceId === 'default') || inputs[0];
             setSelectedDeviceId(defaultDevice.deviceId);
        }
      } catch (e) {
        console.warn("Could not enumerate devices", e);
      }
    };
    getDevices();
  }, []);

  // Request Wake Lock
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (err) {
      console.log(`Wake Lock error: ${err}`);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.log(`Wake Lock release error: ${err}`);
      }
    }
  };

  // Auto Rotate Logic
  useEffect(() => {
    if (!settings.autoRotate) return;

    const intervalId = setInterval(() => {
        setMode((prevMode) => {
            const modes = Object.values(VisualizerMode);
            const availableModes = modes.filter(m => m !== prevMode);
            const nextMode = availableModes[Math.floor(Math.random() * availableModes.length)];
            return nextMode;
        });
    }, settings.rotateInterval * 1000);

    return () => clearInterval(intervalId);
  }, [settings.autoRotate, settings.rotateInterval]);

  // Auto Theme Switching Logic based on Mood
  useEffect(() => {
    if (!currentSong || !currentSong.mood) return;

    const mood = currentSong.mood.toLowerCase();
    
    // Theme 0: Sunset (Red/Orange) - Energetic, Warm
    if (mood.match(/energetic|upbeat|party|dance|rock|intense|warm|passionate|fire|活力|摇滚|激情|热烈|动感|summer/)) {
        setColorTheme(COLOR_THEMES[0]);
    }
    // Theme 1: Cyberpunk (Blue/Purple/Pink) - Electronic, Modern
    else if (mood.match(/electronic|synth|pop|modern|neon|club|future|cyber|电子|赛博|未来|流行|night/)) {
        setColorTheme(COLOR_THEMES[1]);
    }
    // Theme 2: Matrix (Green) - Tech, Dark, Edgy
    else if (mood.match(/techno|sci-fi|digital|aggressive|edgy|dark|glitch|industrial|黑暗|科技|工业|压抑/)) {
        setColorTheme(COLOR_THEMES[2]);
    }
    // Theme 3: Dark Slate (Grey/Blue) - Sad, Serious
    else if (mood.match(/sad|melanchol|ballad|slow|emotional|serious|gloomy|lonely|悲伤|忧郁|慢歌|抒情|沉重/)) {
        setColorTheme(COLOR_THEMES[3]);
    }
    // Theme 4: Ocean (Blue/Cyan) - Calm, Water
    else if (mood.match(/calm|relax|peace|chill|soothing|water|blue|jazz|soft|平静|放松|海洋|爵士|柔和/)) {
        setColorTheme(COLOR_THEMES[4]);
    }
    // Theme 5: Vaporwave (Pink/Purple) - Retro, Dreamy
    else if (mood.match(/retro|dreamy|lo-fi|nostalgic|aesthetic|vapor|复古|梦幻|怀旧|蒸汽波/)) {
        setColorTheme(COLOR_THEMES[5]);
    }
    // Theme 6: Golden Hour (Yellow) - Happy, Bright
    else if (mood.match(/happy|cheer|sunny|bright|joy|optimistic|acoustic|folk|快乐|阳光|民谣|欢快|明亮/)) {
        setColorTheme(COLOR_THEMES[6]);
    }
    // Theme 7: Aurora (Indigo/Purple) - Mystical, Space
    else if (mood.match(/mystical|ethereal|ambient|spiritual|trance|space|magic|神秘|空灵|氛围|宇宙/)) {
        setColorTheme(COLOR_THEMES[7]);
    }
    
  }, [currentSong]);

  const identificationTimeoutRef = useRef<number | null>(null);
  const silenceDurationRef = useRef<number>(0);
  const songChangeArmedRef = useRef<boolean>(false);

  // Initialize Audio Logic
  const startAudio = async (deviceId?: string) => {
    // Release any previous wake lock first
    releaseWakeLock();
    // Stop previous stream if any
    if (isListening) stopAudio();

    try {
      const constraints: MediaStreamConstraints = { 
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          channelCount: 2 
        } 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === 'suspended') await ctx.resume();

      const src = ctx.createMediaStreamSource(stream);
      const ana = ctx.createAnalyser();
      ana.fftSize = 2048;
      ana.smoothingTimeConstant = 0.85; 
      src.connect(ana);
      
      setAudioContext(ctx);
      setAnalyser(ana);
      setMediaStream(stream);
      setIsListening(true);
      
      setupRecorder(stream);
      requestWakeLock(); // Keep screen on!

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access audio device. Please check permissions.");
    }
  };

  const stopAudio = () => {
    if (audioContext) audioContext.close();
    if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    if (identificationTimeoutRef.current) clearTimeout(identificationTimeoutRef.current);
    
    setAudioContext(null);
    setAnalyser(null);
    setMediaStream(null);
    setRecorder(null);
    setIsListening(false);
    setIsIdentifying(false);
    
    releaseWakeLock();
    
    silenceDurationRef.current = 0;
    songChangeArmedRef.current = false;
  };

  // Change Device Handler
  const handleDeviceChange = (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      if (isListening) {
          // Restart with new device
          startAudio(deviceId);
      }
  };

  const setupRecorder = (stream: MediaStream) => {
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
      ? 'audio/webm;codecs=opus' 
      : 'audio/webm';

    const options: MediaRecorderOptions = { 
       mimeType,
       audioBitsPerSecond: 128000 
    };
      
    try {
      const rec = new MediaRecorder(stream, options);
      setRecorder(rec);
      scheduleIdentificationLoop(rec, 3000);
    } catch (e) {
      console.error("MediaRecorder init failed", e);
      const rec = new MediaRecorder(stream);
      setRecorder(rec);
      scheduleIdentificationLoop(rec, 3000);
    }
  };

  useEffect(() => {
    if (!analyser || !isListening) return;

    const interval = setInterval(() => {
      if (isIdentifying) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      const step = 10;
      for (let i = 0; i < bufferLength; i += step) {
          sum += dataArray[i];
      }
      const average = sum / (bufferLength / step);

      const SILENCE_THRESHOLD = 8;  
      const MUSIC_THRESHOLD = 20;   
      const GAP_DURATION_REQ = 2000; 

      if (average < SILENCE_THRESHOLD) {
          silenceDurationRef.current += 200; 
          if (silenceDurationRef.current >= GAP_DURATION_REQ) {
              songChangeArmedRef.current = true;
          }
      } else if (average > MUSIC_THRESHOLD) {
          if (songChangeArmedRef.current) {
              console.log("🎵 Gap detected followed by audio. Triggering Song ID...");
              songChangeArmedRef.current = false;
              if (identificationTimeoutRef.current) clearTimeout(identificationTimeoutRef.current);
              if (recorder && recorder.state !== 'recording') {
                  scheduleIdentificationLoop(recorder, 2000);
              }
          }
          silenceDurationRef.current = 0;
      }
    }, 200);

    return () => clearInterval(interval);
  }, [analyser, isListening, isIdentifying, recorder]);

  const scheduleIdentificationLoop = (rec: MediaRecorder, delay: number, isRetry: boolean = false) => {
    if (identificationTimeoutRef.current) clearTimeout(identificationTimeoutRef.current);

    identificationTimeoutRef.current = window.setTimeout(async () => {
      if (!rec.stream.active && rec.stream.getTracks().every(t => t.readyState === 'ended')) {
          return;
      }
      const duration = isRetry ? 12000 : 8000;
      
      try {
        const result = await recordAndIdentify(rec, duration);

        if (result && result.identified) {
           setCurrentSong(result);
           scheduleIdentificationLoop(rec, 60000, false); 
        } else if (result && !result.identified) {
           // Valid response but song unknown
           if (!isRetry) {
             scheduleIdentificationLoop(rec, 10000, true); // Retry once (10s delay to save quota)
           } else {
             scheduleIdentificationLoop(rec, 40000, false); // Then back off (40s)
           }
        } else {
           // Result is null -> Error (Network or Quota)
           // Do NOT retry quickly. Back off significantly.
           console.log("Identification failed (API Error), backing off...");
           scheduleIdentificationLoop(rec, 60000, false); 
        }
      } catch (e) {
        console.error("Identification loop error:", e);
        scheduleIdentificationLoop(rec, 60000, false); 
      }
    }, delay);
  };

  const recordAndIdentify = (rec: MediaRecorder, duration: number): Promise<SongInfo | null> => {
    return new Promise((resolve) => {
      if (rec.state !== 'inactive') {
         resolve(null);
         return;
      }

      setIsIdentifying(true);
      const chunks: BlobPart[] = [];
      
      const onDataAvailable = (e: BlobEvent) => {
         if (e.data.size > 0) chunks.push(e.data);
      };

      const onStop = async () => {
         rec.removeEventListener('dataavailable', onDataAvailable);
         rec.removeEventListener('stop', onStop);
         
         try {
           if (chunks.length === 0) {
             setIsIdentifying(false);
             resolve(null);
             return;
           }

           const mimeType = rec.mimeType || 'audio/webm';
           const blob = new Blob(chunks, { type: mimeType });
           
           if (blob.size < 2000) { 
              setIsIdentifying(false);
              resolve(null);
              return;
           }

           const reader = new FileReader();
           reader.onloadend = async () => {
              const resultStr = reader.result as string;
              if (!resultStr) {
                  setIsIdentifying(false);
                  resolve(null);
                  return;
              }
              const base64 = resultStr.split(',')[1];
              
              const result = await identifySongFromAudio(
                base64, 
                mimeType,
                languageRef.current,
                regionRef.current
              );
              setIsIdentifying(false);
              resolve(result);
           };
           reader.readAsDataURL(blob);
         } catch (err) {
           console.error("Processing recording failed", err);
           setIsIdentifying(false);
           resolve(null);
         }
      };

      rec.addEventListener('dataavailable', onDataAvailable);
      rec.addEventListener('stop', onStop);

      try {
        rec.start();
        setTimeout(() => {
            if (rec.state === 'recording') rec.stop();
        }, duration);
      } catch (err) {
        console.error("Recorder start failed", err);
        setIsIdentifying(false);
        resolve(null);
      }
    });
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopAudio();
    } else {
      startAudio(selectedDeviceId);
    }
  };

  const handleSongRetry = () => {
      setCurrentSong(null);
      if (identificationTimeoutRef.current) clearTimeout(identificationTimeoutRef.current);
      if (recorder && recorder.state !== 'recording') {
          console.log("Manual Retry Triggered");
          scheduleIdentificationLoop(recorder, 200, true);
      }
  };

  const resetSettings = () => {
    setMode(DEFAULT_MODE);
    setColorTheme(COLOR_THEMES[DEFAULT_THEME_INDEX]);
    setSettings(DEFAULT_SETTINGS);
    setLyricsStyle(DEFAULT_LYRICS_STYLE);
    setShowLyrics(DEFAULT_SHOW_LYRICS);
    setLanguage(DEFAULT_LANGUAGE);
    setRegion(detectDefaultRegion());
  };

  const randomizeSettings = () => {
    const modes = Object.values(VisualizerMode);
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    const styles = Object.values(LyricsStyle);
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    const newSettings: VisualizerSettings = {
       sensitivity: parseFloat((Math.random() * 1.5 + 1.0).toFixed(1)), 
       speed: parseFloat((Math.random() * 1.0 + 0.5).toFixed(1)),
       glow: Math.random() > 0.4, 
       trails: Math.random() > 0.3,
       autoRotate: false,
       rotateInterval: 30
    };

    setMode(randomMode);
    setColorTheme(randomTheme);
    setLyricsStyle(randomStyle);
    setSettings(newSettings);
    setShowLyrics(true); 
  };

  useEffect(() => {
    return () => {
      stopAudio();
      releaseWakeLock();
    };
  }, []);

  const t = TRANSLATIONS[language];

  // Determine which Renderer to use
  // Now includes all WebGL modes
  const isWebGLMode = [
    VisualizerMode.SILK,
    VisualizerMode.LIQUID,
    VisualizerMode.TERRAIN
  ].includes(mode);

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white select-none">
      
      {/* Background Visualizer - Switches between 2D and 3D */}
      {isWebGLMode ? (
         <ThreeVisualizer 
           analyser={analyser} 
           colors={colorTheme}
           settings={settings}
           mode={mode}
         />
      ) : (
         <VisualizerCanvas 
           analyser={analyser} 
           mode={mode} 
           colors={colorTheme}
           settings={settings}
           song={currentSong}
           showLyrics={showLyrics}
           lyricsStyle={lyricsStyle}
         />
      )}

      {/* Main Overlay Content */}
      <SongOverlay 
        song={currentSong} 
        lyricsStyle={lyricsStyle} 
        showLyrics={showLyrics}
        language={language}
        onRetry={handleSongRetry}
        onClose={() => setCurrentSong(null)}
      />

      {/* Start Prompt if not listening */}
      {!isListening && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
           <div className="text-center p-8 border border-white/10 rounded-2xl bg-black/40 shadow-2xl max-w-md mx-4">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                {t.welcomeTitle}
              </h1>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {t.welcomeText}
              </p>
              <button 
                onClick={() => startAudio(selectedDeviceId)}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {t.startExperience}
              </button>
           </div>
        </div>
      )}

      {/* UI Controls */}
      <Controls
        currentMode={mode}
        setMode={setMode}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        toggleMicrophone={toggleMicrophone}
        isListening={isListening}
        isIdentifying={isIdentifying}
        lyricsStyle={lyricsStyle}
        setLyricsStyle={setLyricsStyle}
        showLyrics={showLyrics}
        setShowLyrics={setShowLyrics}
        language={language}
        setLanguage={setLanguage}
        region={region}
        setRegion={setRegion}
        settings={settings}
        setSettings={setSettings}
        resetSettings={resetSettings}
        randomizeSettings={randomizeSettings}
        audioDevices={audioDevices}
        selectedDeviceId={selectedDeviceId}
        onDeviceChange={handleDeviceChange}
      />
    </div>
  );
};

export default App;