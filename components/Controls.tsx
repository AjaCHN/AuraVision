
import React, { useState, useEffect, useRef } from 'react';
import { VisualizerMode, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice } from '../types';
import { VISUALIZER_PRESETS, COLOR_THEMES, REGION_NAMES } from '../constants';
import { TRANSLATIONS } from '../translations';
import HelpModal from './HelpModal';

interface ControlsProps {
  currentMode: VisualizerMode;
  setMode: (mode: VisualizerMode) => void;
  colorTheme: string[];
  setColorTheme: (theme: string[]) => void;
  toggleMicrophone: () => void;
  isListening: boolean;
  isIdentifying: boolean;
  lyricsStyle: LyricsStyle;
  setLyricsStyle: (style: LyricsStyle) => void;
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  region: Region;
  setRegion: (region: Region) => void;
  settings: VisualizerSettings;
  setSettings: (settings: VisualizerSettings) => void;
  resetSettings: () => void;
  randomizeSettings: () => void;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
  currentMode,
  setMode,
  colorTheme,
  setColorTheme,
  toggleMicrophone,
  isListening,
  isIdentifying,
  lyricsStyle,
  setLyricsStyle,
  showLyrics,
  setShowLyrics,
  language,
  setLanguage,
  region,
  setRegion,
  settings,
  setSettings,
  resetSettings,
  randomizeSettings,
  audioDevices,
  selectedDeviceId,
  onDeviceChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Idle detection state
  const [isUserInactive, setIsUserInactive] = useState(false);
  const inactiveTimerRef = useRef<number>(0);

  const t = TRANSLATIONS[language];

