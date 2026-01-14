
import React from 'react';
import { AVAILABLE_FONTS } from '../../../core/constants';
import { SettingsToggle, Slider, CustomSelect, PositionSelector } from '../ControlWidgets';
import { useAppContext } from '../../App';
import { Position } from '../../../core/types';

export const CustomTextSettingsPanel: React.FC = () => {
  const { settings, setSettings, resetTextSettings, t } = useAppContext();
  const positions = t?.positions || {};
  
  const positionOptions = [
    { value: 'tl', label: positions?.tl || "Top Left" },
    { value: 'tc', label: positions?.tc || "Top Center" },
    { value: 'tr', label: positions?.tr || "Top Right" },
    { value: 'ml', label: positions?.ml || "Mid Left" },
    { value: 'mc', label: positions?.mc || "Center" },
    { value: 'mr', label: positions?.mr || "Mid Right" },
    { value: 'bl', label: positions?.bl || "Bottom Left" },
    { value: 'bc', label: positions?.bc || "Bottom Center" },
    { value: 'br', label: positions?.br || "Bottom Right" },
  ];

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
      {/* 第一列：文字内容与样式 */}
      <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
        <div className="space-y-3">
           <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t?.customText || "Text Content"}</span>
           <textarea 
            value={settings.customText} 
            onChange={(e) => setSettings({...settings, customText: e.target.value.toUpperCase()})} 
            placeholder={t?.customTextPlaceholder || "ENTER TEXT"} 
            rows={2} 
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white tracking-widest uppercase focus:outline-none focus:border-blue-500/50 transition-all resize-none custom-scrollbar" 
           />
           <CustomSelect label={t?.textFont || "Font Style"} value={settings.customTextFont || 'Inter, sans-serif'} options={AVAILABLE_FONTS} onChange={(val) => setSettings({...settings, customTextFont: val})} />
           <div className="grid grid-cols-2 gap-2">
               <SettingsToggle label={t?.showText || "Show Text"} value={settings.showCustomText} onChange={() => setSettings({...settings, showCustomText: !settings.showCustomText})} activeColor="blue" />
               <SettingsToggle label={t?.pulseBeat || "Pulse"} value={settings.textPulse} onChange={() => setSettings({...settings, textPulse: !settings.textPulse})} activeColor="blue" />
           </div>
        </div>
      </div>

      {/* 第二列：文字颜色 */}
      <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
         <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t?.customColor || 'TEXT COLOR'}</span>
            <div className="flex flex-col gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex gap-2 items-center">
                    <div className="relative overflow-hidden w-8 h-8 rounded-full border border-white/20 shrink-0">
                        <input 
                          type="color" 
                          value={settings.customTextColor || '#ffffff'} 
                          onChange={(e) => setSettings({...settings, customTextColor: e.target.value})} 
                          className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none p-0 m-0" 
                        />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{settings.customTextColor}</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 py-1">
                    {colorPresets.map(c => (
                        <button 
                          key={c} 
                          onClick={() => setSettings({...settings, customTextColor: c})} 
                          className={`w-6 h-6 rounded-full border transition-all ${settings.customTextColor === c ? 'border-white scale-125 z-10' : 'border-white/10 hover:scale-110'}`} 
                          style={{backgroundColor: c}}
                          aria-label={`Color ${c}`}
                        />
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* 第三列：排版与布局 + 重置按钮 */}
      <div className="p-4 h-full flex flex-col pt-6 space-y-5">
         <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.25em] block ml-1 -mb-2">{t?.textProperties || "Layout"}</span>
         <PositionSelector
            label=""
            value={settings.customTextPosition}
            onChange={handleTextPositionChange}
            options={positionOptions}
            activeColor="blue"
          />
         <Slider label={t?.textSize || "Size"} value={settings.customTextSize ?? 12} min={2} max={60} step={1} onChange={(v: number) => setSettings({...settings, customTextSize: v})} />
         <Slider label={t?.textRotation || "Rotate"} value={settings.customTextRotation ?? 0} min={-180} max={180} step={5} onChange={(v: number) => setSettings({...settings, customTextRotation: v})} unit="°" />
         <Slider label={t?.textOpacity || "Opacity"} value={settings.customTextOpacity ?? 1.0} min={0} max={1} step={0.05} onChange={(v: number) => setSettings({...settings, customTextOpacity: v})} />
         
         <div className="mt-auto pt-4">
            <button onClick={resetTextSettings} className="w-full py-2.5 bg-white/[0.04] rounded-lg text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {t?.resetText || "Reset Text"}
            </button>
         </div>
      </div>
    </>
  );
};
