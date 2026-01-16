
import React from 'react';
import { VisualizerMode } from '../../../core/types';
import { VISUALIZER_PRESETS, COLOR_THEMES, SMART_PRESETS } from '../../../core/constants';
import { SettingsToggle, Slider, CustomSelect } from '../ControlWidgets';
import { VisualizerPreview } from './VisualizerPreview';
import { useAppContext } from '../../AppContext';

export const VisualSettingsPanel: React.FC = () => {
  const { 
    mode: currentMode, setMode, 
    colorTheme, setColorTheme, 
    settings, setSettings, 
    resetVisualSettings, 
    applyPreset, 
    activePreset, setActivePreset,
    t 
  } = useAppContext();
  
  const hints = t?.hints || {};
  const modes = t?.modes || {};
  const qualities = t?.qualities || {};
  const presets = t?.presets || {};
  const visualPanel = t?.visualPanel || {};

  const handleVisualSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setActivePreset('');
  };

  return (
    <>
      {/* Col 1: Visual Modes Selection */}
      <div className="flex flex-col p-4 h-full border-b lg:border-b-0 lg:border-r border-white/5 pt-6 overflow-hidden">
        <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em] block ml-1 mb-3 flex-shrink-0">{t?.visualizerMode || "Visualizer Mode"}</span>
        <div className="grid grid-cols-2 gap-2 flex-grow overflow-y-auto custom-scrollbar p-1 pr-2 content-start">
           {Object.keys(VISUALIZER_PRESETS).map(m => (
             <VisualizerPreview
                key={m}
                mode={m as VisualizerMode}
                name={modes[m as VisualizerMode] || m}
                isActive={currentMode === m}
                onClick={() => setMode(m as VisualizerMode)}
              />
           ))}
        </div>
      </div>
      
      {/* Col 2: Themes, Smart Presets & Quality */}
      <div className="flex flex-col p-4 h-full border-b lg:border-b-0 lg:border-r border-white/5 pt-6 overflow-hidden">
        <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-2">
            <div className="mb-2">
              <CustomSelect 
                label={presets.title || 'Smart Presets'}
                value={activePreset}
                hintText={presets.hint || 'Apply a curated aesthetic'}
                options={[
                  { value: '', label: activePreset ? (presets.custom || 'Custom / Modified') : (presets.select || 'Select a mood...') },
                  ...Object.keys(SMART_PRESETS).map(key => ({
                    value: key,
                    label: presets[key] || SMART_PRESETS[key].nameKey,
                  }))
                ]}
                onChange={(val) => {
                  if (val && SMART_PRESETS[val]) {
                    applyPreset(SMART_PRESETS[val]);
                  } else {
                    setActivePreset('');
                  }
                }}
              />
            </div>

            <div>
                <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em] block ml-1 mb-2 flex-shrink-0">{t?.styleTheme || "Visual Theme"}</span>
                <div className="grid grid-cols-6 gap-2 p-1 content-start mb-2">
                  {COLOR_THEMES.map((theme, i) => (
                    <button key={i} onClick={() => setColorTheme(theme)} aria-label={`Theme ${i+1}`} className={`aspect-square rounded-full flex-shrink-0 transition-all duration-300 ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'ring-2 ring-white/80 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-60 hover:opacity-100'}`} style={{background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} />
                  ))}
                </div>
            </div>

            <div className="pt-2 border-t border-white/5">
               <div className="py-2">
                 <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs font-bold uppercase text-white/60 tracking-wider whitespace-nowrap">{t?.quality || "Quality"}</span>
                      <div className="flex w-full max-w-[200px] bg-white/[0.04] rounded-lg p-0.5">
                      {(['low', 'med', 'high'] as const).map(q => (
                          <button key={q} onClick={() => setSettings(prev => ({...prev, quality: q}))} aria-pressed={settings.quality === q} className={`flex-1 min-w-0 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${settings.quality === q ? 'bg-white/20 text-white' : 'text-white/30 hover:text-white/70'}`}>{qualities[q] || q}</button>
                      ))}
                      </div>
                 </div>
               </div>
            </div>
        </div>
      </div>
      
      {/* Col 3: Tuning & Automation */}
      <div className="flex flex-col p-4 h-full pt-6 overflow-hidden">
        <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-4">
            <Slider label={t?.speed || "Speed"} hintText={hints?.speed} value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v: number) => handleVisualSettingChange('speed', v)} />
            <Slider label={t?.sensitivity || "Sensitivity"} hintText={hints?.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v: number) => handleVisualSettingChange('sensitivity', v)} />
          </div>
          <div className="space-y-3 pt-3 border-t border-white/5">
              <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em] block ml-1 mb-2">{visualPanel.effects || "Effects"}</span>
              <div className="grid grid-cols-2 gap-2">
                  <SettingsToggle label={t?.glow || "Glow"} value={settings.glow} onChange={() => handleVisualSettingChange('glow', !settings.glow)} hintText={`${hints?.glow || "Glow"} [G]`} />
                  <SettingsToggle label={t?.trails || "Trails"} value={settings.trails} onChange={() => handleVisualSettingChange('trails', !settings.trails)} hintText={`${hints?.trails || "Trails"} [T]`} />
              </div>
          </div>
          <div className="space-y-2 pt-3 border-t border-white/5">
            <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em] block ml-1 mb-2">{visualPanel.automation || "Automation"}</span>
            <SettingsToggle label={t?.autoRotate || "Auto Rotate"} value={settings.autoRotate} onChange={() => handleVisualSettingChange('autoRotate', !settings.autoRotate)} hintText={hints?.autoRotate}>
                <div className="pt-1">
                    <Slider label={t?.rotateInterval || "Interval"} value={settings.rotateInterval} min={10} max={120} step={5} unit="s" onChange={(v: number) => handleVisualSettingChange('rotateInterval', v)} />
                </div>
            </SettingsToggle>
            <SettingsToggle label={t?.cycleColors || "Cycle Colors"} value={settings.cycleColors} onChange={() => handleVisualSettingChange('cycleColors', !settings.cycleColors)} hintText={hints?.cycleColors}>
                <div className="pt-1">
                    <Slider label={t?.colorInterval || "Interval"} value={settings.colorInterval} min={5} max={60} step={5} unit="s" onChange={(v: number) => handleVisualSettingChange('colorInterval', v)} />
                </div>
            </SettingsToggle>
          </div>
        </div>
        <div className="mt-auto pt-4">
          <button onClick={resetVisualSettings} className="w-full py-3 bg-white/[0.04] rounded-xl text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-all flex items-center justify-center gap-2 border border-transparent hover:border-white/10"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>{t?.resetVisual || "Reset Visuals"}</button>
        </div>
      </div>
    </>
  );
};
