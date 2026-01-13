
import React from 'react';
import { VisualizerMode, VisualizerSettings } from '../../../types';
import { VISUALIZER_PRESETS, COLOR_THEMES } from '../../../constants';
import { SettingsToggle, Slider } from '../ControlWidgets';

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
      <div className="flex flex-col p-2 h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        <span className="text-[9px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1 mb-1 flex-shrink-0">{t.visualizerMode}</span>
        <div className="grid grid-cols-2 gap-1 flex-1 overflow-y-auto custom-scrollbar p-0 pr-1">
           {Object.keys(VISUALIZER_PRESETS).map(m => (
             <button key={m} onClick={() => setMode(m as VisualizerMode)} className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${currentMode === m ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
               {t.modes[m as VisualizerMode]}
             </button>
           ))}
        </div>
      </div>
      
      <div className="flex flex-col p-3 h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        <span className="text-[9px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1 mb-2 flex-shrink-0">{t.styleTheme}</span>
        <div className="flex flex-wrap gap-2 p-0 flex-1 overflow-y-auto custom-scrollbar content-start">
          {COLOR_THEMES.map((theme, i) => (
            <button key={i} onClick={() => setColorTheme(theme)} className={`w-8 h-8 rounded-full border-2 flex-shrink-0 transition-all duration-300 hover:scale-110 overflow-hidden ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'border-white/80 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} />
          ))}
        </div>
      </div>
      
      <div className="flex flex-col p-3 space-y-3 overflow-y-auto custom-scrollbar">
        {/* Sliders Group */}
        <div className="space-y-2 pb-2 border-b border-white/5">
          <Slider label={t.speed} hintText={t.hints.speed} value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
          <Slider label={t.sensitivity} hintText={t.hints.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
        </div>

        {/* Quality Segmented Control */}
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-white/40 tracking-wider w-10 flex-shrink-0">Quality</span>
            <div className="flex-1 flex bg-white/[0.04] rounded-lg p-0.5 border border-white/5">
            {(['low', 'med', 'high'] as const).map(q => (
                <button 
                key={q} 
                onClick={() => setSettings({...settings, quality: q})} 
                className={`flex-1 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all ${settings.quality === q ? 'bg-white/20 text-white shadow-sm' : 'text-white/30 hover:text-white/70'}`}
                >
                {q}
                </button>
            ))}
            </div>
        </div>

        {/* Unified Toggles */}
        <div className="space-y-1.5 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
                <SettingsToggle 
                    label={t.glow} 
                    statusText={settings.glow ? 'ON' : 'OFF'} 
                    value={settings.glow} 
                    onChange={() => setSettings({...settings, glow: !settings.glow})} 
                    hintText={t.hints.glow}
                />
                <SettingsToggle 
                    label={t.trails} 
                    statusText={settings.trails ? 'ON' : 'OFF'} 
                    value={settings.trails} 
                    onChange={() => setSettings({...settings, trails: !settings.trails})} 
                    hintText={t.hints.trails}
                />
            </div>
            <SettingsToggle 
                label={t.hideCursor} 
                statusText={settings.hideCursor ? 'HIDDEN' : 'VISIBLE'} 
                value={settings.hideCursor} 
                onChange={() => setSettings({...settings, hideCursor: !settings.hideCursor})} 
                hintText={t.hints.hideCursor}
            />
            <SettingsToggle 
                label={t.autoRotate} 
                statusText={settings.autoRotate ? 'ON' : 'OFF'} 
                value={settings.autoRotate} 
                onChange={() => setSettings({...settings, autoRotate: !settings.autoRotate})}
                hintText={t.hints.autoRotate}
            >
                <Slider 
                    label={t.rotateInterval} 
                    value={settings.rotateInterval ?? 30} 
                    min={10} max={120} step={5} unit="s"
                    onChange={(v: number) => setSettings({...settings, rotateInterval: v})} 
                />
            </SettingsToggle>
            <SettingsToggle 
                label={t.cycleColors} 
                statusText={settings.cycleColors ? 'ON' : 'OFF'} 
                value={settings.cycleColors} 
                onChange={() => setSettings({...settings, cycleColors: !settings.cycleColors})}
                hintText={t.hints.cycleColors}
            >
                <Slider 
                    label={t.colorInterval} 
                    value={settings.colorInterval ?? 45} 
                    min={5} max={60} step={5} unit="s"
                    onChange={(v: number) => setSettings({...settings, colorInterval: v})} 
                />
            </SettingsToggle>
        </div>

        <button onClick={resetVisualSettings} className="w-full py-2 mt-1 bg-white/[0.04] rounded-lg text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetVisual}
        </button>
      </div>
    </>
  );
};
