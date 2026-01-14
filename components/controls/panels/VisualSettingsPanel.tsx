
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
      {/* Container 1: Modes & Quality */}
      <div id="container-visual-modes" className="flex flex-col p-4 h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        <span className="text-xs font-black uppercase text-white/50 tracking-[0.25em] block ml-1 mb-3 flex-shrink-0">{t.visualizerMode}</span>
        <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto custom-scrollbar p-1 pr-2 content-start">
           {Object.keys(VISUALIZER_PRESETS).map(m => (
             <button key={m} onClick={() => setMode(m as VisualizerMode)} className={`px-3 py-3 rounded-lg text-xs font-black uppercase tracking-widest border transition-all duration-300 ${currentMode === m ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
               {t.modes[m as VisualizerMode]}
             </button>
           ))}
        </div>

        {/* Quality Segmented Control moved to bottom of col 1 */}
        <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase text-white/40 tracking-wider w-12 flex-shrink-0">{t.quality}</span>
                <div className="flex-1 flex bg-white/[0.04] rounded-lg p-0.5 border border-white/5">
                {(['low', 'med', 'high'] as const).map(q => (
                    <button 
                    key={q} 
                    onClick={() => setSettings({...settings, quality: q})} 
                    className={`flex-1 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${settings.quality === q ? 'bg-white/20 text-white shadow-sm' : 'text-white/30 hover:text-white/70'}`}
                    >
                    {t.qualities[q]}
                    </button>
                ))}
                </div>
            </div>
        </div>
      </div>
      
      {/* Container 2: Themes & Audio Response Sliders */}
      <div id="container-visual-themes-sliders" className="flex flex-col p-4 h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        <span className="text-xs font-black uppercase text-white/50 tracking-[0.25em] block ml-1 mb-3 flex-shrink-0">{t.styleTheme}</span>
        <div className="flex flex-wrap gap-3 p-1 flex-1 overflow-y-auto custom-scrollbar content-start">
          {COLOR_THEMES.map((theme, i) => (
            <button key={i} onClick={() => setColorTheme(theme)} className={`w-9 h-9 rounded-full border-2 flex-shrink-0 transition-all duration-300 hover:scale-110 overflow-hidden ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'border-white/80 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} />
          ))}
        </div>
        
        {/* Sliders Group */}
        <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
          <Slider label={t.speed} hintText={t.hints.speed} value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v:any) => setSettings({...settings, speed: v})} />
          <Slider label={t.sensitivity} hintText={t.hints.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
        </div>
      </div>
      
      {/* Container 3: Toggles & Reset */}
      <div id="container-visual-toggles" className="flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar h-full">
        {/* Unified Toggles */}
        <div className="space-y-3 pt-2 flex-1 content-start">
            <div className="grid grid-cols-2 gap-2">
                <SettingsToggle 
                    label={t.glow} 
                    value={settings.glow} 
                    onChange={() => setSettings({...settings, glow: !settings.glow})} 
                    hintText={t.hints.glow}
                />
                <SettingsToggle 
                    label={t.trails} 
                    value={settings.trails} 
                    onChange={() => setSettings({...settings, trails: !settings.trails})} 
                    hintText={t.hints.trails}
                />
            </div>
            <SettingsToggle 
                label={t.hideCursor} 
                value={settings.hideCursor} 
                onChange={() => setSettings({...settings, hideCursor: !settings.hideCursor})} 
                hintText={t.hints.hideCursor}
            />
            <SettingsToggle 
                label={t.autoRotate} 
                value={settings.autoRotate} 
                onChange={() => setSettings({...settings, autoRotate: !settings.autoRotate})}
                hintText={t.hints.autoRotate}
            >
                <Slider 
                    label={t.rotateInterval} 
                    value={settings.rotateInterval} 
                    min={10} max={120} step={5} unit="s"
                    onChange={(v: number) => setSettings({...settings, rotateInterval: v})} 
                />
            </SettingsToggle>
            <SettingsToggle 
                label={t.cycleColors} 
                value={settings.cycleColors} 
                onChange={() => setSettings({...settings, cycleColors: !settings.cycleColors})}
                hintText={t.hints.cycleColors}
            >
                <Slider 
                    label={t.colorInterval} 
                    value={settings.colorInterval} 
                    min={5} max={60} step={5} unit="s"
                    onChange={(v: number) => setSettings({...settings, colorInterval: v})} 
                />
            </SettingsToggle>
        </div>

        <button onClick={resetVisualSettings} className="w-full py-3 mt-auto bg-white/[0.04] rounded-xl text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 border border-transparent hover:border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetVisual}
        </button>
      </div>
    </>
  );
};
