
import React from 'react';
import { LyricsStyle, Region, VisualizerSettings } from '../../../types';
import { REGION_NAMES } from '../../../constants';
import { CustomSelect, SettingsToggle, TooltipArea } from '../ControlWidgets';

interface AiSettingsPanelProps {
  settings: VisualizerSettings;
  setSettings: (settings: VisualizerSettings) => void;
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
  resetAiSettings: () => void;
  t: any;
}

export const AiSettingsPanel: React.FC<AiSettingsPanelProps> = ({
  settings, setSettings, showLyrics, setShowLyrics, resetAiSettings, t
}) => {
  return (
    <>
      <TooltipArea text={t.hints.lyrics}>
        <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
          <SettingsToggle 
             label={t.lyrics}
             value={showLyrics}
             onChange={() => setShowLyrics(!showLyrics)}
             statusText={showLyrics ? t.aiState.active : t.aiState.enable}
             activeColor="green"
          />
          <div className="mt-4 space-y-4">
             <CustomSelect 
                label={t.recognitionSource}
                value={settings.recognitionProvider || 'GEMINI'}
                options={[
                    { value: 'GEMINI', label: 'Gemini 3.0 (Official)' },
                    { value: 'MOCK', label: t.simulatedDemo || 'Simulated (Demo)' }
                ]}
                onChange={(val) => setSettings({...settings, recognitionProvider: val})}
             />
          </div>
        </div>
      </TooltipArea>
      <div className="p-4 space-y-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
        <CustomSelect 
          label={`${t.lyrics} ${t.styleTheme}`} 
          value={settings.lyricsStyle || LyricsStyle.KARAOKE} 
          hintText={t.hints.lyricsStyle} 
          options={Object.values(LyricsStyle).map(s => ({ value: s, label: t.lyricsStyles[s] }))} 
          onChange={(val) => setSettings({...settings, lyricsStyle: val as LyricsStyle})} 
        />
        
        <CustomSelect 
            label={t.lyricsPosition}
            value={settings.lyricsPosition || 'center'}
            options={[
                { value: 'top', label: t.positions.top },
                { value: 'center', label: t.positions.center },
                { value: 'bottom', label: t.positions.bottom }
            ]}
            onChange={(val) => setSettings({...settings, lyricsPosition: val})}
        />
      </div>
      <div className="p-4 space-y-4 h-full flex flex-col pt-6">
         <CustomSelect 
           label={t.region} 
           value={settings.region || 'global'} 
           hintText={t.hints.region} 
           options={Object.keys(REGION_NAMES).map(r => ({ value: r, label: t.regions[r] }))} 
           onChange={(val) => setSettings({...settings, region: val as Region})} 
         />
         
         <button onClick={resetAiSettings} className="w-full py-2.5 bg-white/[0.04] rounded-lg text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetAi}
        </button>
      </div>
    </>
  );
};
