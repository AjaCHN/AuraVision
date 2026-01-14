
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

const BetaBadge = ({ label }: { label?: string }) => (
  <span className="ml-2 px-1.5 py-[1px] rounded-[4px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-[9px] font-bold text-blue-300 tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.2)]">
    {label || 'BETA'}
  </span>
);

export const AiSettingsPanel: React.FC<AiSettingsPanelProps> = ({
  settings, setSettings, showLyrics, setShowLyrics, resetAiSettings, t
}) => {
  // Use robust safe fallbacks for nested objects to prevent rendering crashes
  const common = t?.common || {};
  const regions = t?.regions || {};
  const lyricsStyles = t?.lyricsStyles || {};
  const positions = t?.positions || {};
  const hints = t?.hints || {};

  return (
    <>
      {/* Column 1: Core Recognition Settings */}
      <TooltipArea text={hints.lyrics || "Lyrics Recognition"}>
        <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6 space-y-5">
          <div className="flex items-center">
             <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em]">{t?.lyrics || "Lyrics"}</span>
             <BetaBadge label={common.beta} />
          </div>
          
          <SettingsToggle 
             label={t?.showLyrics || "Enable Recognition"}
             value={showLyrics}
             onChange={() => setShowLyrics(!showLyrics)}
             activeColor="green"
             hintText={`${hints.lyrics || "Enable AI Lyrics"} [L]`}
          />
          
          <div className="space-y-4 pt-1">
             <CustomSelect 
                label={t?.recognitionSource || "AI Source"}
                value={settings.recognitionProvider || 'GEMINI'}
                options={[
                    { value: 'GEMINI', label: 'Gemini 3.0 (Official)' },
                    { value: 'OPENAI', label: 'GPT-4o (OpenAI)' },
                    { value: 'CLAUDE', label: 'Claude 3.5 Sonnet' },
                    { value: 'GROK', label: 'Grok 2 (xAI)' },
                    { value: 'MOCK', label: t?.simulatedDemo || 'Simulated (Demo)' }
                ]}
                onChange={(val) => setSettings({...settings, recognitionProvider: val})}
             />

             <CustomSelect 
               label={t?.region || "Region"} 
               value={settings.region || 'global'} 
               hintText={hints.region} 
               options={Object.keys(REGION_NAMES).map(r => ({ value: r, label: regions[r] || r }))} 
               onChange={(val) => setSettings({...settings, region: val as Region})} 
             />
          </div>
        </div>
      </TooltipArea>

      {/* Column 2: Visual Display Settings */}
      <div className="p-4 space-y-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
        <div className="flex items-center mb-1">
             <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em]">{t?.displaySettings || "Display"}</span>
             <BetaBadge label={common.beta} />
        </div>

        <CustomSelect 
          label={`${t?.lyrics || "Lyrics"} ${t?.styleTheme || "Style"}`} 
          value={settings.lyricsStyle || LyricsStyle.KARAOKE} 
          hintText={hints.lyricsStyle} 
          options={Object.values(LyricsStyle).map(s => ({ value: s, label: lyricsStyles[s] || s }))} 
          onChange={(val) => setSettings({...settings, lyricsStyle: val as LyricsStyle})} 
        />
        
        <CustomSelect 
            label={t?.lyricsPosition || "Position"}
            value={settings.lyricsPosition || 'center'}
            options={[
                { value: 'top', label: positions.top || "Top" },
                { value: 'center', label: positions.center || "Center" },
                { value: 'bottom', label: positions.bottom || "Bottom" }
            ]}
            onChange={(val) => setSettings({...settings, lyricsPosition: val})}
        />
      </div>

      {/* Column 3: Reset Actions */}
      <div className="p-4 space-y-4 h-full flex flex-col pt-6 justify-end">
         <button onClick={resetAiSettings} className="w-full py-2.5 bg-white/[0.04] rounded-lg text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t?.resetAi || "Reset AI"}
        </button>
      </div>
    </>
  );
};
