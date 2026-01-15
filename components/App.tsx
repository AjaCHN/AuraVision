import React from 'react';
import VisualizerCanvas from './visualizers/VisualizerCanvas';
import ThreeVisualizer from './visualizers/ThreeVisualizer';
import Controls from './controls/Controls';
import SongOverlay from './ui/SongOverlay';
import CustomTextOverlay from './ui/CustomTextOverlay';
import LyricsOverlay from './ui/LyricsOverlay';
import { OnboardingOverlay } from './ui/OnboardingOverlay'; 
import { VisualizerMode } from '../core/types';
import { AppProvider, useAppContext } from './AppContext';
import { APP_VERSION } from '../core/constants';

const AppContent: React.FC = () => {
  const {
    settings, errorMessage, setErrorMessage, isSimulating, hasStarted, isUnsupported,
    showOnboarding, language, setLanguage, handleOnboardingComplete,
    setHasStarted, startMicrophone, startDemoMode, selectedDeviceId,
    t, isThreeMode, analyser, mode, colorTheme,
    currentSong, showLyrics, lyricsStyle, mediaStream,
    performIdentification, setCurrentSong
  } = useAppContext();

  if (showOnboarding) {
    return <OnboardingOverlay language={language} setLanguage={setLanguage} onComplete={handleOnboardingComplete} />;
  }

  if (!hasStarted) {
    if (isUnsupported) {
        return (
            <div className="min-h-[100dvh] bg-black flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6 animate-fade-in-up">
                    <h1 className="text-4xl font-black text-red-400">{t?.unsupportedTitle || 'Browser Not Supported'}</h1>
                    <p className="text-gray-300 leading-relaxed">
                        {t?.unsupportedText || 'Aura Vision requires modern browser features (like microphone access) that are not available. Please update to a recent version of Chrome, Firefox, or Safari.'}
                    </p>
                </div>
            </div>
        );
    }
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-fade-in-up">
          <h1 className="text-5xl font-black bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-4 text-transparent">{t?.welcomeTitle || "Aura Vision"}</h1>
          <p className="text-gray-400 text-sm">{t?.welcomeText || "Translate audio into generative art."}</p>
          <div className="flex flex-col gap-3">
             <button onClick={() => { setHasStarted(true); startMicrophone(selectedDeviceId); }} className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all">{t?.startExperience || "Start"}</button>
             <button onClick={() => { setHasStarted(true); startDemoMode(); }} className="px-8 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-sm border border-white/10">{t?.errors?.tryDemo || "Try Demo Mode"}</button>
          </div>
          {errorMessage && <div className="p-3 bg-red-500/20 text-red-200 text-xs rounded-lg border border-red-500/30 leading-relaxed">{errorMessage}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[100dvh] bg-black overflow-hidden relative ${settings.hideCursor ? 'cursor-none' : ''}`}>
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] bg-red-900/90 text-white px-6 py-4 rounded-xl border border-red-500/50 animate-fade-in-up flex flex-col sm:flex-row items-center gap-4 shadow-2xl max-w-[90vw]">
            <div className="flex-1 text-xs font-medium">{errorMessage}</div>
            <div className="flex items-center gap-3">
               <button onClick={startDemoMode} className="whitespace-nowrap px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">{t?.errors?.tryDemo || "Demo Mode"}</button>
               <button onClick={() => setErrorMessage(null)} className="p-2 hover:bg-white/10 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
        </div>
      )}
      {isSimulating && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[140] bg-blue-600/20 backdrop-blur-md border border-blue-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Demo Mode</span>
        </div>
      )}
      {isThreeMode ? <ThreeVisualizer analyser={analyser} mode={mode} colors={colorTheme} settings={settings} /> : <VisualizerCanvas analyser={analyser} mode={mode} colors={colorTheme} settings={settings} />}
      <CustomTextOverlay settings={settings} analyser={analyser} />
      <LyricsOverlay settings={settings} song={currentSong} showLyrics={showLyrics} lyricsStyle={lyricsStyle} analyser={analyser} />
      <SongOverlay song={currentSong} showLyrics={showLyrics} language={language} onRetry={() => mediaStream && performIdentification(mediaStream)} onClose={() => setCurrentSong(null)} analyser={analyser} sensitivity={settings.sensitivity} />
      <Controls />
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none text-white/20 text-[10px] font-mono uppercase tracking-widest">
        AURA VISION v{APP_VERSION}
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;