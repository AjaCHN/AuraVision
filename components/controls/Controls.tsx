
import React, { useState, useEffect } from 'react';
import { VisualizerMode } from '../../core/types';
import HelpModal from '../ui/HelpModal';
import { ActionButton, TooltipArea } from './ControlWidgets';

import { VisualSettingsPanel } from './panels/VisualSettingsPanel';
import { AudioSettingsPanel } from './panels/AudioSettingsPanel';
import { AiSettingsPanel } from './panels/AiSettingsPanel';
import { SystemSettingsPanel } from './panels/SystemSettingsPanel';
import { CustomTextSettingsPanel } from './panels/CustomTextSettingsPanel';
import { useIdleTimer } from '../../core/hooks/useIdleTimer';
import { useAppContext } from '../App';

type TabType = 'visual' | 'text' | 'audio' | 'ai' | 'system';

const Controls: React.FC = () => {
  const {
    settings, setSettings, showLyrics, setShowLyrics,
    toggleMicrophone, randomizeSettings, t, language
  } = useAppContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  const [showHelp, setShowHelp] = useState(false);
  
  const { isIdle } = useIdleTimer(isExpanded);
  
  const toggleFullscreen = () => {
    const doc = window.document as any;
    const elem = doc.documentElement as any;

    const isFullscreen = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;

    if (!isFullscreen) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        }
    } else {
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) { // Safari
            doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) { // Firefox
            doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) { // IE11
            doc.msExitFullscreen();
        }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); toggleMicrophone(settings.recognitionProvider); break;
        case 'KeyF': toggleFullscreen(); break;
        case 'KeyR': randomizeSettings(); break;
        case 'KeyL': setShowLyrics(!showLyrics); break;
        case 'KeyH': setIsExpanded(prev => !prev); break;
        case 'KeyG': setSettings({ ...settings, glow: !settings.glow }); break;
        case 'KeyT': setSettings({ ...settings, trails: !settings.trails }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, showLyrics, toggleMicrophone, randomizeSettings, setShowLyrics, setSettings]);

  const tabFontSize = (language === 'zh' || language === 'tw') ? 'text-xs' : 'text-[10px]';

  return (
    <>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} language={language} />
      <MiniControls isExpanded={isExpanded} isIdle={isIdle} setIsExpanded={setIsExpanded} toggleFullscreen={toggleFullscreen} />
      {isExpanded && (
        <div className="fixed bottom-0 left-0 w-full z-[120] bg-[#050505] border-t border-white/10 transition-all duration-700 shadow-[0_-25px_100px_rgba(0,0,0,0.9)] opacity-100">
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-4 md:p-6">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-4">
                <div className="flex bg-white/[0.04] p-1 rounded-xl overflow-x-auto max-w-full scrollbar-hide gap-1 mask-fade-right" role="tablist" aria-label="Settings Categories">
                  {(['visual', 'text', 'audio', 'ai', 'system'] as TabType[]).map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)} 
                      role="tab"
                      aria-selected={activeTab === tab}
                      aria-controls={`panel-${tab}`}
                      id={`tab-${tab}`}
                      className={`px-5 py-2.5 rounded-lg ${tabFontSize} font-bold uppercase tracking-[0.2em] transition-all duration-300 flex-shrink-0 ${activeTab === tab ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{t?.tabs?.[tab] || tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <ActionButton onClick={randomizeSettings} hintText={`${t?.hints?.randomize || "Randomize"} [R]`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} />
                  <ActionButton onClick={toggleFullscreen} hintText={`${t?.hints?.fullscreen || "Fullscreen"} [F]`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>} />
                  <button onClick={() => setIsExpanded(false)} className="w-12 h-10 flex items-center justify-center bg-blue-600 rounded-xl text-white shadow-[0_12px_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all duration-300" aria-label={t?.hideOptions || "Collapse"}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg></button>
                </div>
              </div>
              <div 
                className="bg-[#0f0f11] border border-white/5 rounded-2xl overflow-hidden min-h-[280px]"
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch">
                  {activeTab === 'visual' && <VisualSettingsPanel />}
                  {activeTab === 'text' && <CustomTextSettingsPanel />}
                  {activeTab === 'audio' && <AudioSettingsPanel />}
                  {activeTab === 'ai' && <AiSettingsPanel />}
                  {activeTab === 'system' && <SystemSettingsPanel />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MiniControls: React.FC<{isExpanded: boolean; isIdle: boolean; setIsExpanded: (e:boolean) => void; toggleFullscreen: () => void;}> = ({isExpanded, isIdle, setIsExpanded, toggleFullscreen}) => {
    const { isListening, toggleMicrophone, selectedDeviceId, randomizeSettings, t, isIdentifying, showLyrics } = useAppContext();
    if (isExpanded) return null;
    return (
        <>
        {isIdentifying && showLyrics && (
            <div className="fixed top-8 left-8 z-[110] bg-black/60 backdrop-blur-2xl border border-blue-500/30 rounded-full px-6 py-3.5 flex items-center gap-4 animate-pulse">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-100">{t?.identifying || "AI ANALYZING..."}</span>
            </div>
        )}
        <div className="fixed bottom-8 left-0 w-full z-[110] flex justify-center pointer-events-none px-4">
            <div className={`flex items-center border border-white/10 rounded-full p-2 pr-6 transition-all duration-700 pointer-events-auto ${isIdle ? 'bg-black/20 backdrop-blur-none opacity-[0.12] translate-y-2 scale-95 shadow-none' : 'bg-black/60 backdrop-blur-3xl opacity-100 translate-y-0 scale-100 shadow-2xl shadow-black/50'}`}>
                <TooltipArea text={`${isListening ? t?.stopMic : t?.startMic} [Space]`}>
                    <button 
                      onClick={() => toggleMicrophone(selectedDeviceId)} 
                      aria-label={isListening ? t?.stopMic : t?.startMic}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/10 text-white/40 hover:text-white'}`}>
                        {isListening ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M6 7.5A1.5 1.5 0 017.5 6h9A1.5 1.5 0 0118 7.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 16.5v-9z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                    </button>
                </TooltipArea>
                <div className="h-6 w-px bg-white/10 mx-3" />
                <TooltipArea text={`${t?.randomize || "Randomize"} [R]`}>
                    <button onClick={randomizeSettings} aria-label={t?.randomize} className="text-white/40 hover:text-white transition-colors mr-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                </TooltipArea>
                <TooltipArea text={`${t?.hints?.fullscreen || "Fullscreen"} [F]`}>
                    <button onClick={toggleFullscreen} aria-label={t?.hints?.fullscreen} className="text-white/40 hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></button>
                </TooltipArea>
                <TooltipArea text={`${t?.showOptions || "Expand"} [H]`}>
                    <button onClick={() => setIsExpanded(true)} aria-label={t?.showOptions} className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors flex items-center gap-2 pl-4"><span>{t?.showOptions || "OPTIONS"}</span><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg></button>
                </TooltipArea>
            </div>
        </div>
        </>
    );
};

export default Controls;