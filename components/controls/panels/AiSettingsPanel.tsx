
import React, { useRef } from 'react';
import { LyricsStyle, Region, Position } from '../../../core/types';
import { REGION_NAMES, getPositionOptions, AVAILABLE_FONTS } from '../../../core/constants';
import { CustomSelect, SettingsToggle, Slider, PositionSelector } from '../ControlWidgets';
import { useAppContext } from '../../AppContext';

const BetaBadge = ({ label }: { label?: string }) => (
  <span className="ml-2 px-1.5 py-[1px] rounded-[4px] bg-blue-500/20 border border-blue-500/30 text-[9px] font-bold text-blue-300 tracking-wider">
    {label || 'BETA'}
  </span>
);

export const AiSettingsPanel: React.FC = () => {
  const { settings, setSettings, showLyrics, setShowLyrics, resetAiSettings, currentSong, setCurrentSong, t } = useAppContext();
  const common = t?.common || {};
  const regions = t?.regions || {};
  const lyricsStyles = t?.lyricsStyles || {};
  const hints = t?.hints || {};
  
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const positionOptions = getPositionOptions(t);
  
  const handleLyricsPositionChange = (value: Position) => {
    setSettings({ ...settings, lyricsPosition: value });
    
    if (!currentSong || currentSong.matchSource === 'PREVIEW') {
        if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
        
        setCurrentSong({
            title: "Preview Mode",
            artist: "System",
            lyricsSnippet: "Adjusting layout position...\nReviewing visual alignment\nDoes this look correct?\nWaiting for audio...",
            identified: true,
            matchSource: 'PREVIEW',
            mood: 'Energetic'
        });

        previewTimeoutRef.current = setTimeout(() => {
            setCurrentSong((prev) => prev?.matchSource === 'PREVIEW' ? null : prev);
        }, 4000);
    }
  };

  return (
    <>
      {/* Col 1: Core AI Settings */}
      <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6 overflow-hidden">
        <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center mb-1">
               <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em]">{t?.tabs?.ai || "AI Recognition"}</span>
               <BetaBadge label={common?.beta} />
            </div>
            <SettingsToggle label={t?.showLyrics || "Enable Recognition"} value={showLyrics} onChange={() => setShowLyrics(!showLyrics)} activeColor="green" hintText={`${hints?.lyrics || "Enable AI Lyrics"} [L]`} />
            
            <div className="space-y-4 pt-1">
               <CustomSelect 
                 label={t?.recognitionSource || "AI Source"} 
                 value={settings.recognitionProvider || 'GEMINI'} 
                 options={[
                   { value: 'GEMINI', label: 'Gemini 3.0' }, 
                   { value: 'GROK', label: 'Grok (xAI)' },
                   { value: 'DEEPSEEK', label: 'DeepSeek' },
                   { value: 'QWEN', label: 'Qwen (Alibaba)' },
                   { value: 'OPENAI', label: 'OpenAI GPT-4' },
                   { value: 'CLAUDE', label: 'Claude 3.5' },
                   { value: 'MOCK', label: t?.simulatedDemo || 'Simulated' }
                 ]} 
                 onChange={(val) => setSettings({...settings, recognitionProvider: val})} 
               />
               
               <CustomSelect label={t?.region || "Region"} value={settings.region || 'global'} hintText={hints?.region} options={Object.keys(REGION_NAMES).map(r => ({ value: r, label: regions[r] || r }))} onChange={(val) => setSettings({...settings, region: val as Region})} />
            </div>
        </div>
      </div>

      {/* Col 2: Style */}
      <div className="p-4 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pt-6">
        <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-2">
            <CustomSelect 
              label={`${t?.lyrics || "Lyrics"} ${t?.styleTheme || "Style"}`} 
              value={settings.lyricsStyle || LyricsStyle.KARAOKE} 
              hintText={hints?.lyricsStyle} 
              options={Object.values(LyricsStyle).map(s => ({ value: s, label: lyricsStyles[s] || s }))} 
              onChange={(val) => setSettings({...settings, lyricsStyle: val as LyricsStyle})} 
            />
            <CustomSelect 
                label={t?.lyricsFont || "Font Family"} 
                value={settings.lyricsFont || 'Inter, sans-serif'} 
                options={AVAILABLE_FONTS} 
                onChange={(val) => setSettings({...settings, lyricsFont: val})} 
            />
            <Slider 
                label={t?.lyricsFontSize || "Font Size"} 
                value={settings.lyricsFontSize ?? 4} 
                min={1} max={8} step={0.5} 
                onChange={(v: number) => setSettings({...settings, lyricsFontSize: v})} 
            />
        </div>
      </div>

      {/* Col 3: Position & Actions */}
      <div className="p-4 h-full flex flex-col pt-6">
        <div className="flex-grow">
            <PositionSelector
              label={t?.lyricsPosition || "Position"}
              value={settings.lyricsPosition}
              onChange={handleLyricsPositionChange}
              options={positionOptions}
              activeColor="green"
            />
        </div>
        <div className="mt-auto pt-6">
          <button onClick={resetAiSettings} className="w-full py-3 bg-white/[0.04] rounded-xl text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2 border border-transparent hover:border-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t?.resetAi || "Reset AI"}
          </button>
        </div>
      </div>
    </>
  );
};