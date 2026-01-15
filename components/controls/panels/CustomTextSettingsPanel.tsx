import React from 'react';
import { AVAILABLE_FONTS, getPositionOptions } from '../../../core/constants';
import { SettingsToggle, Slider, CustomSelect, PositionSelector } from '../ControlWidgets';
import { useAppContext } from '../../AppContext';
import { Position } from '../../../core/types';

export const CustomTextSettingsPanel: React.FC = () => {
  const { settings, setSettings, resetTextSettings, t } = useAppContext();
  
  const positionOptions = getPositionOptions(t);

  const handleTextPositionChange = (value: Position) => {
    setSettings({ ...settings, customTextPosition: value });
  };

  const colorPresets = [
    '#ffffff', '#00e5ff', '#00ff41', '#ff007f', '#ffcc00', '#ff9500', '#af52de',
    '#ffd700', '#c0c0c0', '#cd7f32', '#a0aec0', '#718096', '#4a5568', '#2d3748',
    '#feb2b2', '#faf089', '#9ae6b4', '#81e6d9', '#90cdf4', '#a3bffa', '#d6bcfa',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9f7e8', '#61a0af', '#96ceb4', '#ffeead'
  ];

  return (
    <>
      {/* Col 1: Content & Typography & Layout Sizing */}
      <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6 overflow-hidden">
        <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                   <span className="text-xs font-bold uppercase text-white/50 tracking-[0.15em] ml-1">{t?.customText || "Text Content"}</span>
                   <button 
                      onClick={() => setSettings({...settings, showCustomText: !settings.showCustomText})} 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${settings.showCustomText ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-white/20 hover:text-white/40'}`}
                      aria-label={t?.showText}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{settings.showCustomText ? (t?.common?.visible || 'ON') : (t?.common?.hidden || 'OFF')}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${settings.showCustomText ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-white/10'}`} />
                    </button>
                </div>
                <textarea 
                  value={settings.customText} 
                  onChange={(e) => setSettings({...settings, customText: e.target.value.toUpperCase()})} 
                  placeholder={t?.customTextPlaceholder || "ENTER TEXT"} 
                  rows={2} 
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white tracking-widest uppercase focus:outline-none focus:border-blue-500/50 transition-all resize-none min-h-[60px]" 
                />
            </div>
            <div className="space-y-5 pt-2">
              <CustomSelect label={t?.textFont || "Font Style"} value={settings.customTextFont || 'Inter, sans-serif'} options={AVAILABLE_FONTS} onChange={(val) => setSettings({...settings, customTextFont: val})} />
              <Slider label={t?.textSize || "Size"} value={settings.customTextSize ?? 12} min={2} max={60} step={1} onChange={(v: number) => setSettings({...settings, customTextSize: v})} />
              <Slider label={t?.textRotation || "Rotate"} value={settings.customTextRotation ?? 0} min={-180} max={180} step={5} onChange={(v: number) => setSettings({...settings, customTextRotation: v})} unit="°" />
            </div>
        </div>
      </div>

      {/* Col 2: Visual Style (Color & Opacity) */}
      <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6 overflow-hidden">
        <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-white/50 tracking-[0.15em] block ml-1">{t?.customColor || 'TEXT COLOR'}</span>
                <div className="flex flex-col gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex gap-2 items-center">
                        <div className="relative overflow-hidden w-8 h-8 rounded-full border border-white/20 shrink-0">
                            <input type="color" value={settings.customTextColor || '#ffffff'} onChange={(e) => setSettings({...settings, customTextColor: e.target.value})} className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0" />
                        </div>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{settings.customTextColor}</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 p-1">
                        {colorPresets.map(c => ( <button key={c} onClick={() => setSettings({...settings, customTextColor: c})} className={`aspect-square rounded-full transition-all duration-300 ${settings.customTextColor === c ? 'ring-2 ring-white/80 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'}`} style={{backgroundColor: c}} aria-label={`Color ${c}`} /> ))}
                    </div>
                </div>
            </div>
            <div className="pt-2 border-t border-white/5">
               <Slider label={t?.textOpacity || "Opacity"} value={settings.customTextOpacity ?? 1.0} min={0} max={1} step={0.05} onChange={(v: number) => setSettings({...settings, customTextOpacity: v})} />
            </div>
        </div>
      </div>

      {/* Col 3: Layout & Actions */}
      <div className="p-4 h-full flex flex-col pt-6">
         <div className="flex-grow">
            <PositionSelector label={t?.textPosition || "Text Position"} value={settings.customTextPosition} onChange={handleTextPositionChange} options={positionOptions} activeColor="blue" />
         </div>
         
         <div className="mt-auto pt-4">
            <button onClick={resetTextSettings} className="w-full py-3 bg-white/[0.04] rounded-xl text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2 border border-transparent hover:border-white/10 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               {t?.resetText || "Reset Text"}
            </button>
         </div>
      </div>
    </>
  );
};