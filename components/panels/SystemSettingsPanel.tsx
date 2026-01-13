
import React from 'react';
import { Language } from '../../types';
import { APP_VERSION } from '../../constants';
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
  return (
    <>
      <div className="p-6 space-y-8 border-b lg:border-b-0 lg:border-r border-white/10">
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
      </div>
      <div className="p-6 space-y-6 flex flex-col justify-center">
          <button onClick={resetSettings} className="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-bold text-sm uppercase tracking-widest hover:bg-red-500/20 transition-all">
          {t.reset}
          </button>
           <div className="text-center">
              <span className="text-xs text-white/20 font-mono">v{APP_VERSION}</span>
          </div>
      </div>
    </>
  );
};
