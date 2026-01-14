
import React from 'react';
import { LyricsStyle, Region, Position } from '../../../core/types';
import { REGION_NAMES } from '../../../core/constants';
import { CustomSelect, SettingsToggle, TooltipArea, PositionSelector } from '../ControlWidgets';
import { useAppContext } from '../../App';

interface AiSettingsPanelProps {
  // Props are now sourced from context
}

const BetaBadge = ({ label }: { label?: string }) => (
  <span className="ml-2 px-1.5 py-[1px] rounded-[4px] bg-blue-500/20 border border-blue-500/30 text-[9px] font-bold text-blue-300 tracking-wider">
    {label || 'BETA'}
  </span>
);

export const AiSettingsPanel: React.FC<AiSettingsPanelProps> = () => {
  const { settings, setSettings, showLyrics, setShowLyrics, resetAiSettings, t } = useAppContext();
  const common = t?.common || {};
  const regions = t?.regions || {};
  const lyricsStyles = t?.lyricsStyles || {};
  const positions = t?.positions || {};
  const hints = t?.hints || {};

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
  
  const handleLyricsPositionChange = (value: Position) => {
    setSettings({ ...settings, lyricsPosition: value });
  };

  return (
    <>
      {/* 第一列：AI 核心识别设置 */}
      <TooltipArea text={hints?.lyrics || "Lyrics Recognition"}>
        <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6 space-y-5">
          <div className="flex items-center">
             <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em]">{t?.lyrics || "Lyrics"}</span>
             <BetaBadge label={common?.beta} />
          </div>
          <SettingsToggle label={t?.showLyrics || "Enable Recognition"} value={showLyrics} onChange={() => setShowLyrics(!showLyrics)} activeColor="green" hintText={`${hints?.lyrics || "Enable AI Lyrics"} [L]`} />
          <div className="space-y-4 pt-1">
             <CustomSelect label={t?.recognitionSource || "AI Source"} value={settings.recognitionProvider || 'GEMINI'} options={[{ value: 'GEMINI', label: 'Gemini 3.0' }, { value: 'MOCK', label: t?.simulatedDemo || 'Simulated' }]} onChange={(val) => setSettings({...settings, recognitionProvider: val})} />
             <CustomSelect label={t?.region || "Region"} value={settings.region || 'global'} hintText={hints?.region} options={Object.keys(REGION_NAMES).map(r => ({ value: r, label: regions[r] || r }))} onChange={(val) => setSettings({...settings, region: val as Region})} />
          </div>
        </div>
      </TooltipArea>

      {/* 第二列：外观风格设置 */}
      <div className="p-4 space-y-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
        <div className="flex items-center mb-1">
           <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em]">{t?.displaySettings || "Display"}</span>
           <BetaBadge label={common?.beta} />
        </div>
        <CustomSelect 
          label={`${t?.lyrics || "Lyrics"} ${t?.styleTheme || "Style"}`} 
          value={settings.lyricsStyle || LyricsStyle.KARAOKE} 
          hintText={hints?.lyricsStyle} 
          options={Object.values(LyricsStyle).map(s => ({ value: s, label: lyricsStyles[s] || s }))} 
          onChange={(val) => setSettings({...settings, lyricsStyle: val as LyricsStyle})} 
        />
      </div>

      {/* 第三列：位置设置与重置 */}
      <div className="p-4 space-y-6 h-full flex flex-col pt-6">
        <PositionSelector
          label={t?.lyricsPosition || "Position"}
          value={settings.lyricsPosition}
          onChange={handleLyricsPositionChange}
          options={positionOptions}
          activeColor="green"
        />
        
        <div className="mt-auto">
          <button onClick={resetAiSettings} className="w-full py-2.5 bg-white/[0.04] rounded-lg text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t?.resetAi || "Reset AI"}
          </button>
        </div>
      </div>
    </>
  );
};
