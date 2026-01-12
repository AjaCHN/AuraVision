
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

const FloatingTooltip = ({ text, visible }: { text: string; visible: boolean }) => (
  <div 
    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg shadow-2xl whitespace-normal w-40 text-center pointer-events-none transition-all duration-300 z-[100] ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
  >
    {text}
    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-blue-600" />
  </div>
);

const CustomSelect = ({ label, value, options, onChange, hint }: { label: string, value: string, options: {value: string, label: string}[], onChange: (val: any) => void, hint?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    <div className="space-y-1.5 relative" ref={dropdownRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {hint && <FloatingTooltip text={hint} visible={isHovered && !isOpen} />}
      <span className="text-[10px] font-bold uppercase text-white/20 tracking-[0.15em] block ml-1">{label}</span>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white/[0.01] border ${isOpen ? 'border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-white/[0.05]'} rounded-xl px-4 py-3 text-xs text-white/70 hover:text-white hover:bg-white/[0.03] transition-all duration-300`}
      >
        <span className="truncate font-medium">{currentLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 text-white/20 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-3 z-50 bg-[#0a0a0c]/98 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-h-48 overflow-y-auto custom-scrollbar animate-fade-in-up py-2.5">
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

  const Slider = ({ label, value, min, max, step, onChange, icon, hintKey }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div className="space-y-2.5 relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <FloatingTooltip text={t.hints[hintKey]} visible={isHovered} />
        <div className="flex justify-between items-end text-[10px] text-white/10 uppercase font-black tracking-widest group-hover:text-white/40 transition-colors">
          <span className="flex items-center gap-1.5">
            {icon} <span>{label}</span>
          </span>
          <span className="text-white/60 font-mono text-[11px] bg-white/[0.02] px-1.5 py-0.5 rounded leading-none transition-colors group-hover:text-blue-400">
            {value.toFixed(2)}
          </span>
        </div>
        <div className="relative h-4 flex items-center">
          <input 
            type="range" min={min} max={max} step={step} value={value} 
            onPointerDown={(e) => e.stopPropagation()} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            className="w-full h-1 bg-transparent cursor-pointer appearance-none relative z-10" 
          />
        </div>
      </div>
    );
  };

  const ActionButton = ({ onClick, icon, hintKey, className = "" }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <FloatingTooltip text={t.hints[hintKey]} visible={isHovered} />
        <button onClick={onClick} className={`w-12 h-12 flex items-center justify-center bg-white/[0.02] rounded-2xl text-white/20 hover:text-white hover:bg-white/10 border border-transparent transition-all duration-300 ${className}`}>
          {icon}
        </button>
      </div>
    );
  };

  const ControlPanelButton = ({ onClick, label, active, hintKey }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div className="relative flex-1" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {hintKey && <FloatingTooltip text={t.hints[hintKey]} visible={isHovered} />}
        <button 
          onClick={onClick} 
          className={`w-full py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${active ? 'bg-white/10 border-white/20 text-white shadow-inner' : 'bg-white/[0.01] border-white/[0.05] text-white/20 hover:text-white/40'}`}
        >
          {label}
        </button>
      </div>
    );
  };

  return (
    <>
      {isIdentifying && (
        <div className="fixed top-8 left-8 z-40 bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl animate-pulse">
           <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">{t.identifying}</span>
        </div>
      )}

      {/* Mini Bar - 闲置时实现“半透明”效果 (15% 不透明度) */}
      {!isExpanded && (
        <div className="fixed bottom-8 left-0 w-full z-30 flex justify-center pointer-events-none px-4">
          <div 
            className={`flex items-center gap-2 bg-black/20 backdrop-blur-3xl border border-white/5 rounded-full p-1.5 pr-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:scale-105 transition-all duration-700 animate-fade-in-up pointer-events-auto ${isIdle ? 'opacity-[0.15] translate-y-2' : 'opacity-100 translate-y-0'}`}
          >
             <button 
               onClick={isListening ? randomizeSettings : toggleMicrophone} 
               className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'bg-indigo-600/80 hover:bg-indigo-600 shadow-lg shadow-indigo-600/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/20'}`}
             >
                {isListening ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                )}
             </button>
             <button onClick={() => setIsExpanded(true)} className="text-xs font-black uppercase tracking-[0.1em] text-white/40 hover:text-white transition-colors flex items-center gap-3 pl-2">
               <span>{t.showOptions}</span>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
             </button>
          </div>
        </div>
      )}

      {/* Expanded Control Panel - 始终维持 90% 不透明度，不再受闲置状态淡出影响 */}
      {isExpanded && (
        <div 
          className={`fixed bottom-0 left-0 w-full z-40 bg-[#060608]/90 backdrop-blur-[80px] border-t border-white/[0.04] transition-all duration-700 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] opacity-100`}
        >
          <div className="max-h-[85vh] overflow-y-auto custom-scrollbar pt-8 pb-10 px-8">
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/[0.04] pb-8">
                <div className="flex bg-white/[0.02] p-1.5 rounded-2xl border border-white/[0.04] overflow-x-auto max-w-full scrollbar-hide">
                  {(['visual', 'audio', 'ai', 'system'] as TabType[]).map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)} 
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${activeTab === tab ? 'bg-white/10 text-white shadow-[0_5px_15px_rgba(255,255,255,0.05)]' : 'text-white/20 hover:text-white/40'}`}
                    >
                      {t.tabs[tab]}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <ActionButton onClick={randomizeSettings} hintKey="randomize" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} />
                  <ActionButton onClick={toggleFullscreen} hintKey="fullscreen" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>} />
                  <ActionButton onClick={() => setShowHelp(true)} hintKey="help" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                  <button onClick={() => setIsExpanded(false)} className="w-14 h-12 flex items-center justify-center bg-blue-600/80 rounded-2xl text-white shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:bg-blue-600 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                {activeTab === 'visual' && (
                  <>
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase text-white/10 tracking-[0.2em] block ml-1">{t.visualizerMode}</span>
                      <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-3">
                         {Object.keys(VISUALIZER_PRESETS).map(m => (
                           <button key={m} onClick={() => setMode(m as VisualizerMode)} className={`px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all duration-300 ${currentMode === m ? 'bg-white/10 border-white/20 text-white shadow-inner' : 'bg-white/[0.01] border-white/[0.04] text-white/20 hover:text-white/50 hover:bg-white/[0.03]'}`}>
                             {t.modes[m as VisualizerMode]}
                           </button>
                         ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase text-white/10 tracking-[0.2em] block ml-1">{t.styleTheme}</span>
                      <div className="flex flex-wrap gap-2.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                        {COLOR_THEMES.map((theme, i) => (
                          <button key={i} onClick={() => setColorTheme(theme)} className={`w-9 h-9 rounded-full border-2 flex-shrink-0 transition-all duration-300 hover:scale-110 ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'border-white/60 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-black/50 opacity-40 hover:opacity-100'}`} style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <Slider label={t.speed} hintKey="speed" value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
                      <div className="flex gap-2.5">
                         <ControlPanelButton onClick={() => setSettings({...settings, glow: !settings.glow})} label={t.glow} active={settings.glow} hintKey="glow" />
                         <ControlPanelButton onClick={() => setSettings({...settings, trails: !settings.trails})} label={t.trails} active={settings.trails} hintKey="trails" />
                      </div>
                      <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                          <div className="flex items-center justify-between p-3.5 bg-white/[0.01] rounded-xl border border-white/[0.04] relative group">
                             <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">{t.autoRotate}</span>
                             <button onClick={() => setSettings({...settings, autoRotate: !settings.autoRotate})} className={`w-11 h-6 rounded-full relative transition-all duration-500 ${settings.autoRotate ? 'bg-blue-600/60' : 'bg-white/5'}`}>
                               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-500 ${settings.autoRotate ? 'left-6' : 'left-1'}`} />
                             </button>
                          </div>
                          <button onClick={resetVisualSettings} className="w-full py-3 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white/50 hover:bg-white/[0.03] transition-all duration-300 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            {t.resetVisual}
                          </button>
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'audio' && (
                  <>
                    <div className="space-y-6">
                      <CustomSelect label={t.audioInput} value={selectedDeviceId} hint={t.hints.device} options={[{ value: '', label: 'Default System Output' }, ...audioDevices.map(d => ({ value: d.deviceId, label: d.label }))]} onChange={onDeviceChange} />
                      <button onClick={toggleMicrophone} className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${isListening ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-600/80 text-white shadow-xl shadow-blue-600/10 hover:bg-blue-600'}`}>
                        {isListening ? t.stopMic : t.startMic}
                      </button>
                    </div>
                    <div className="space-y-8">
                      <Slider label={t.sensitivity} hintKey="sensitivity" value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
                      <Slider label={t.smoothing} hintKey="smoothing" value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v:any) => setSettings({...settings, smoothing: v})} />
                    </div>
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase text-white/10 tracking-[0.2em] block ml-1">{t.fftSize}</span>
                      <div className="grid grid-cols-2 gap-2.5">
                         {[512, 1024, 2048, 4096].map(size => (
                           <button key={size} onClick={() => setSettings({...settings, fftSize: size})} className={`py-3 rounded-xl border text-[11px] font-mono transition-all duration-300 ${settings.fftSize === size ? 'bg-white/10 border-white/20 text-white shadow-inner' : 'bg-white/[0.01] border-white/[0.04] text-white/20 hover:text-white/40'}`}>
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
                      <span className="text-[10px] font-black uppercase text-white/10 tracking-[0.2em] block ml-1">{t.lyrics}</span>
                      <button onClick={() => setShowLyrics(!showLyrics)} className={`w-full py-5 rounded-2xl border font-black text-xs uppercase tracking-[0.15em] transition-all duration-500 ${showLyrics ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.05)]' : 'bg-white/[0.01] border-white/[0.04] text-white/20 hover:bg-white/[0.03]'}`}>
                        {showLyrics ? 'Recognition Active' : 'Enable AI Recognition'}
                      </button>
                    </div>
                    <div className="space-y-6">
                      <CustomSelect label={`${t.lyrics} ${t.styleTheme}`} value={lyricsStyle} hint={t.hints.lyricsStyle} options={Object.values(LyricsStyle).map(s => ({ value: s, label: t.lyricsStyles[s] }))} onChange={(val) => setLyricsStyle(val as LyricsStyle)} />
                    </div>
                    <div className="space-y-6">
                      <CustomSelect label={t.region} value={region} hint={t.hints.region} options={Object.entries(REGION_NAMES).map(([val, name]) => ({ value: val, label: name }))} onChange={(val) => setRegion(val as Region)} />
                    </div>
                  </>
                )}
                {activeTab === 'system' && (
                  <>
                    <div className="space-y-6">
                      <CustomSelect label={t.language} value={language} options={languages.map(l => ({ value: l.code, label: l.label }))} onChange={(val) => setLanguage(val as Language)} />
                      <button onClick={resetSettings} className="w-full py-3.5 bg-red-500/[0.02] border border-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400/30 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300" title={t.reset}>
                        {t.reset}
                      </button>
                    </div>
                    <div className="space-y-4 md:col-span-2">
                      <span className="text-[10px] font-black uppercase text-white/10 tracking-[0.2em] block ml-1">{t.appInfo}</span>
                      <div className="bg-white/[0.01] border border-white/[0.04] p-6 rounded-2xl space-y-6 shadow-inner">
                         <p className="text-sm text-white/30 leading-relaxed font-medium">{t.appDescription}</p>
                         <div className="flex justify-between items-center pt-5 border-t border-white/[0.04]">
                            <div className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                               <span className="text-[10px] font-black uppercase text-white/10 tracking-widest">{t.version}</span>
                            </div>
                            <span className="text-[10px] font-mono text-blue-400/60 font-bold bg-blue-400/5 px-2.5 py-1 rounded-lg border border-blue-400/10">{APP_VERSION}</span>
                         </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-center opacity-[0.05]">
                 <p className="text-[8px] font-black tracking-[0.4em] uppercase text-white">SonicVision AI • Gemini 3</p>
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