  const updateSetting = <K extends keyof VisualizerSettings>(key: K, value: VisualizerSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  // Setup idle timer
  useEffect(() => {
    const resetTimer = () => {
      setIsUserInactive(false);
      if (inactiveTimerRef.current) clearTimeout(inactiveTimerRef.current);
      // Fade out after 3 seconds of inactivity
      inactiveTimerRef.current = window.setTimeout(() => {
        setIsUserInactive(true);
      }, 3000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('keydown', resetTimer);
    
    // Initialize
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (inactiveTimerRef.current) clearTimeout(inactiveTimerRef.current);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering if active element is an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case 'r':
          randomizeSettings();
          break;
        case ' ': // Spacebar
          e.preventDefault(); // Prevent scrolling
          toggleMicrophone();
          break;
        case 'l':
          setShowLyrics(!showLyrics);
          break;
        case 'f':
          if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => console.log(err));
          } else {
              document.exitFullscreen();
          }
          break;
        case 'h':
          setIsExpanded(prev => !prev);
          break;
        case 'g':
          updateSetting('glow', !settings.glow);
          break;
        case 't':
          updateSetting('trails', !settings.trails);
          break;
        case 'arrowright':
        case 'arrowleft': {
          const modes = Object.values(VisualizerMode);
          const currentIndex = modes.indexOf(currentMode);
          let nextIndex = key === 'arrowright' ? currentIndex + 1 : currentIndex - 1;
          
          if (nextIndex >= modes.length) nextIndex = 0;
          if (nextIndex < 0) nextIndex = modes.length - 1;
          
          setMode(modes[nextIndex]);
          break;
        }
        case 'arrowup':
        case 'arrowdown': {
           // Find current theme index based on value comparison (JSON stringify is safe for string arrays)
           const currentThemeStr = JSON.stringify(colorTheme);
           const themeIndex = COLOR_THEMES.findIndex(t => JSON.stringify(t) === currentThemeStr);
           
           let nextThemeIdx = key === 'arrowup' ? themeIndex + 1 : themeIndex - 1;
           if (nextThemeIdx >= COLOR_THEMES.length) nextThemeIdx = 0;
           if (nextThemeIdx < 0) nextThemeIdx = COLOR_THEMES.length - 1;
           
           setColorTheme(COLOR_THEMES[nextThemeIdx]);
           e.preventDefault(); // Prevent page scrolling
           break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    randomizeSettings, toggleMicrophone, showLyrics, settings, 
    currentMode, setMode, setShowLyrics, updateSetting, setIsExpanded, 
    colorTheme, setColorTheme
  ]);

  return (
    <>
      {/* Fixed Status Indicator - Top Left (Non-intrusive) */}
      <div className={`fixed top-8 left-8 z-40 transition-all duration-500 pointer-events-none ${isIdentifying ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
         <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-2xl">
            <div className="flex items-center gap-1 h-3">
               <div className="w-1 bg-blue-400 rounded-full h-full animate-[bounce_0.8s_infinite]"></div>
               <div className="w-1 bg-blue-400 rounded-full h-2/3 animate-[bounce_0.8s_infinite_0.1s]"></div>
               <div className="w-1 bg-blue-400 rounded-full h-full animate-[bounce_0.8s_infinite_0.2s]"></div>
               <div className="w-1 bg-blue-400 rounded-full h-1/2 animate-[bounce_0.8s_infinite_0.3s]"></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
               {t.identifying}
            </span>
         </div>
      </div>

      {/* Fixed Help Button - Top Right */}
      <button 
         onClick={() => setShowHelp(true)}
         title={t.helpTooltip}
         className="fixed top-6 right-6 z-40 bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white/60 hover:text-white rounded-full p-2 transition-all hover:scale-110 shadow-lg"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
      </button>

      {/* MINIMIZED VIEW */}
      {!isExpanded ? (
        <div className="fixed bottom-6 left-0 w-full z-30 flex justify-center items-center pointer-events-none">
          <div className={`pointer-events-auto flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-3 pr-4 shadow-2xl animate-fade-in-up transition-opacity duration-1000 ${isUserInactive ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
             
             {/* Randomize Button */}
             <button
                onClick={randomizeSettings}
                title={t.randomizeTooltip}
                className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                 </svg>
              </button>

              {isIdentifying && (
                <div className="flex items-center gap-1 animate-pulse">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                </div>
              )}

              <div className="h-6 w-px bg-white/20"></div>

              {/* Expand Button */}
              <button 
                onClick={() => setIsExpanded(true)}
                title={`${t.showOptions} (H)`}
                className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>{t.showOptions}</span>
              </button>
          </div>
        </div>
      ) : (
      /* EXPANDED VIEW */
      <div className="fixed bottom-0 left-0 w-full z-30 flex flex-col justify-end pointer-events-none">
        
        {/* Main Panel Container */}
        <div 
           className={`pointer-events-auto w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-6 px-4 md:px-8 backdrop-blur-sm transition-all duration-500 ease-out transform
           ${isUserInactive ? 'opacity-60 hover:opacity-100 translate-y-2 hover:translate-y-0' : 'opacity-100'}`}
        >
          
          {/* Header Row: Random, Reset, Hide */}
          <div className="flex justify-center items-center gap-2 md:gap-3 -mt-6 mb-2 flex-wrap">
             <button 
               onClick={randomizeSettings}
               title={t.randomizeTooltip}
               className="bg-indigo-500/80 hover:bg-indigo-600/90 backdrop-blur-md text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] rounded-full px-4 py-1 flex items-center gap-2 text-xs transition-all mb-2 font-medium"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
               </svg>
               <span>{t.randomize} (R)</span>
             </button>

             <button 
               onClick={resetSettings}
               title={t.resetTooltip}
               className="bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/60 hover:text-white rounded-full px-4 py-1 flex items-center gap-2 text-xs transition-all mb-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
               <span>{t.reset}</span>
             </button>

             <button 
               onClick={() => setIsExpanded(false)}
               title={`${t.hideOptions} (H)`}
               className="bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/60 hover:text-white rounded-full px-4 py-1 flex items-center gap-2 text-xs transition-all mb-2"
             >
               <span>{t.hideOptions}</span>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
             </button>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            {/* Top Section: Modes & Play Button */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
               
               {/* 1. Mic Button */}
               <div className="flex-shrink-0 flex flex-col items-center">
                  <button
                    onClick={toggleMicrophone}
                    title={`${isListening ? t.stopMic : t.startMic} (Space)`}
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border border-white/10
                      ${isListening 
                        ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-red-500/30' 
                        : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'}`}
                  >
                    {isListening ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    )}
                  </button>
                  <div className="text-center mt-2 text-[10px] uppercase tracking-wider font-bold text-white/40">
                     {isIdentifying ? (
                       <span className="text-blue-400 animate-pulse">{t.identifying}</span>
                     ) : (
                       <span>{t.listening}</span>
                     )}
                  </div>
               </div>

               {/* 2. Visualizer Modes (Wrapped) */}
               <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-2 px-1">
                     <h3 className="text-white/50 text-xs uppercase tracking-widest font-bold">{t.visualizerMode} (←/→)</h3>
                  </div>
                  {/* Container - Wrap */}
                  <div className="flex flex-wrap gap-2 pb-2">
                    {Object.entries(VISUALIZER_PRESETS).map(([modeKey, _]) => (
                      <button
                        key={modeKey}
                        onClick={() => setMode(modeKey as VisualizerMode)}
                        title={`${t.selectMode}: ${t.modes[modeKey as VisualizerMode]}`}
                        className={`px-3 py-2 rounded-xl border transition-all duration-300 text-xs font-medium whitespace-nowrap
                          ${currentMode === modeKey 
                            ? 'bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                      >
                        {t.modes[modeKey as VisualizerMode]}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Bottom Section: Settings & Theme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
               {/* Settings Card */}
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {/* Sliders */}
                      <div className="space-y-3">
                         {/* Audio Device Selector - NEW */}
                         <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-white/60 uppercase font-bold">
                              <span>{t.audioInput}</span>
                            </div>
                            <select
                                value={selectedDeviceId}
                                onChange={(e) => onDeviceChange(e.target.value)}
                                className="w-full bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2 py-1 outline-none focus:border-white/30 truncate"
                            >
                                {audioDevices.length === 0 && <option value="">Default Microphone</option>}
                                {audioDevices.map((device) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label}
                                    </option>
                                ))}
                            </select>
                         </div>

                         <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-white/60 uppercase font-bold">
                              <span>{t.sensitivity}</span> <span>{settings.sensitivity.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" min="0.5" max="3.0" step="0.1"
                                value={settings.sensitivity}
                                onChange={(e) => updateSetting('sensitivity', parseFloat(e.target.value))}
                                className="w-full accent-blue-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                             />
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-white/60 uppercase font-bold">
                              <span>{t.speed}</span> <span>{settings.speed.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" min="0.1" max="2.0" step="0.1"
                                value={settings.speed}
                                onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
                                className="w-full accent-purple-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                             />
                         </div>
                         {/* Auto Rotate Interval */}
                         {settings.autoRotate && (
                            <div className="space-y-1 animate-fade-in-up">
                                <div className="flex justify-between text-[10px] text-yellow-400/80 uppercase font-bold">
                                  <span>{t.rotateInterval}</span> <span>{settings.rotateInterval}s</span>
                                </div>
                                <input 
                                    type="range" min="10" max="120" step="5"
                                    value={settings.rotateInterval}
                                    onChange={(e) => updateSetting('rotateInterval', parseInt(e.target.value))}
                                    className="w-full accent-yellow-400 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                         )}
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-col justify-center gap-2">
                          <button 
                            onClick={() => updateSetting('glow', !settings.glow)}
                            title={`${t.toggleGlow} (G)`}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${settings.glow ? 'bg-blue-500/20 border-blue-500/50' : 'bg-black/20 border-white/10'}`}
                          >
                            <span className="text-xs text-white/80">{t.glow}</span>
                            <div className={`w-2 h-2 rounded-full ${settings.glow ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-white/20'}`} />
                          </button>

                          <button 
                            onClick={() => updateSetting('trails', !settings.trails)}
                            title={`${t.toggleTrails} (T)`}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${settings.trails ? 'bg-purple-500/20 border-purple-500/50' : 'bg-black/20 border-white/10'}`}
                          >
                            <span className="text-xs text-white/80">{t.trails}</span>
                            <div className={`w-2 h-2 rounded-full ${settings.trails ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-white/20'}`} />
                          </button>

                          <button 
                            onClick={() => updateSetting('autoRotate', !settings.autoRotate)}
                            title={t.toggleAutoRotate}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${settings.autoRotate ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-black/20 border-white/10'}`}
                          >
                            <span className="text-xs text-white/80">{t.autoRotate}</span>
                            <div className={`w-2 h-2 rounded-full ${settings.autoRotate ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-white/20'}`} />
                          </button>

                          <button 
                            onClick={() => updateSetting('hideCursor', !settings.hideCursor)}
                            title={t.toggleHideCursor}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${settings.hideCursor ? 'bg-teal-500/20 border-teal-500/50' : 'bg-black/20 border-white/10'}`}
                          >
                            <span className="text-xs text-white/80">{t.hideCursor}</span>
                            <div className={`w-2 h-2 rounded-full ${settings.hideCursor ? 'bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]' : 'bg-white/20'}`} />
                          </button>
                      </div>
                  </div>
               </div>

               {/* Style & Language Card */}
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
                   <div className="flex justify-between items-center">
                      <h3 className="text-white/50 text-xs uppercase tracking-widest font-bold">{t.styleTheme} (↑/↓)</h3>
                      <div className="flex flex-wrap gap-2">
                          {COLOR_THEMES.map((theme, idx) => (
                              <button
                                  key={idx}
                                  onClick={() => setColorTheme(theme)}
                                  title={t.changeTheme}
                                  className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-lg"
                                  style={{ background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }}
                              />
                          ))}
                      </div>
                   </div>

                   <div className="h-px bg-white/10 w-full"></div>

                   {/* Lyrics / Lang / Region Controls Row */}
                   <div className="flex flex-wrap items-center gap-2">
                       <select 
                          value={lyricsStyle}
                          onChange={(e) => setLyricsStyle(e.target.value as LyricsStyle)}
                          title={t.selectLyricsStyle}
                          className="w-[120px] bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2 py-2 outline-none focus:border-white/30 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                       >
                           {Object.values(LyricsStyle).map((style) => (
                               <option key={style} value={style} className="bg-gray-900 text-white py-1">
                                   {t.lyrics}: {t.lyricsStyles[style]}
                               </option>
                           ))}
                       </select>
                       
                       {/* Region Selector */}
                       <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value as Region)}
                          title={t.selectRegion}
                          className="bg-black/40 text-white text-xs border border-white/10 rounded-lg px-2 py-2 outline-none focus:border-white/30 appearance-none cursor-pointer hover:bg-white/5 transition-colors max-w-[90px]"
                       >
                          {Object.entries(REGION_NAMES).map(([key, name]) => (
                             <option key={key} value={key} className="bg-gray-900 text-white py-1">
                                 {t.regions[key as Region]}
                             </option>
                          ))}
                       </select>

                       <button 
                         onClick={() => setShowLyrics(!showLyrics)}
                         title={`${t.showLyrics} (L)`}
                         className={`h-[34px] w-[34px] rounded-lg border flex items-center justify-center transition-all flex-shrink-0 relative
                           ${showLyrics ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-black/40 border-white/20 text-white/40'}`}
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                         </svg>
                         {/* Tiny dot to indicate Beta Status if on */}
                         {showLyrics && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-sm"></span>}
                       </button>
                       
                       <button 
                          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                          title={t.toggleLanguage}
                          className="h-[34px] w-[34px] text-[10px] font-bold text-white/60 hover:text-white border border-white/20 rounded-lg bg-black/40 hover:bg-white/5 transition-colors flex-shrink-0"
                        >
                          {language === 'en' ? 'ZH' : 'EN'}
                        </button>
                   </div>
               </div>
            </div>

          </div>
        </div>
      </div>
      )}
      
      {/* Help Modal Integration */}
      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
        language={language}
      />
    </>
  );
};

export default Controls;
