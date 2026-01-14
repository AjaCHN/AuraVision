
import React, { useState, useEffect, useRef } from 'react';
import { VisualizerMode, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice } from '../../types';
import { VISUALIZER_PRESETS, COLOR_THEMES } from '../../constants';
import { TRANSLATIONS } from '../../i18n';
import HelpModal from '../ui/HelpModal';
import { ActionButton, TooltipArea } from './ControlWidgets';

// Import newly extracted panels
import { VisualSettingsPanel } from './panels/VisualSettingsPanel';
import { AudioSettingsPanel } from './panels/AudioSettingsPanel';
import { AiSettingsPanel } from './panels/AiSettingsPanel';
import { SystemSettingsPanel } from './panels/SystemSettingsPanel';
import { CustomTextSettingsPanel } from './panels/CustomTextSettingsPanel';

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
  resetVisualSettings: () => void;
  resetTextSettings: () => void;
  resetAudioSettings: () => void;
  resetAiSettings: () => void;
  randomizeSettings: () => void;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
}

type TabType = 'visual' | 'text' | 'audio' | 'ai' | 'system';

const Controls: React.FC<ControlsProps> = ({
  currentMode, setMode, colorTheme, setColorTheme, toggleMicrophone,
  isListening, isIdentifying, lyricsStyle, setLyricsStyle, showLyrics, setShowLyrics,
  language, setLanguage, region, setRegion, settings, setSettings,
  resetSettings, resetVisualSettings, resetTextSettings, resetAudioSettings, resetAiSettings, 
  randomizeSettings, audioDevices, selectedDeviceId, onDeviceChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  const [showHelp, setShowHelp] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const t = TRANSLATIONS[language];

  // Sync function to bridge the gap between App.tsx separate states and Settings object
  const handleAiSettingsChange = (newSettings: VisualizerSettings) => {
      setSettings(newSettings);
      if (newSettings.lyricsStyle !== lyricsStyle) setLyricsStyle(newSettings.lyricsStyle as LyricsStyle);
      if (newSettings.region !== region) setRegion(newSettings.region as Region);
  };

  const aiPanelSettings = {
      ...settings,
      lyricsStyle,
      region
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleWake = () => setIsIdle(false);
    const handleSleep = () => setIsIdle(true);

    // Using window listeners to detect mouse leaving the viewport area
    window.addEventListener('mousemove', handleWake);
    window.addEventListener('mousedown', handleWake);
    window.addEventListener('keydown', handleWake);
    document.addEventListener('mouseenter', handleWake);
    document.addEventListener('mouseleave', handleSleep);

    return () => {
      window.removeEventListener('mousemove', handleWake);
      window.removeEventListener('mousedown', handleWake);
      window.removeEventListener('keydown', handleWake);
      document.removeEventListener('mouseenter', handleWake);
      document.removeEventListener('mouseleave', handleSleep);
    };
  }, []);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleMicrophone();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyR':
          randomizeSettings();
          break;
        case 'KeyL':
          setShowLyrics(!showLyrics);
          break;
        case 'KeyH':
          setIsExpanded(prev => !prev);
          break;
        case 'KeyG':
          setSettings({ ...settings, glow: !settings.glow });
          break;
        case 'KeyT':
          setSettings({ ...settings, trails: !settings.trails });
          break;
        case 'ArrowRight': {
          const modes = Object.keys(VISUALIZER_PRESETS) as VisualizerMode[];
          const currentIndex = modes.indexOf(currentMode);
          const nextIndex = (currentIndex + 1) % modes.length;
          setMode(modes[nextIndex]);
          break;
        }
        case 'ArrowLeft': {
          const modes = Object.keys(VISUALIZER_PRESETS) as VisualizerMode[];
          const currentIndex = modes.indexOf(currentMode);
          const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
          setMode(modes[prevIndex]);
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const currentIndex = COLOR_THEMES.findIndex(t => JSON.stringify(t) === JSON.stringify(colorTheme));
          const idx = currentIndex === -1 ? 0 : currentIndex;
          const nextIndex = (idx + 1) % COLOR_THEMES.length;
          setColorTheme(COLOR_THEMES[nextIndex]);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const currentIndex = COLOR_THEMES.findIndex(t => JSON.stringify(t) === JSON.stringify(colorTheme));
          const idx = currentIndex === -1 ? 0 : currentIndex;
          const prevIndex = (idx - 1 + COLOR_THEMES.length) % COLOR_THEMES.length;
          setColorTheme(COLOR_THEMES[prevIndex]);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentMode, colorTheme, settings, showLyrics, 
    toggleMicrophone, toggleFullscreen, randomizeSettings, 
    setMode, setColorTheme, setSettings, setShowLyrics, setIsExpanded
  ]);

  // Adjust font size for Chinese/Traditional Chinese
  const tabFontSize = (language === 'zh' || language === 'tw') ? 'text-xs' : 'text-[10px]';

  return (
    <>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} language={language} />

      {/* Only show "Identifying..." if the process is active AND the user has the feature enabled */}
      {isIdentifying && showLyrics && (
        <div className="fixed top-8 left-8 z-[110] bg-black/60 backdrop-blur-2xl border border-blue-500/30 rounded-full px-6 py-3.5 flex items-center gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-pulse">
           <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
           <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-100">{t.identifying}</span>
        </div>
      )}

      {!isExpanded && (
        <div className="fixed bottom-8 left-0 w-full z-[110] flex justify-center pointer-events-none px-4">
          <div 
            className={`flex items-center bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full p-2 pr-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:scale-105 transition-all duration-700 animate-fade-in-up pointer-events-auto ${isIdle ? 'opacity-[0.05] translate-y-3' : 'opacity-100 translate-y-0'}`}
          >
             {/* Main Mic Toggle Button */}
             <TooltipArea text={`${isListening ? t.stopMic : t.startMic} [Space]`}>
                <button 
                  onClick={toggleMicrophone} 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'bg-indigo-600/80 backdrop-blur-xl shadow-lg shadow-indigo-600/30 text-white' : 'bg-white/10 hover:bg-white/20 text-white/40 hover:text-white'}`}
                >
                    {isListening ? (
                      // Stop Icon (Square)
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M6 7.5A1.5 1.5 0 017.5 6h9A1.5 1.5 0 0118 7.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 16.5v-9z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      // Play/Mic Icon
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    )}
                </button>
             </TooltipArea>
             
             <div className="h-6 w-px bg-white/10 mx-3" />

             {/* Randomize Button (Style consistent with fullscreen) */}
             <TooltipArea text={`${t.randomize} [R]`}>
               <button 
                 onClick={randomizeSettings} 
                 className="text-white/40 hover:text-white transition-colors mr-4"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
               </button>
             </TooltipArea>

             {/* Fullscreen Button */}
             <TooltipArea text={`${t.hints.fullscreen} [F]`}>
               <button onClick={toggleFullscreen} className="text-white/40 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
               </button>
             </TooltipArea>

             {/* Expand Button */}
             <TooltipArea text={`${t.showOptions} [H]`}>
               <button onClick={() => setIsExpanded(true)} className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors flex items-center gap-2 pl-4">
                 <span>{t.showOptions}</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
               </button>
             </TooltipArea>
          </div>
        </div>
      )}

      {isExpanded && (
        <div 
          className={`fixed bottom-0 left-0 w-full z-[120] bg-[#050505] border-t border-white/10 transition-all duration-700 shadow-[0_-25px_100px_rgba(0,0,0,0.9)] opacity-100`}
        >
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-4 md:p-6">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-4">
                <div className="flex bg-white/[0.04] p-1 rounded-xl overflow-x-auto max-w-full scrollbar-hide gap-1 mask-fade-right">
                  {(['visual', 'text', 'audio', 'ai', 'system'] as TabType[]).map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)} 
                      className={`px-5 py-2.5 rounded-lg ${tabFontSize} font-bold uppercase tracking-[0.2em] transition-all duration-300 flex-shrink-0 ${activeTab === tab ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                      {t.tabs[tab]}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <ActionButton onClick={randomizeSettings} hintText={`${t.hints.randomize} [R]`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} />
                  <ActionButton onClick={toggleFullscreen} hintText={`${t.hints.fullscreen} [F]`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>} />
                  <ActionButton onClick={() => setShowHelp(true)} hintText={t.hints.help} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                  <button onClick={() => setIsExpanded(false)} className="w-12 h-10 flex items-center justify-center bg-blue-600 rounded-xl text-white shadow-[0_12px_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>

              <div className="bg-[#0f0f11] border border-white/5 rounded-2xl overflow-hidden shadow-inner min-h-[280px]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch">
                  {activeTab === 'visual' && (
                    <VisualSettingsPanel 
                      currentMode={currentMode}
                      setMode={setMode}
                      colorTheme={colorTheme}
                      setColorTheme={setColorTheme}
                      settings={settings}
                      setSettings={setSettings}
                      resetVisualSettings={resetVisualSettings}
                      t={t}
                    />
                  )}
                  {activeTab === 'text' && (
                    <CustomTextSettingsPanel
                      settings={settings}
                      setSettings={setSettings}
                      resetTextSettings={resetTextSettings}
                      t={t}
                    />
                  )}
                  {activeTab === 'audio' && (
                    <AudioSettingsPanel 
                      settings={settings}
                      setSettings={setSettings}
                      audioDevices={audioDevices}
                      selectedDeviceId={selectedDeviceId}
                      onDeviceChange={onDeviceChange}
                      toggleMicrophone={toggleMicrophone}
                      isListening={isListening}
                      resetAudioSettings={resetAudioSettings}
                      t={t}
                    />
                  )}
                  {activeTab === 'ai' && (
                    <AiSettingsPanel 
                      settings={aiPanelSettings}
                      setSettings={handleAiSettingsChange}
                      showLyrics={showLyrics}
                      setShowLyrics={setShowLyrics}
                      resetAiSettings={resetAiSettings}
                      t={t}
                    />
                  )}
                  {activeTab === 'system' && (
                    <SystemSettingsPanel 
                      language={language}
                      setLanguage={setLanguage}
                      resetSettings={resetSettings}
                      t={t}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Controls;
