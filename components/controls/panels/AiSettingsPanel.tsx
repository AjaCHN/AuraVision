
import React from 'react';
import { LyricsStyle, Region } from '../../../types';
import { REGION_NAMES } from '../../../constants';
import { CustomSelect, SettingsToggle, TooltipArea } from '../ControlWidgets';

interface AiSettingsPanelProps {
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
  lyricsStyle: LyricsStyle;
  setLyricsStyle: (style: LyricsStyle) => void;
  region: Region;
  setRegion: (region: Region) => void;
  resetAiSettings: () => void;
  t: any;
}

export const AiSettingsPanel: React.FC<AiSettingsPanelProps> = ({
  showLyrics, setShowLyrics, lyricsStyle, setLyricsStyle, region, setRegion, resetAiSettings, t
}) => {
  return (
    <>
      <TooltipArea text={t.hints.lyrics}>
        {/* Removed justify-center to align items to top */}
        <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
          <SettingsToggle 
             label={t.lyrics}
             value={showLyrics}
             onChange={() => setShowLyrics(!showLyrics)}
             activeColor="green"
          />
        </div>
      </TooltipArea>
      {/* Removed justify-center */}
      <div className="p-4 space-y-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
        <CustomSelect 
          label={`${t.lyrics} ${t.styleTheme}`} 
          value={lyricsStyle} 
          hintText={t.hints.lyricsStyle} 
          options={Object.values(LyricsStyle).map(s => ({ value: s, label: t.lyricsStyles[s] }))} 
          onChange={(val) => setLyricsStyle(val as LyricsStyle)} 
        />
      </div>
      {/* Removed justify-center */}
      <div className="p-4 space-y-4 h-full flex flex-col pt-6">
         <CustomSelect 
           label={t.region} 
           value={region} 
           hintText={t.hints.region} 
           options={Object.keys(REGION_NAMES).map(r => ({ value: r, label: t.regions[r] }))} 
           onChange={(val) => setRegion(val as Region)} 
         />
         
         <button onClick={resetAiSettings} className="w-full py-2.5 bg-white/[0.04] rounded-lg text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2 mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetAi}
        </button>
      </div>
    </>
  );
};
