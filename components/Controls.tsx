
import React, { useState, useEffect, useRef } from 'react';
import { VisualizerMode, LyricsStyle, Language, VisualizerSettings, Region, AudioDevice } from '../types';
import { VISUALIZER_PRESETS, COLOR_THEMES, REGION_NAMES, APP_VERSION } from '../constants';
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
  resetVisualSettings: () => void;
  randomizeSettings: () => void;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
}

type TabType = 'visual' | 'audio' | 'ai' | 'system';

// --- Custom Dropdown Component ---
const CustomSelect = ({ label, value, options, onChange }: { label: string, value: string, options: {value: string, label: string}[], onChange: (val: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="space-y-1.5 relative group" ref={dropdownRef}>
      <span className="text-[10px] font-bold uppercase text-white/30 tracking-[0.15em] block ml-1">{label}</span>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white/[0.03] border ${isOpen ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-white/10'} rounded-xl px-4 py-3 text-xs text-white hover:bg-white/[0.07] transition-all duration-300`}
      >
        <span className="truncate font-medium">{currentLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 text-white/40 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-3 z-50 bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-64 overflow-y-auto custom-scrollbar animate-fade-in-up py-2.5">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full px-4 py-3 text-left text-xs transition-all flex items-center justify-between ${value === opt.value ? 'bg-blue-500/10 text-blue-400' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              <span className={value === opt.value ? 'font-bold' : ''}>{opt.label}</span>
              {value === opt.value && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Controls: React.FC<ControlsProps> = ({
  currentMode, setMode, colorTheme, setColorTheme, toggleMicrophone,
  isListening, isIdentifying, lyricsStyle, setLyricsStyle, showLyrics, setShowLyrics,
  language, setLanguage, region, setRegion, settings, setSettings,
  resetSettings, resetVisualSettings, randomizeSettings, audioDevices, selectedDeviceId, onDeviceChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  const [showHelp, setShowHelp] = useState(false);
  const [hoveredHint, setHoveredHint] = useState<string>('');
  const t = TRANSLATIONS[language];

  const languages: {code: Language, label: string}[] = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '简体中文' },
    { code: 'ja', label: '日本語' },
    { code: 'es', label: 'Español' },
    { code: 'ko', label: '한국어' },
    { code: 'de', label: 'Deutsch' }
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const Slider = ({ label, value, min, max, step, onChange, icon, hintKey }: any) => (
    <div 
      className="space-y-2.5 group"
      onMouseEnter={() => setHoveredHint(t.hints[hintKey])}
      onMouseLeave={() => setHoveredHint('')}
    >
      <div className="flex justify-between items-end text-[10px] text-white/30 uppercase font-black tracking-widest">
        <span className="flex items-center gap-1.5 transition-colors group-hover:text-white/60">
          {icon} <span>{label}</span>
        </span>
        <span className="text-white/90 font-mono text-[11px] bg-white/5 px-1.5 py-0.5 rounded leading-none transition-colors group-hover:bg-blue-500/20 group-hover:text-blue-400">
          {value.toFixed(2)}
        </span>
      </div>
      <div className="relative h-4 flex items-center">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onPointerDown={(e) => e.stopPropagation()} 
          onChange={(e) => onChange(parseFloat(e.target.value))} 
          className="w-full h-1 bg-transparent cursor-pointer appearance-none relative z-10" 
        />
      </div>
    </div>
  );

  return (
    <>
      {/* AI Identification Indicator */}
      {isIdentifying && (
        <div className="fixed top-8 left-8 z-40 bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl animate-pulse">
           <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">{t.identifying}</span>
        </div>
      )}

      {/* Mini Bar */}
      {!isExpanded && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 pr-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-500 animate-fade-in-up">
           <button 
             onClick={isListening ? randomizeSettings : toggleMicrophone} 
             onMouseEnter={() => setHoveredHint(isListening ? t.hints.randomize : t.hints.mic)}
             onMouseLeave={() => setHoveredHint('')}
             className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 text-white' : 'bg-white/10 hover:bg-white/20 text-white/40'}`}
           >
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
           </button>
           <button onClick={() => setIsExpanded(true)} className="text-xs font-black uppercase tracking-[0.1em] text-white/60 hover:text-white transition-colors flex items-center gap-3 pl-2">
             <span>{t.showOptions}</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
           </button>
        </div>
      )}

      {/* Expanded Control Panel */}
      {isExpanded && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-[#060608]/85 backdrop-blur-[60px] border-t border-white/[0.08] pt-10 pb-10 px-8 animate-fade-in-up shadow-[0_-20px_80px_rgba(0,0,0,0.6)]">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header / Tab Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/[0.05] pb-8">
              <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
                {(['visual', 'audio', 'ai', 'system'] as TabType[]).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    onMouseEnter={() => setHoveredHint(t.hints[tab])}
                    onMouseLeave={() => setHoveredHint('')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-white/10 text-white shadow-[0_5px_15px_rgba(255,255,255,0.05)]' : 'text-white/20 hover:text-white/40'}`}
                  >
                    {t.tabs[tab]}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={randomizeSettings} 
                  onMouseEnter={() => setHoveredHint(t.hints.randomize)}
                  onMouseLeave={() => setHoveredHint('')}
                  className="w-12 h-12 flex items-center justify-center bg-white/[0.03] rounded-2xl text-white/30 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  onClick={toggleFullscreen} 
                  onMouseEnter={() => setHoveredHint(t.hints.fullscreen)}
                  onMouseLeave={() => setHoveredHint('')}
                  className="w-12 h-12 flex items-center justify-center bg-white/[0.03] rounded-2xl text-white/30 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent transition-all duration-300"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                   </svg>
                </button>
                <button 
                  onClick={() => setShowHelp(true)} 
                  onMouseEnter={() => setHoveredHint(t.hints.help)}
                  onMouseLeave={() => setHoveredHint('')}
                  className="w-12 h-12 flex items-center justify-center bg-white/[0.03] rounded-2xl text-white/30 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="w-14 h-12 flex items-center justify-center bg-blue-600 rounded-2xl text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 min-h-[220px]">
              
              {activeTab === 'visual' && (
                <>
                  {/* Mode Selection Block */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] block ml-1">{t.visualizerMode}</span>
                    <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-3">
                       {Object.keys(VISUALIZER_PRESETS).map(m => (
                         <button 
                           key={m} 
                           onClick={() => setMode(m as VisualizerMode)} 
                           onMouseEnter={() => setHoveredHint(t.hints.mode)}
                           onMouseLeave={() => setHoveredHint('')}
                           className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${currentMode === m ? 'bg-white/10 border-white/20 text-white shadow-inner' : 'bg-white/[0.02] border-white/[0.05] text-white/30 hover:text-white/50 hover:bg-white/[0.05]'}`}
                         >
                           {t.modes[m as VisualizerMode]}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Themes Block */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] block ml-1">{t.styleTheme}</span>
                    <div className="flex flex-wrap gap-2.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                      {COLOR_THEMES.map((theme, i) => (
                        <button 
                          key={i} 
                          onClick={() => setColorTheme(theme)} 
                          onMouseEnter={() => setHoveredHint(t.hints.theme)}
                          onMouseLeave={() => setHoveredHint('')}
                          className={`w-9 h-9 rounded-full border-2 flex-shrink-0 transition-all duration-300 hover:scale-110 ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-4 ring-white/10' : 'border-black/50'}`} 
                          style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Effects Block */}
                  <div className="space-y-6">
                    <Slider label={t.speed} hintKey="speed" value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
                    
                    <div className="grid grid-cols-2 gap-2.5">
                       <button 
                         onClick={() => setSettings({...settings, glow: !settings.glow})} 
                         onMouseEnter={() => setHoveredHint(t.hints.glow)}
                         onMouseLeave={() => setHoveredHint('')}
                         className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${settings.glow ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-inner' : 'bg-white/[0.03] border-white/[0.05] text-white/20'}`}
                       >
                         {t.glow}
                       </button>
                       <button 
                         onClick={() => setSettings({...settings, trails: !settings.trails})} 
                         onMouseEnter={() => setHoveredHint(t.hints.trails)}
                         onMouseLeave={() => setHoveredHint('')}
                         className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${settings.trails ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-inner' : 'bg-white/[0.03] border-white/[0.05] text-white/20'}`}
                       >
                         {t.trails}
                       </button>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/[0.05]">
                        <div 
                          className="flex items-center justify-between p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.05]"
                          onMouseEnter={() => setHoveredHint(t.hints.autoRotate)}
                          onMouseLeave={() => setHoveredHint('')}
                        >
                           <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{t.autoRotate}</span>
                           <button onClick={() => setSettings({...settings, autoRotate: !settings.autoRotate})} className={`w-11 h-6 rounded-full relative transition-all duration-500 ${settings.autoRotate ? 'bg-blue-600' : 'bg-white/10'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-500 ${settings.autoRotate ? 'left-6' : 'left-1'}`} />
                           </button>
                        </div>
                        <button 
                          onClick={resetVisualSettings} 
                          onMouseEnter={() => setHoveredHint(t.hints.resetVisual)}
                          onMouseLeave={() => setHoveredHint('')}
                          className="w-full py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          {t.resetVisual}
                        </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'audio' && (
                <>
                  <div className="space-y-6">
                    <CustomSelect 
                      label={t.audioInput}
                      value={selectedDeviceId}
                      options={[{ value: '', label: 'Default System Output' }, ...audioDevices.map(d => ({ value: d.deviceId, label: d.label }))]}
                      onChange={onDeviceChange}
                    />
                    <button 
                      onClick={toggleMicrophone} 
                      onMouseEnter={() => setHoveredHint(t.hints.mic)}
                      onMouseLeave={() => setHoveredHint('')}
                      className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${isListening ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'}`}
                    >
                      {isListening ? t.stopMic : t.startMic}
                    </button>
                  </div>
                  <div className="space-y-8">
                    <Slider label={t.sensitivity} hintKey="sensitivity" value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
                    <Slider label={t.smoothing} hintKey="smoothing" value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v:any) => setSettings({...settings, smoothing: v})} />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] block ml-1">{t.fftSize}</span>
                    <div className="grid grid-cols-2 gap-2.5">
                       {[512, 1024, 2048, 4096].map(size => (
                         <button 
                           key={size} 
                           onClick={() => setSettings({...settings, fftSize: size})} 
                           onMouseEnter={() => setHoveredHint(t.hints.fftSize)}
                           onMouseLeave={() => setHoveredHint('')}
                           className={`py-3 rounded-xl border text-[11px] font-mono transition-all duration-300 ${settings.fftSize === size ? 'bg-white/10 border-white/20 text-white shadow-inner' : 'bg-white/[0.02] border-white/[0.05] text-white/20 hover:text-white/40'}`}
                         >
                           {size}
                         </button>
                       ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'ai' && (
                <>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] block ml-1">{t.lyrics}</span>
                    <button 
                      onClick={() => setShowLyrics(!showLyrics)} 
                      onMouseEnter={() => setHoveredHint(t.hints.lyrics)}
                      onMouseLeave={() => setHoveredHint('')}
                      className={`w-full py-5 rounded-2xl border font-black text-xs uppercase tracking-[0.15em] transition-all duration-500 ${showLyrics ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-white/[0.02] border-white/[0.05] text-white/20 hover:bg-white/[0.05]'}`}
                    >
                      {showLyrics ? 'Recognition Active' : 'Enable AI Recognition'}
                    </button>
                  </div>
                  <div className="space-y-6">
                    <CustomSelect 
                      label={`${t.lyrics} ${t.styleTheme}`}
                      value={lyricsStyle}
                      options={Object.values(LyricsStyle).map(s => ({ value: s, label: t.lyricsStyles[s] }))}
                      onChange={(val) => setLyricsStyle(val as LyricsStyle)}
                    />
                  </div>
                  <div className="space-y-6">
                    <CustomSelect 
                      label={t.region}
                      value={region}
                      options={Object.entries(REGION_NAMES).map(([val, name]) => ({ value: val, label: name }))}
                      onChange={(val) => setRegion(val as Region)}
                    />
                  </div>
                </>
              )}

              {activeTab === 'system' && (
                <>
                  <div className="space-y-6">
                    <CustomSelect 
                      label={t.language}
                      value={language}
                      options={languages.map(l => ({ value: l.code, label: l.label }))}
                      onChange={(val) => setLanguage(val as Language)}
                    />
                    <button 
                      onClick={resetSettings} 
                      onMouseEnter={() => setHoveredHint(t.hints.reset)}
                      onMouseLeave={() => setHoveredHint('')}
                      className="w-full py-3.5 bg-red-500/5 border border-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                    >
                      {t.reset}
                    </button>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] block ml-1">{t.appInfo}</span>
                    <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl space-y-6 shadow-inner">
                       <p className="text-sm text-white/40 leading-relaxed font-medium">
                          {t.appDescription}
                       </p>
                       <div className="flex justify-between items-center pt-5 border-t border-white/[0.05]">
                          <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                             <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">{t.version}</span>
                          </div>
                          <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-400/10 px-2.5 py-1 rounded-lg border border-blue-400/20">{APP_VERSION}</span>
                       </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Global Hint Display */}
            <div className="pt-8 border-t border-white/[0.03] h-14 flex items-center justify-center relative">
               <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${hoveredHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400 text-center bg-blue-400/5 px-6 py-2 rounded-full border border-blue-400/10">
                    {hoveredHint}
                  </p>
               </div>
               <div className={`transition-all duration-700 ${hoveredHint ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
                  <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white/10 text-center">
                    SonicVision AI • Generative Spectral Analysis • Gemini 3
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} language={language} />
    </>
  );
};

export default Controls;
