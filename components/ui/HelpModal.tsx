import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

type HelpTab = 'guide' | 'shortcuts' | 'about';

export const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState<HelpTab>('guide');
    const h = t?.helpModal || {};
    const s = h?.shortcutItems || {};
    const guideSteps = h?.howItWorksSteps || [];
    
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg" onClick={onClose}>
            <div 
                className="w-full max-w-3xl bg-[#0a0a0c]/90 border border-white/10 rounded-3xl shadow-2xl relative flex flex-col h-[80vh] max-h-[600px] animate-fade-in-up" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">{h.title || 'Help & Information'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-white/40 hover:bg-white/10 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    <div className="w-full md:w-48 p-4 border-b md:border-b-0 md:border-r border-white/5 flex-shrink-0">
                        <nav className="flex flex-row md:flex-col gap-2">
                            {(['guide', 'shortcuts', 'about'] as HelpTab[]).map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full px-4 py-3 rounded-lg text-left text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600/20 text-blue-300' : 'text-white/40 hover:bg-white/5'}`}>
                                    {h?.tabs?.[tab] || tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {activeTab === 'guide' && <GuideContent h={h} guideSteps={guideSteps} />}
                        {activeTab === 'shortcuts' && <ShortcutsContent h={h} s={s} />}
                        {activeTab === 'about' && <AboutContent h={h} t={t} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GuideContent: React.FC<{ h: any; guideSteps: string[] }> = ({ h, guideSteps }) => (
    <div className="space-y-8">
        <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
            <p className="text-sm text-blue-100/70 leading-relaxed italic">
                {h.intro || "Experience high-fidelity generative art driven by your music."}
            </p>
        </div>
        <div>
            <h4 className="text-sm font-black text-purple-400 uppercase tracking-[0.2em] mb-5 px-1">{h?.howItWorksTitle || "How to Use"}</h4>
            <div className="flex flex-col gap-3">
                {guideSteps.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                     <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                        {idx + 1}
                     </span>
                     <p className="text-sm text-white/80 leading-relaxed font-medium">
                        {step.startsWith(`${idx + 1}. `) ? step.substring(3) : step}
                     </p>
                  </div>
                ))}
             </div>
        </div>
    </div>
);

const ShortcutsContent: React.FC<{ h: any; s: any }> = ({ h, s }) => (
    <div>
        <h4 className="text-sm font-black text-orange-400 uppercase tracking-[0.2em] mb-4 px-1">{h?.shortcutsTitle || "Keyboard Shortcuts"}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ShortcutItem label={s?.toggleMic || "Mic"} k="Space" />
            <ShortcutItem label={s?.fullscreen || "Fullscreen"} k="F" />
            <ShortcutItem label={s?.lyrics || "AI Info"} k="L" />
            <ShortcutItem label={s?.hideUi || "Toggle UI"} k="H" />
            <ShortcutItem label={s?.randomize || "Randomize"} k="R" />
            <ShortcutItem label={s?.glow || "Glow"} k="G" />
            <ShortcutItem label={s?.trails || "Trails"} k="T" />
            <ShortcutItem label={s?.changeMode || "Cycle Mode"} k="← →" />
        </div>
    </div>
);

const AboutContent: React.FC<{ h: any; t: any }> = ({ h, t }) => (
    <div className="space-y-6">
        <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
           <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             {h?.projectInfoTitle || "About Aura"}
           </h4>
           <p className="text-sm text-white/50 leading-relaxed font-medium">
             {h?.aboutDescription || "Immersive AI visualizer for Streamers, VJs, Ambient decor, and Focus sessions."}
           </p>
        </div>
        <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
           <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
             {h?.privacyTitle || "Privacy"}
           </h4>
           <p className="text-sm text-white/50 leading-relaxed font-medium">{h?.privacyText || "Local analysis only."}</p>
        </div>
    </div>
);

const ShortcutItem = ({ label, k }: { label: string, k: string }) => (
  <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-all">
     <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors truncate pr-2 font-bold uppercase tracking-wider">{label}</span>
     <kbd className="text-xs font-mono bg-white/10 px-3 py-1 rounded-lg text-white border border-white/10 min-w-[24px] text-center shadow-md">{k}</kbd>
  </div>
);