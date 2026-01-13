
import React from 'react';
import { VisualizerSettings } from '../../types';
import { SettingsToggle, Slider } from '../ControlWidgets';

interface CustomTextSettingsPanelProps {
  settings: VisualizerSettings;
  setSettings: (settings: VisualizerSettings) => void;
  t: any;
}

export const CustomTextSettingsPanel: React.FC<CustomTextSettingsPanelProps> = ({
  settings, setSettings, t
}) => {
  return (
    <>
      <div className="p-6 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/10">
        <div className="space-y-4">
           <span className="text-xs font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t.customText}</span>
           
           {/* Text Area */}
           <textarea 
             value={settings.customText}
             onChange={(e) => setSettings({...settings, customText: e.target.value.toUpperCase()})}
             placeholder={t.customTextPlaceholder}
             rows={3}
             className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white tracking-widest uppercase focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all resize-none custom-scrollbar"
           />

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
             statusText={settings.textPulse ? 'ENABLED' : 'DISABLED'}
             value={settings.textPulse}
             onChange={() => setSettings({...settings, textPulse: !settings.textPulse})}
             activeColor="blue"
           />
        </div>
      </div>

      <div className="p-6 h-full flex flex-col justify-center space-y-8">
         <span className="text-xs font-black uppercase text-white/50 tracking-[0.25em] block ml-1 -mb-2">{t.textProperties}</span>
         
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
      </div>
      
      {/* Empty column for layout balance or future expansion */}
      <div className="p-6 h-full flex items-center justify-center text-white/10">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
         </svg>
      </div>
    </>
  );
};
