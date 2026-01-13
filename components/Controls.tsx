
import React, { useState, useEffect, useRef } from 'react';
import { VisualizerMode, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice } from '../types';
import { VISUALIZER_PRESETS, COLOR_THEMES, REGION_NAMES, APP_VERSION } from '../constants';
import { TRANSLATIONS } from '../translations';
import HelpModal from './HelpModal';
import { 
  TooltipArea, 
  CustomSelect, 
  SettingsToggle, 
  Slider, 
  ActionButton, 
  ControlPanelButton 
} from './ControlWidgets';

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
  randomizeSettings: () => void;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
}

type TabType = 'visual' | 'audio' | 'ai' | 'system';

const Controls: React.FC<ControlsProps> = ({
  currentMode, setMode, colorTheme, setColorTheme, toggleMicrophone,
  isListening, isIdentifying, lyricsStyle, setLyricsStyle, showLyrics, setShowLyrics,
  language, setLanguage, region, setRegion, settings, setSettings,
  resetSettings, resetVisualSettings, randomizeSettings, audioDevices, selectedDeviceId, onDeviceChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  const [showHelp, setShowHelp] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<number | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const handleActivity = () => {
      setIsIdle(false);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        setIsIdle(true);
      }, 3000);
    };
    const handleMouseLeave = () => setIsIdle(true);
    const handleMouseEnter = () => handleActivity();
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    handleActivity();
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} language={language} />

      {isIdentifying && (
        <div className="fixed top-8 left-8 z-40 bg-black/60 backdrop-blur-2xl border border-blue-500/30 rounded-full px-6 py-3.5 flex items-center gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-pulse">
           <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
           <span className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">{t.identifying}</span>
        </div>
      )}

      {!isExpanded && (
        <div className="fixed bottom-8 left-0 w-full z-30 flex justify-center pointer-events-none px-4">
          <div 
            className={`flex items-center gap-3 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full p-2 pr-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-700 animate-fade-in-up pointer-events-auto ${isIdle ? 'opacity-[0.25] translate-y-2' : 'opacity-100 translate-y-0'}`}
          >
             <button 
               onClick={isListening ? randomizeSettings : toggleMicrophone} 
               className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white' : 'bg-white/10 hover:bg-white/20 text-white/40 hover:text-white'}`}
             >
                {isListening ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                )}
             </button>
             <button onClick={() => setIsExpanded(true)} className="text-sm font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors flex items-center gap-4 pl-3">
               <span>{t.showOptions}</span>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
             </button>
          </div>
        </div>
      )}

      {isExpanded && (
        <div 
          className={`fixed bottom-0 left-0 w-full z-40 bg-[#08080a]/95 backdrop-blur-[100px] border-t border-white/10 transition-all duration-700 shadow-[0_-25px_100px_rgba(0,0,0,0.9)] opacity-100`}
        >
          <div className="max-h-[85vh] overflow-y-auto custom-scrollbar pt-10 pb-32 px-10">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-10">
                <div className="flex bg-white/[0.04] p-1 rounded-2xl overflow-x-auto max-w-full scrollbar-hide gap-1 mask-fade-right">
                  {(['visual', 'audio', 'ai', 'system'] as TabType[]).map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)} 
                      className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex-shrink-0 ${activeTab === tab ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                      {t.tabs[tab]}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <ActionButton onClick={randomizeSettings} hintText={t.hints.randomize} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} />
                  <ActionButton onClick={toggleFullscreen} hintText={t.hints.fullscreen} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>} />
                  <ActionButton onClick={() => setShowHelp(true)} hintText={t.hints.help} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                  <button onClick={() => setIsExpanded(false)} className="w-16 h-12 flex items-center justify-center bg-blue-600 rounded-2xl text-white shadow-[0_12px_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
                {activeTab === 'visual' && (
                  <>
                    <div className="flex flex-col bg-white/[0.04] rounded-[2rem] p-8 h-full space-y-6 shadow-2xl">
                      <span className="text-[11px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t.visualizerMode}</span>
                      <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto custom-scrollbar p-1">
                         {Object.keys(VISUALIZER_PRESETS).map(m => (
                           <button key={m} onClick={() => setMode(m as VisualizerMode)} className={`px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${currentMode === m ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
                             {t.modes[m as VisualizerMode]}
                           </button>
                         ))}
                      </div>
                    </div>
                    <div className="flex flex-col bg-white/[0.04] rounded-[2rem] p-8 h-full space-y-6 shadow-2xl">
                      <span className="text-[11px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t.styleTheme}</span>
                      <div className="flex flex-wrap gap-4 p-2 max-h-[260px] overflow-y-auto custom-scrollbar">
                        {COLOR_THEMES.map((theme, i) => (
                          <button key={i} onClick={() => setColorTheme(theme)} className={`w-10 h-10 rounded-full border-2 flex-shrink-0 transition-all duration-300 hover:scale-110 overflow-hidden ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'border-white/80 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col bg-white/[0.04] rounded-[2rem] p-8 h-full space-y-6 shadow-2xl">
                      <div className="space-y-6 pb-6 border-b border-white/10">
                        <Slider label={t.speed} hintText={t.hints.speed} value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
                        
                        <div className="space-y-2">
                           <span className="text-[11px] font-black uppercase text-white/50 tracking-[0.18em] block ml-1">Quality</span>
                           <div className="flex gap-2">
                             {(['low', 'med', 'high'] as const).map(q => (
                               <button 
                                 key={q} 
                                 onClick={() => setSettings({...settings, quality: q})} 
                                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${settings.quality === q ? 'bg-white/20 border-white/40 text-white' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white'}`}
                               >
                                 {q}
                               </button>
                             ))}
                           </div>
                        </div>

                        <div className="flex gap-3">
                           <ControlPanelButton onClick={() => setSettings({...settings, glow: !settings.glow})} label={t.glow} active={settings.glow} hintText={t.hints.glow} />
                           <ControlPanelButton onClick={() => setSettings({...settings, trails: !settings.trails})} label={t.trails} active={settings.trails} hintText={t.hints.trails} />
                        </div>
                        <div className="flex gap-3">
                           <ControlPanelButton onClick={() => setSettings({...settings, hideCursor: !settings.hideCursor})} label={t.hideCursor} active={settings.hideCursor} />
                        </div>
                      </div>

                      <div className="space-y-6 pt-4">
                        <SettingsToggle 
                          label={t.autoRotate} 
                          statusText={settings.autoRotate ? `${settings.rotateInterval}s` : 'DISABLED'}
                          value={settings.autoRotate}
                          onChange={() => setSettings({...settings, autoRotate: !settings.autoRotate})}
                          hintText={t.hints.autoRotate}
                        >
                          <Slider 
                            label={t.rotateInterval} 
                            hintText={t.hints.rotateInterval} 
                            value={settings.rotateInterval} 
                            min={5} 
                            max={120} 
                            step={1} 
                            unit="s"
                            onChange={(v:any) => setSettings({...settings, rotateInterval: v})} 
                          />
                        </SettingsToggle>

                        <button onClick={resetVisualSettings} className="w-full py-4 bg-white/[0.04] rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          {t.resetVisual}
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'audio' && (
                  <>
                    <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-8 shadow-2xl">
                      <CustomSelect 
                        label={t.audioInput} 
                        value={selectedDeviceId} 
                        hintText={t.hints.device} 
                        options={[
                          { value: '', label: t.defaultMic }, 
                          ...audioDevices.map(d => ({ value: d.deviceId, label: d.label }))
                        ]} 
                        onChange={onDeviceChange} 
                      />
                      <button onClick={toggleMicrophone} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${isListening ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.02]'}`}>
                        {isListening ? t.stopMic : t.startMic}
                      </button>
                      
                      <SettingsToggle 
                          label={t.monitorAudio} 
                          statusText={settings.monitor ? 'ACTIVE' : 'MUTED'}
                          value={settings.monitor}
                          onChange={() => setSettings({...settings, monitor: !settings.monitor})}
                          hintText={t.hints.monitor}
                          activeColor="red"
                      />
                    </div>
                    <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-10 shadow-2xl">
                      <Slider label={t.sensitivity} hintText={t.hints.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
                      <Slider label={t.smoothing} hintText={t.hints.smoothing} value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v:any) => setSettings({...settings, smoothing: v})} />
                      
                    </div>
                    <TooltipArea text={t.hints.fftSize}>
                      <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-6 shadow-2xl">
                        <span className="text-[11px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t.fftSize}</span>
                        <div className="grid grid-cols-2 gap-3">
                          {[512, 1024, 2048, 4096].map(size => (
                            <button key={size} onClick={() => setSettings({...settings, fftSize: size})} className={`py-4 rounded-xl border text-[13px] font-mono font-bold transition-all duration-300 ${settings.fftSize === size ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </TooltipArea>
                  </>
                )}
                {activeTab === 'ai' && (
                  <>
                    <TooltipArea text={t.hints.lyrics}>
                      <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-6 shadow-2xl">
                        <span className="text-[11px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t.lyrics}</span>
                        <button onClick={() => setShowLyrics(!showLyrics)} className={`w-full py-6 rounded-3xl border font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 ${showLyrics ? 'bg-green-500/20 border-green-500/40 text-green-300 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:bg-white/[0.08] hover:text-white'}`}>
                          {showLyrics ? t.aiState.active : t.aiState.enable}
                        </button>
                      </div>
                    </TooltipArea>
                    <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-8 shadow-2xl">
                      <CustomSelect 
                        label={`${t.lyrics} ${t.styleTheme}`} 
                        value={lyricsStyle} 
                        hintText={t.hints.lyricsStyle} 
                        options={Object.values(LyricsStyle).map(s => ({ value: s, label: t.lyricsStyles[s] }))} 
                        onChange={(val) => setLyricsStyle(val as LyricsStyle)} 
                      />
                    </div>
                    <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-8 shadow-2xl">
                       <CustomSelect 
                         label={t.region} 
                         value={region} 
                         hintText={t.hints.region} 
                         options={Object.keys(REGION_NAMES).map(r => ({ value: r, label: t.regions[r] }))} 
                         onChange={(val) => setRegion(val as Region)} 
                       />
                    </div>
                  </>
                )}
                {activeTab === 'system' && (
                  <>
                    <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-8 shadow-2xl">
                      <CustomSelect 
                        label={t.language} 
                        value={language} 
                        hintText={t.hints.language} 
                        options={[
                           { value: 'en', label: 'English' },
                           { value: 'zh', label: '简体中文 (Simplified Chinese)' },
                           { value: 'tw', label: '繁體中文 (Traditional Chinese)' },
                           { value: 'ja', label: '日本語 (Japanese)' },
                           { value: 'es', label: 'Español (Spanish)' },
                           { value: 'ko', label: '한국어 (Korean)' },
                           { value: 'de', label: 'Deutsch (German)' },
                           { value: 'fr', label: 'Français (French)' }
                        ]} 
                        onChange={(val) => setLanguage(val as Language)} 
                      />
                    </div>
                    <div className="bg-white/[0.04] rounded-[2rem] p-8 space-y-6 shadow-2xl flex flex-col justify-center">
                        <button onClick={resetSettings} className="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all">
                        {t.reset}
                        </button>
                         <div className="text-center">
                            <span className="text-[10px] text-white/20 font-mono">v{APP_VERSION}</span>
                        </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Controls;