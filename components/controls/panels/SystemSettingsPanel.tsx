
import React from 'react';
import { Language } from '../../../core/types';
import { APP_VERSION } from '../../../core/constants';
import { CustomSelect, SettingsToggle } from '../ControlWidgets';
import { useAppContext } from '../../App';

export const SystemSettingsPanel: React.FC = () => {
  const { language, setLanguage, settings, setSettings, resetSettings, t } = useAppContext();
  
  const h = t?.helpModal || {};
  const s = h?.shortcutItems || {};
  const hints = t?.hints || {};
  const guideSteps = h?.howItWorksSteps || [];

  return (
    <>
      {/* 左侧：核心系统控制 */}
      <div className="p-4 space-y-4 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col h-full pt-6">
        <CustomSelect 
          label={t?.language || "Language"} 
          value={language} 
          hintText={hints?.language} 
          options={[
            { value: 'en', label: 'English' }, { value: 'zh', label: '简体中文' }, 
            { value: 'tw', label: '繁體中文' }, { value: 'ja', label: '日本語' }, 
            { value: 'es', label: 'Español' }, { value: 'ko', label: '한국어' }, 
            { value: 'de', label: 'Deutsch' }, { value: 'fr', label: 'Français' }
          ]} 
          onChange={(val) => setLanguage(val as Language)} 
        />
        
        <div className="pt-2">
            <SettingsToggle 
              label={t?.wakeLock || "Stay Awake"} 
              value={settings.wakeLock} 
              onChange={() => setSettings({...settings, wakeLock: !settings.wakeLock})} 
              hintText={hints?.wakeLock} 
              statusText={settings.wakeLock ? (t?.common?.active || "Active") : (t?.common?.off || "OFF")} 
            />
        </div>

        <div className="mt-auto space-y-4">
            <button 
              onClick={resetSettings} 
              className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t?.reset || "Reset App"}
            </button>
            <div className="text-center">
              <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">AURA VISION BUILD {APP_VERSION}</span>
            </div>
        </div>
      </div>

      {/* 右侧：说明与文档区域 */}
      <div className="p-4 flex flex-col h-full overflow-y-auto custom-scrollbar space-y-5 col-span-2">
          
          {/* 项目简介与隐私 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
               <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 {h?.projectInfoTitle || "About Aura"}
               </h4>
               <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                 {t?.language === 'zh' 
                   ? '沉浸式 AI 视听套件。适用于直播背景、现场 VJ、氛围装饰及专注陪伴场景。' 
                   : 'Immersive AI visualizer for Streamers, VJs, Ambient decor, and Focus sessions.'}
               </p>
            </div>
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
               <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                 </svg>
                 {h?.privacyTitle || "Privacy"}
               </h4>
               <p className="text-[11px] text-white/50 leading-relaxed font-medium">{h?.privacyText || "Local analysis only."}</p>
            </div>
          </div>

          {/* 快速使用指南 */}
          <div className="space-y-3">
             <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] ml-1">{h?.howItWorksTitle || "User Guide"}</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {guideSteps.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start bg-white/[0.02] p-3 rounded-xl border border-white/5">
                     <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                     <p className="text-[11px] text-white/60 leading-snug">{step}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* 快捷键 */}
          <div className="space-y-3 pt-2">
             <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1">{h?.shortcutsTitle || "Keyboard Shortcuts"}</h4>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <ShortcutItem label={s?.toggleMic || "Mic"} k="Space" />
                <ShortcutItem label={s?.fullscreen || "FS"} k="F" />
                <ShortcutItem label={s?.lyrics || "ID"} k="L" />
                <ShortcutItem label={s?.hideUi || "UI"} k="H" />
                <ShortcutItem label={s?.randomize || "Rand"} k="R" />
                <ShortcutItem label={s?.glow || "Glow"} k="G" />
             </div>
          </div>
      </div>
    </>
  );
};

const ShortcutItem = ({ label, k }: { label: string, k: string }) => (
  <div className="bg-white/[0.02] p-2 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
     <span className="text-[10px] text-white/40 group-hover:text-white/80 transition-colors truncate pr-2 font-bold uppercase">{label}</span>
     <kbd className="text-[9px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/80 border border-white/10 min-w-[24px] text-center shadow-sm">{k}</kbd>
  </div>
);
