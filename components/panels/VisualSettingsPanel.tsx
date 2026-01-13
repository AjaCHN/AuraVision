
import React from 'react';
import { VisualizerMode, VisualizerSettings } from '../../types';
import { VISUALIZER_PRESETS, COLOR_THEMES } from '../../constants';
import { SettingsToggle, Slider, ControlPanelButton } from '../ControlWidgets';

interface VisualSettingsPanelProps {
  currentMode: VisualizerMode;
  setMode: (mode: VisualizerMode) => void;
  colorTheme: string[];
  setColorTheme: (theme: string[]) => void;
  settings: VisualizerSettings;
  setSettings: (settings: VisualizerSettings) => void;
  resetVisualSettings: () => void;
  t: any;
}

export const VisualSettingsPanel: React.FC<VisualSettingsPanelProps> = ({
  currentMode, setMode, colorTheme, setColorTheme, settings, setSettings, resetVisualSettings, t
}) => {
  return (
    <>
      <div className="flex flex-col p-5 h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
        <span className="text-xs font-black uppercase text-white/50 tracking-[0.25em] block ml-1 mb-4 flex-shrink-0">{t.visualizerMode}</span>
        <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto custom-scrollbar p-1 pr-2">
           {Object.keys(VISUALIZER_PRESETS).map(m => (
             <button key={m} onClick={() => setMode(m as VisualizerMode)} className={`px-4 py-4 rounded-xl text-[12px] font-black uppercase tracking-widest border transition-all duration-300 ${currentMode === m ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
               {t.modes[m as VisualizerMode]}
             </button>
           ))}
        </div>
      </div>
      
      <div className="flex flex-col p-5 h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
        <span className="text-xs font-black uppercase text-white/50 tracking-[0.25em] block ml-1 mb-4 flex-shrink-0">{t.styleTheme}</span>
        <div className="flex flex-wrap gap-4 p-2 flex-1 overflow-y-auto custom-scrollbar content-start">
          {COLOR_THEMES.map((theme, i) => (
            <button key={i} onClick={() => setColorTheme(theme)} className={`w-10 h-10 rounded-full border-2 flex-shrink-0 transition-all duration-300 hover:scale-110 overflow-hidden ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'border-white/80 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} />
          ))}
        </div>
      </div>
      
      <div className="flex flex-col p-5 space-y-4">
        {/* Sliders Group */}
        <div className="space-y-4 pb-4 border-b border-white/10">
          <Slider label={t.speed} hintText={t.hints.speed} value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
          <Slider label={t.sensitivity} hintText={t.hints.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
        </div>

        {/* Compact Toggles & Quality */}
        <div className="space-y-4 pb-4 border-b border-white/10">
           {/* Quality Segmented Control */}
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase text-white/40 tracking-wider w-12 flex-shrink-0">Quality</span>
             <div className="flex-1 flex bg-white/[0.04] rounded-lg p-1 border border-white/5">
               {(['low', 'med', 'high'] as const).map(q => (
                 <button 
                   key={q} 
                   onClick={() => setSettings({...settings, quality: q})} 
                   className={`flex-1 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider transition-all ${settings.quality === q ? 'bg-white/20 text-white shadow-sm' : 'text-white/30 hover:text-white/70'}`}
                 >
                   {q}
                 </button>
               ))}
             </div>
           </div>

           {/* 3-Column Compact Toggles */}
           <div className="grid grid-cols-3 gap-2">
             <button onClick={() => setSettings({...settings, glow: !settings.glow})} className={`py-3 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${settings.glow ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.04] border-transparent text-white/40 hover:bg-white/[0.08]'}`}>
               {t.glow}
             </button>
             <button onClick={() => setSettings({...settings, trails: !settings.trails})} className={`py-3 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${settings.trails ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.04] border-transparent text-white/40 hover:bg-white/[0.08]'}`}>
               {t.trails}
             </button>
             <button onClick={() => setSettings({...settings, hideCursor: !settings.hideCursor})} className={`py-3 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${settings.hideCursor ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/[0.04] border-transparent text-white/40 hover:bg-white/[0.08]'}`}>
               {t.hideCursor}
             </button>
           </div>
        </div>

        {/* Auto Rotate Controls (Simplified) */}
        <div className="space-y-3 pt-1">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">{t.autoRotate}</span>
              <div className="flex items-center gap-2">
                 <span className="text-[11px] font-mono text-white/30">{settings.rotateInterval}s</span>
                 <button 
                   onClick={() => setSettings({...settings, autoRotate: !settings.autoRotate})}
                   className={`w-8 h-4 rounded-full relative transition-all ${settings.autoRotate ? 'bg-blue-500' : 'bg-white/10'}`}
                 >
                   <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.autoRotate ? 'translate-x-4' : 'translate-x-0'}`} />
                 </button>
              </div>
           </div>

           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">{t.cycleColors}</span>
              <div className="flex items-center gap-2">
                 <span className="text-[11px] font-mono text-white/30">{settings.colorInterval}s</span>
                 <button 
                   onClick={() => setSettings({...settings, cycleColors: !settings.cycleColors})}
                   className={`w-8 h-4 rounded-full relative transition-all ${settings.cycleColors ? 'bg-blue-500' : 'bg-white/10'}`}
                 >
                   <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.cycleColors ? 'translate-x-4' : 'translate-x-0'}`} />
                 </button>
              </div>
           </div>

           <button onClick={resetVisualSettings} className="w-full py-3 mt-2 bg-white/[0.04] rounded-lg text-[12px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetVisual}
          </button>
        </div>
      </div>
    </>
  );
};
