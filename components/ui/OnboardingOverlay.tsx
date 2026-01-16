
import React, { useState } from 'react';
import { Language } from '../../core/types';
import { TRANSLATIONS } from '../../core/i18n';
import { APP_VERSION } from '../../core/constants';

interface OnboardingOverlayProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onComplete: () => void;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' }, { value: 'zh', label: '简体中文' }, { value: 'tw', label: '繁體中文' },
  { value: 'ja', label: '日本語' }, { value: 'es', label: 'Español' }, { value: 'ko', label: '한국어' },
  { value: 'de', label: 'Deutsch' }, { value: 'fr', label: 'Français' }, { value: 'ru', label: 'Русский' }, 
  { value: 'ar', label: 'العربية' }
];

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ language, setLanguage, onComplete }) => {
  const [step, setStep] = useState(0);
  const t = TRANSLATIONS[language]?.onboarding || TRANSLATIONS['en'].onboarding;
  const h = TRANSLATIONS[language]?.helpModal?.shortcutItems || TRANSLATIONS['en'].helpModal.shortcutItems;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col min-h-[500px] animate-fade-in-up">
        <div className="p-8 pb-4 text-center z-10">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400 mb-2">{step === 0 ? 'Aura Vision' : t.welcome}</h1>
          <p className="text-white/40 text-sm font-medium tracking-wide uppercase">{step === 0 ? `v${APP_VERSION}` : t.subtitle}</p>
        </div>
        <div className="flex-1 px-8 py-4 relative z-10 overflow-y-auto custom-scrollbar">
          {step === 0 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-white text-center mb-6">{t.selectLanguage}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LANGUAGES.map((lang) => (
                  <button key={lang.value} onClick={() => setLanguage(lang.value)} className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all duration-300 ${language === lang.value ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-transparent text-white/50 hover:text-white'}`}>{lang.label}</button>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-white text-center mb-4">{t.features.title}</h2>
              <div className="grid gap-4">
                <FeatureCard icon={<svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 00-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>} title={t.features.visuals.title} desc={t.features.visuals.desc} />
                <FeatureCard icon={<svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} title={t.features.ai.title} desc={t.features.ai.desc} />
                <FeatureCard icon={<svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} title={t.features.privacy.title} desc={t.features.privacy.desc} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center mb-6"><h2 className="text-xl font-bold text-white mb-1">{t.shortcuts.title}</h2><p className="text-white/50 text-xs">{t.shortcuts.desc}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <ShortcutRow k="Space" label={h.toggleMic} /><ShortcutRow k="F" label={h.fullscreen} />
                <ShortcutRow k="L" label={h.lyrics} /><ShortcutRow k="H" label={h.hideUi} />
                <ShortcutRow k="R" label={h.randomize} /><ShortcutRow k="← →" label={h.changeMode} />
              </div>
            </div>
          )}
        </div>
        <div className="p-8 pt-4 border-t border-white/5 flex justify-between items-center bg-black/20">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-white/40 hover:text-white text-sm font-bold uppercase transition-colors flex items-center gap-1">
              <span>←</span>
              <span>{t.back || 'Back'}</span>
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">{[0, 1, 2].map(i => <div key={i} className={`w-2 h-2 rounded-full ${step === i ? 'bg-white' : 'bg-white/20'}`} />)}</div>
          <button onClick={step === 2 ? onComplete : () => setStep(s => s + 1)} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-white/10">{step === 2 ? t.finish : t.next}</button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
     <div className="p-2 bg-white/5 rounded-lg shrink-0">{icon}</div>
     <div><h3 className="text-white font-bold text-sm mb-1">{title}</h3><p className="text-white/50 text-xs leading-relaxed">{desc}</p></div>
  </div>
);

const ShortcutRow = ({ k, label }: { k: string, label: string }) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]"><span className="text-white/60 text-xs truncate mr-2">{label}</span><kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-white border border-white/10 min-w-[24px] text-center">{k}</kbd></div>
);
