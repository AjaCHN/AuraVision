
import React from 'react';
import { VisualizerSettings } from '../../../types';
import { AVAILABLE_FONTS } from '../../../constants';
import { SettingsToggle, Slider, CustomSelect } from '../ControlWidgets';

interface CustomTextSettingsPanelProps {
  settings: VisualizerSettings;
  setSettings: (settings: VisualizerSettings) => void;
  resetTextSettings: () => void;
  t: any;
}

export const CustomTextSettingsPanel: React.FC<CustomTextSettingsPanelProps> = ({
  settings, setSettings, resetTextSettings, t
}) => {
  return (
    <>
      <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
        <div className="space-y-3">
           <span className="text-[10px] font-bold uppercase text-white/50 tracking-[0.25em] block ml-1">{t.customText}</span>
           
           {/* Text Area */}
           <textarea 
             value={settings.customText}
             onChange={(e) => setSettings({...settings, customText: e.target.value.toUpperCase()})}
             placeholder={t.customTextPlaceholder}
             rows={2}
             className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white tracking-widest uppercase focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all resize-none custom-scrollbar"
           />

           {/* Font Selector */}
           <CustomSelect 
             label={t.textFont}
             value={settings.customTextFont || 'Inter, sans-serif'}
             options={AVAILABLE_FONTS}
             onChange={(val) => setSettings({...settings, customTextFont: val})}
           />

           <div className="grid grid-cols-2 gap-2">
               {/* Master Toggle */}
               <SettingsToggle 
                 label={t.showText} 
                 statusText={settings.showCustomText ? 'VISIBLE' : 'HIDDEN'}
                 value={settings.showCustomText}
                 onChange={() => setSettings({...settings, showCustomText: !settings.showCustomText})}
                 activeColor="blue"
               />

               {/* Pulse Toggle */}
               <SettingsToggle 
                 label={t.pulseBeat} 
                 statusText={settings.textPulse ? 'ON' : 'OFF'}
                 value={settings.textPulse}
                 onChange={() => setSettings({...settings, textPulse: !settings.textPulse})}
                 activeColor="blue"
               />
           </div>
        </div>
      </div>

      <div className="p-4 h-full flex flex-col pt-6 space-y-6">
         <span className="text-[10px] font-bold uppercase text-white/50 tracking-[0.25em] block ml-1 -mb-2">{t.textProperties}</span>
         
         <Slider 
           label={t.textSize} 
           value={settings.customTextSize ?? 12} 
           min={2} 
           max={40} 
           step={1} 
           onChange={(v: number) => setSettings({...settings, customTextSize: v})} 
           unit=""
         />

         <Slider 
           label={t.textRotation} 
           value={settings.customTextRotation ?? 0} 
           min={-180} 
           max={180} 
           step={5} 
           onChange={(v: number) => setSettings({...settings, customTextRotation: v})} 
           unit="°"
         />

         <Slider 
           label={t.textOpacity} 
           value={settings.customTextOpacity ?? 1.0} 
           min={0} 
           max={1} 
           step={0.05} 
           onChange={(v: number) => setSettings({...settings, customTextOpacity: v})} 
           unit=""
         />
      </div>
      
      <div className="p-4 h-full flex flex-col pt-6">
         <button onClick={resetTextSettings} className="w-full py-2.5 bg-white/[0.04] rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetText}
         </button>
      </div>
    </>
  );
};
