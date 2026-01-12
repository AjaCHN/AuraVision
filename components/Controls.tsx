
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
  resetSettings, randomizeSettings, audioDevices, selectedDeviceId, onDeviceChange
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
      className="space-y-2 group"
      onMouseEnter={() => setHoveredHint(t.hints[hintKey])}
      onMouseLeave={() => setHoveredHint('')}
    >
      <div className="flex justify-between text-[10px] text-white/40 uppercase font-black tracking-widest">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span className="text-white/80 font-mono group-hover:text-blue-400 transition-colors">{value.toFixed(2)}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onPointerDown={(e) => e.stopPropagation()} 
          onChange={(e) => onChange(parseFloat(e.target.value))} 
          className="w-full h-1 bg-transparent cursor-pointer appearance-none relative z-10" 
          style={{ padding: '8px 0' }} 
        />
      </div>
    </div>
  );

  return (
    <>
      {/* AI 识别状态 */}
      {isIdentifying && (
        <div className="fixed top-8 left-8 z-40 bg-black/40 backdrop-blur-md border border-blue-500/20 rounded-full px-4 py-2 animate-pulse">
           <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">{t.identifying}</span>
        </div>
      )}

      {/* 迷你模式状态栏 */}
      {!isExpanded && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 pr-6 shadow-2xl animate-fade-in-up">
           <button 
             onClick={isListening ? randomizeSettings : toggleMicrophone} 
             onMouseEnter={() => setHoveredHint(isListening ? t.hints.randomize : t.hints.mic)}
             onMouseLeave={() => setHoveredHint('')}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 text-white' : 'bg-white/10 hover:bg-white/20 text-white/40'}`}
           >
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
           </button>
           <button onClick={() => setIsExpanded(true)} className="text-sm font-bold text-white/90 hover:text-white transition-colors flex items-center gap-2">
             <span>{t.showOptions}</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
           </button>
        </div>
      )}

      {/* 展开式控制面板 */}
      {isExpanded && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-black/75 backdrop-blur-3xl border-t border-white/10 pt-8 pb-8 px-8 animate-fade-in-up">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {(['visual', 'audio', 'ai', 'system'] as TabType[]).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    onMouseEnter={() => setHoveredHint(t.tabs[tab])}
                    onMouseLeave={() => setHoveredHint('')}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
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
                  className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  onClick={toggleFullscreen} 
                  onMouseEnter={() => setHoveredHint(t.hints.fullscreen)}
                  onMouseLeave={() => setHoveredHint('')}
                  className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                   </svg>
                </button>
                <button 
                  onClick={() => setShowHelp(true)} 
                  onMouseEnter={() => setHoveredHint(t.hints.help)}
                  onMouseLeave={() => setHoveredHint('')}
                  className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="p-3 bg-blue-500 rounded-xl text-white shadow-xl hover:scale-105 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[160px]">
              
              {activeTab === 'visual' && (
                <>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.visualizerMode}</span>
                    <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                       {Object.keys(VISUALIZER_PRESETS).map(m => (
                         <button 
                           key={m} 
                           onClick={() => setMode(m as VisualizerMode)} 
                           onMouseEnter={() => setHoveredHint(t.hints.mode)}
                           onMouseLeave={() => setHoveredHint('')}
                           className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${currentMode === m ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'}`}
                         >
                           {t.modes[m as VisualizerMode]}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.styleTheme}</span>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_THEMES.slice(0, 12).map((theme, i) => (
                        <button 
                          key={i} 
                          onClick={() => setColorTheme(theme)} 
                          onMouseEnter={() => setHoveredHint(t.hints.theme)}
                          onMouseLeave={() => setHoveredHint('')}
                          className={`w-8 h-8 rounded-full border-2 ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'border-white scale-110' : 'border-transparent'}`} 
                          style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Slider label={t.speed} hintKey="speed" value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setSettings({...settings, glow: !settings.glow})} 
                         onMouseEnter={() => setHoveredHint(t.hints.glow)}
                         onMouseLeave={() => setHoveredHint('')}
                         className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all ${settings.glow ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/5 text-white/30'}`}
                       >
                         {t.glow}
                       </button>
                       <button 
                         onClick={() => setSettings({...settings, trails: !settings.trails})} 
                         onMouseEnter={() => setHoveredHint(t.hints.trails)}
                         onMouseLeave={() => setHoveredHint('')}
                         className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all ${settings.trails ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/5 text-white/30'}`}
                       >
                         {t.trails}
                       </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <div 
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                          onMouseEnter={() => setHoveredHint(t.hints.autoRotate)}
                          onMouseLeave={() => setHoveredHint('')}
                        >
                           <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{t.autoRotate}</span>
                           <button onClick={() => setSettings({...settings, autoRotate: !settings.autoRotate})} className={`w-10 h-5 rounded-full relative transition-colors ${settings.autoRotate ? 'bg-green-500' : 'bg-white/10'}`}>
                             <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${settings.autoRotate ? 'left-5.5' : 'left-0.5'}`} />
                           </button>
                        </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'audio' && (
                <>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.audioInput}</span>
                    <select 
                      value={selectedDeviceId} 
                      onChange={(e) => onDeviceChange(e.target.value)} 
                      onMouseEnter={() => setHoveredHint(t.hints.device)}
                      onMouseLeave={() => setHoveredHint('')}
                      className="w-full bg-black/40 backdrop-blur-md text-xs border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                    >
                       {audioDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)}
                    </select>
                    <button 
                      onClick={toggleMicrophone} 
                      onMouseEnter={() => setHoveredHint(t.hints.mic)}
                      onMouseLeave={() => setHoveredHint('')}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {isListening ? t.stopMic : t.startMic}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <Slider label={t.sensitivity} hintKey="sensitivity" value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
                    <Slider label={t.smoothing} hintKey="smoothing" value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v:any) => setSettings({...settings, smoothing: v})} />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.fftSize}</span>
                    <div className="grid grid-cols-2 gap-2">
                       {[512, 1024, 2048, 4096].map(size => (
                         <button 
                           key={size} 
                           onClick={() => setSettings({...settings, fftSize: size})} 
                           onMouseEnter={() => setHoveredHint(t.hints.fftSize)}
                           onMouseLeave={() => setHoveredHint('')}
                           className={`py-2 rounded-xl border text-[10px] font-mono transition-all ${settings.fftSize === size ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/5 text-white/30 hover:text-white/50'}`}
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
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.lyrics}</span>
                    <button 
                      onClick={() => setShowLyrics(!showLyrics)} 
                      onMouseEnter={() => setHoveredHint(t.hints.lyrics)}
                      onMouseLeave={() => setHoveredHint('')}
                      className={`w-full py-4 rounded-xl border font-black transition-all ${showLyrics ? 'bg-green-500/20 border-green-500/40 text-green-300 shadow-lg' : 'bg-white/5 border-white/5 text-white/30'}`}
                    >
                      {t.showLyrics}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.lyrics + ' ' + t.styleTheme}</span>
                    <select 
                      value={lyricsStyle} 
                      onChange={(e) => setLyricsStyle(e.target.value as LyricsStyle)} 
                      onMouseEnter={() => setHoveredHint(t.hints.lyricsStyle)}
                      onMouseLeave={() => setHoveredHint('')}
                      className="w-full bg-black/40 backdrop-blur-md text-xs border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                    >
                       {Object.values(LyricsStyle).map(s => <option key={s} value={s}>{t.lyricsStyles[s]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.region}</span>
                    <select 
                      value={region} 
                      onChange={(e) => setRegion(e.target.value as Region)} 
                      onMouseEnter={() => setHoveredHint(t.hints.region)}
                      onMouseLeave={() => setHoveredHint('')}
                      className="w-full bg-black/40 backdrop-blur-md text-xs border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
                    >
                       {Object.entries(REGION_NAMES).map(([val, name]) => <option key={val} value={val}>{name}</option>)}
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'system' && (
                <>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.language}</span>
                    <select 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value as Language)} 
                      className="w-full bg-black/40 backdrop-blur-md text-xs border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                    >
                       {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                    </select>
                    <button 
                      onClick={resetSettings} 
                      onMouseEnter={() => setHoveredHint(t.hints.reset)}
                      onMouseLeave={() => setHoveredHint('')}
                      className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-xs text-white/40 hover:text-white/80 transition-all"
                    >
                      {t.reset}
                    </button>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block">{t.appInfo}</span>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                       <p className="text-sm text-white/70 leading-relaxed italic">
                          "{t.appDescription}"
                       </p>
                       <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{t.version}</span>
                          </div>
                          <span className="text-xs font-mono text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded-lg border border-blue-400/20">{APP_VERSION}</span>
                       </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* 优化后的工具提示区域 */}
            <div className="pt-6 border-t border-white/5 h-12 flex items-center justify-center overflow-hidden">
               <p className={`text-xs font-bold tracking-[0.2em] uppercase text-center transition-all duration-300 ${hoveredHint ? 'text-blue-400 opacity-100 -translate-y-1 scale-105' : 'text-white/20 opacity-40 translate-y-0'}`}>
                  {hoveredHint || 'SonicVision AI • Interactive Generative Audio'}
               </p>
            </div>
          </div>
        </div>
      )}

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} language={language} />
    </>
  );
};

export default Controls;
