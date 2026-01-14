
import React from 'react';
import { Language } from '../../../types';
import { APP_VERSION } from '../../../constants';
import { CustomSelect } from '../ControlWidgets';

interface SystemSettingsPanelProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  resetSettings: () => void;
  t: any;
}

export const SystemSettingsPanel: React.FC<SystemSettingsPanelProps> = ({
  language, setLanguage, resetSettings, t
}) => {
  const h = t.helpModal; 
  const s = h.shortcutItems; 

  return (
    <>
      <div className="p-4 space-y-4 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col h-full pt-6">
        <CustomSelect 
          label={t.language} 
          value={language} 
          hintText={t.hints.language} 
          options={[
             { value: 'en', label: 'English' },
             { value: 'zh', label: '简体中文 (Simplified Chinese)' },
             { value: 'tw', label: '繁體中文 (Traditional Chinese)' },
             { value: 'ja', label: '日本語 (Japanese)' },
             { value: 'es', label: 'Español (Spanish)' },
             { value: 'ko', label: '한국어 (Korean)' },
             { value: 'de', label: 'Deutsch (German)' },
             { value: 'fr', label: 'Français (French)' }
          ]} 
          onChange={(val) => setLanguage(val as Language)} 
        />
        
        <div className="space-y-4 mt-auto">
            <button onClick={resetSettings} className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.reset}
            </button>
            <div className="text-center">
                <span className="text-xs text-white/20 font-mono">v{APP_VERSION}</span>
            </div>
        </div>
      </div>

      <div className="p-4 flex flex-col h-full overflow-y-auto custom-scrollbar space-y-4 col-span-2">
          {/* Project Info Section */}
          <div className="bg-white/[0.04] p-3 rounded-xl border border-white/5">
             <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {h.projectInfoTitle}
             </h4>
             <p className="text-xs text-white/60 leading-relaxed font-medium">
               {h.projectInfoText}
             </p>
          </div>

          {/* Shortcuts Expanded List */}
          <div className="space-y-2">
             <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-1">{h.shortcutsTitle}</h4>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <ShortcutItem label={s.toggleMic} k="Space" />
                <ShortcutItem label={s.fullscreen} k="F" />
                <ShortcutItem label={s.lyrics} k="L" />
                <ShortcutItem label={s.hideUi} k="H" />
                <ShortcutItem label={s.randomize} k="R" />
                <ShortcutItem label={s.changeMode} k="← →" />
                <ShortcutItem label={s.changeTheme} k="↑ ↓" />
                <ShortcutItem label={s.glow} k="G" />
                <ShortcutItem label={s.trails} k="T" />
             </div>
          </div>
      </div>
    </>
  );
};

// Helper component for uniform shortcut items
const ShortcutItem = ({ label, k }: { label: string, k: string }) => (
  <div className="bg-white/[0.02] p-2 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
     <span className="text-[10px] text-white/50 group-hover:text-white/80 transition-colors truncate pr-2" title={label}>{label}</span>
     <kbd className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/80 border border-white/5 shadow-sm min-w-[20px] text-center">{k}</kbd>
  </div>
);
