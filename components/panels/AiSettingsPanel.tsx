
import React from 'react';
import { LyricsStyle, Region } from '../../types';
import { REGION_NAMES } from '../../constants';
import { CustomSelect, TooltipArea } from '../ControlWidgets';

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
        <div className="p-6 h-full flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-white/50 tracking-[0.18em] block ml-1">{t.lyrics}</span>
            <button onClick={() => setShowLyrics(!showLyrics)} className={`w-full py-3.5 rounded-xl border font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 ${showLyrics ? 'bg-green-500/20 border-green-500/40 text-green-300 shadow-[0_0_40px_rgba(34,197,94,0.1)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:bg-white/[0.08] hover:text-white'}`}>
              {showLyrics ? t.aiState.active : t.aiState.enable}
            </button>
          </div>
        </div>
      </TooltipArea>
      <div className="p-6 space-y-6 h-full flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
        <CustomSelect 
          label={`${t.lyrics} ${t.styleTheme}`} 
          value={lyricsStyle} 
          hintText={t.hints.lyricsStyle} 
          options={Object.values(LyricsStyle).map(s => ({ value: s, label: t.lyricsStyles[s] }))} 
          onChange={(val) => setLyricsStyle(val as LyricsStyle)} 
        />
      </div>
      <div className="p-6 space-y-6 h-full flex flex-col justify-center">
         <CustomSelect 
           label={t.region} 
           value={region} 
           hintText={t.hints.region} 
           options={Object.keys(REGION_NAMES).map(r => ({ value: r, label: t.regions[r] }))} 
           onChange={(val) => setRegion(val as Region)} 
         />
         
         <button onClick={resetAiSettings} className="w-full py-3 bg-white/[0.04] rounded-lg text-[12px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t.resetAi}
        </button>
      </div>
    </>
  );
};
