
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
  t: any;
}

export const AiSettingsPanel: React.FC<AiSettingsPanelProps> = ({
  showLyrics, setShowLyrics, lyricsStyle, setLyricsStyle, region, setRegion, t
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
      </div>
    </>
  );
};
