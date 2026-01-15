import React, { useRef, useMemo } from 'react';
import { SongInfo, Language } from '../../core/types';
import { TRANSLATIONS } from '../../core/i18n';
import { useAudioPulse } from '../../core/hooks/useAudioPulse';

interface SongOverlayProps {
  song: SongInfo | null;
  language: Language;
  showLyrics: boolean;
  onRetry: () => void;
  onClose: () => void;
  analyser?: AnalyserNode | null;
  sensitivity?: number;
}

const getMoodStyle = (mood: string | undefined | null) => {
  if (!mood || typeof mood !== 'string') {
      return {
          textColor: 'text-purple-300', borderColor: 'border-blue-500',
          gradient: 'from-purple-500/10 to-blue-500/10', badgeGradient: 'from-purple-500/20 to-blue-500/20',
          icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" /></svg>
      };
  }
  const m = mood.toLowerCase();
  if (m.match(/happy|upbeat|energetic|dance|party|fun|joy|pop/)) {
    return {
      textColor: 'text-yellow-300', borderColor: 'border-yellow-400',
      gradient: 'from-yellow-500/20 to-orange-500/20', badgeGradient: 'from-yellow-500/20 to-orange-500/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 animate-[spin_4s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    };
  }
  if (m.match(/sad|melancholy|calm|slow|soft|ballad|emotional/)) {
    return {
      textColor: 'text-blue-300', borderColor: 'border-blue-400',
      gradient: 'from-blue-500/20 to-indigo-500/20', badgeGradient: 'from-blue-500/20 to-indigo-500/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
    };
  }
  return {
    textColor: 'text-purple-300', borderColor: 'border-blue-500',
    gradient: 'from-purple-500/10 to-blue-500/10', badgeGradient: 'from-purple-500/20 to-blue-500/20',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" /></svg>
  };
};

const SongOverlay: React.FC<SongOverlayProps> = ({ song, showLyrics, language, onRetry, onClose, analyser, sensitivity = 1.0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const moodStyle = useMemo(() => song && song.mood ? getMoodStyle(song.mood) : getMoodStyle('default'), [song]);
  
  const isEnabled = showLyrics && !!song && song.identified && song.matchSource !== 'PREVIEW';

  useAudioPulse({
    elementRef: containerRef,
    analyser,
    settings: { sensitivity },
    isEnabled: isEnabled,
    pulseStrength: 0.1,
  });

  if (!isEnabled) return null;
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <div 
        ref={containerRef}
        className={`absolute top-8 left-8 bg-black/40 backdrop-blur-md border-l-4 ${moodStyle.borderColor} pl-4 py-3 pr-4 rounded-r-xl max-w-xs md:max-w-md transition-all duration-700 shadow-[0_4px_10px_rgba(0,0,0,0.5)] pointer-events-auto group origin-top-left animate-fade-in-up`}
        style={{ animationDuration: '0.8s' }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${moodStyle.gradient} opacity-20 pointer-events-none rounded-r-xl`} />
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-white/20 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative z-10">
            <h2 className="text-white font-bold text-xl md:text-2xl tracking-tight pr-6 break-words">{song!.title}</h2>
            <p className="text-blue-300 text-sm md:text-base font-medium pr-6 break-words">{song!.artist}</p>
            {song!.mood && (
              <div className="flex items-center gap-2 mt-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${moodStyle.badgeGradient} border border-white/10 rounded-full`}>
                   <span className={moodStyle.textColor}>{moodStyle.icon}</span>
                   <span className={`text-[10px] font-bold uppercase tracking-wider ${moodStyle.textColor}`}>{song!.mood}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                {song!.searchUrl && (
                    <a href={song!.searchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-white/70 hover:text-blue-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      <span>Google</span>
                    </a>
                )}
                <button onClick={onRetry} className="flex items-center gap-1 text-[10px] text-white/70 hover:text-orange-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <span>{t.wrongSong || "Retry"}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SongOverlay;