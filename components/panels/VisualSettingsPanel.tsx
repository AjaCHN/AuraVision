
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
             <button key={m} onClick={() => setMode(m as VisualizerMode)} className={`px-4 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300 ${currentMode === m ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
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
      
      {/* Removed h-full and overflow-y-auto to allow content to dictate grid height */}
      <div className="flex flex-col p-5 space-y-5">
        <div className="space-y-6 pb-6 border-b border-white/10">
          <Slider label={t.speed} hintText={t.hints.speed} value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
          
          <div className="space-y-2">
             <span className="text-xs font-black uppercase text-white/50 tracking-[0.18em] block ml-1">Quality</span>
             <div className="flex gap-2">
               {(['low', 'med', 'high'] as const).map(q => (
                 <button 
                   key={q} 
                   onClick={() => setSettings({...settings, quality: q})} 
                   className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${settings.quality === q ? 'bg-white/20 border-white/40 text-white' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white'}`}
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

        <div className="space-y-6 pt-2">
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

          <SettingsToggle 
            label={t.cycleColors} 
            statusText={settings.cycleColors ? `${settings.colorInterval}s` : 'DISABLED'}
            value={settings.cycleColors}
            onChange={() => setSettings({...settings, cycleColors: !settings.cycleColors})}
            hintText={t.hints.cycleColors}
          >
            <Slider 
              label={t.colorInterval} 
              hintText={t.hints.colorInterval} 
              value={settings.colorInterval} 
              min={5} 
              max={120} 
              step={1} 
              unit="s"
              onChange={(v:any) => setSettings({...settings, colorInterval: v})} 
            />
          </SettingsToggle>

          <button onClick={resetVisualSettings} className="w-full py-4 bg-white/[0.04] rounded-xl text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetVisual}
          </button>
        </div>
      </div>
    </>
  );
};
