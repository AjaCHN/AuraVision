import React, { useEffect, useRef, useMemo } from 'react';
import { SongInfo, LyricsStyle, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface SongOverlayProps {
  song: SongInfo | null;
  lyricsStyle: LyricsStyle;
  showLyrics: boolean;
  language: Language;
  onRetry: () => void;
  onClose: () => void;
  analyser?: AnalyserNode | null;
  sensitivity?: number;
}

const getMoodStyle = (mood: string) => {
  const m = mood.toLowerCase();
  
  // Happy / Upbeat / Energetic -> Yellow/Orange Sun
  if (m.match(/happy|upbeat|energetic|dance|party|fun|joy|pop/)) {
    return {
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-400',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      badgeGradient: 'from-yellow-500/20 to-orange-500/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 animate-[spin_4s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    };
  }
  
  // Sad / Calm / Melancholy -> Blue/Indigo Moon
  if (m.match(/sad|melancholy|calm|slow|soft|ballad|emotional/)) {
    return {
      textColor: 'text-blue-300',
      borderColor: 'border-blue-400',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      badgeGradient: 'from-blue-500/20 to-indigo-500/20',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
         </svg>
      )
    };
  }
  
  // Romantic / Love -> Pink/Red Heart
  if (m.match(/love|romantic|soul|r&b|sexy|passion/)) {
    return {
      textColor: 'text-pink-300',
      borderColor: 'border-pink-400',
      gradient: 'from-pink-500/20 to-rose-500/20',
      badgeGradient: 'from-pink-500/20 to-rose-500/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      )
    };
  }
  
  // Intense / Angry / Rock -> Red Fire
  if (m.match(/angry|aggressive|rock|metal|punk|dark|intense|power/)) {
    return {
      textColor: 'text-red-400',
      borderColor: 'border-red-500',
      gradient: 'from-red-600/20 to-orange-600/20',
      badgeGradient: 'from-red-600/20 to-orange-600/20',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
         </svg>
      )
    };
  }
  
  // Chill / Relax / Nature -> Emerald Leaf
  if (m.match(/chill|relax|ambient|jazz|lo-fi|nature|atmospheric/)) {
    return {
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-400',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      badgeGradient: 'from-emerald-500/20 to-teal-500/20',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
         </svg>
      )
    };
  }

  // Default -> Purple Music Note
  return {
    textColor: 'text-purple-300',
    borderColor: 'border-blue-500', // Default brand color
    gradient: 'from-purple-500/10 to-blue-500/10',
    badgeGradient: 'from-purple-500/20 to-blue-500/20',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
        </svg>
    )
  };
};

const SongOverlay: React.FC<SongOverlayProps> = ({ 
  song, 
  lyricsStyle, 
  showLyrics, 
  language, 
  onRetry, 
  onClose,
  analyser,
  sensitivity = 1.0
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const requestRef = useRef<number>(0);

  const moodStyle = useMemo(() => {
    return song && song.mood ? getMoodStyle(song.mood) : getMoodStyle('default');
  }, [song]);

  useEffect(() => {
    if (!analyser || !song || !song.identified || !showLyrics) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const pulseTitle = () => {
      if (!titleRef.current) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate bass intensity (first few bins)
      let bass = 0;
      const bassBins = 10;
      for (let i = 0; i < bassBins; i++) {
        bass += dataArray[i];
      }
      bass /= bassBins;
      
      // Map bass to a subtle scale factor (1.0 to 1.05)
      const intensity = (bass / 255) * sensitivity;
      const scale = 1 + (intensity * 0.05);
      
      titleRef.current.style.transform = `scale(${scale})`;
      
      requestRef.current = requestAnimationFrame(pulseTitle);
    };

    requestRef.current = requestAnimationFrame(pulseTitle);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [analyser, song, showLyrics, sensitivity]);

  // If lyrics are hidden or no song is identified, hide the entire overlay
  if (!showLyrics || !song || !song.identified) return null;

  const t = TRANSLATIONS[language];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {/* Song Info Badge */}
      <div className={`absolute top-8 left-8 bg-black/40 backdrop-blur-md border-l-4 ${moodStyle.borderColor} pl-4 py-3 pr-4 rounded-r-xl max-w-xs md:max-w-md transition-all duration-700 transform translate-y-0 opacity-100 shadow-[0_4px_10px_rgba(0,0,0,0.5)] pointer-events-auto group`}>
        
        {/* Subtle Mood Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-r ${moodStyle.gradient} opacity-20 pointer-events-none rounded-r-xl transition-all duration-1000`} />

        {/* Close Button (Visible on Hover) */}
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-white/20 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
          title={t.close}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
            <h2 
              ref={titleRef}
              className="text-white font-bold text-xl md:text-2xl truncate tracking-tight pr-6 origin-left transition-transform duration-75 ease-out"
            >
              {song.title}
            </h2>
            <p className="text-blue-300 text-sm md:text-base truncate font-medium pr-6">{song.artist}</p>
            
            {song.mood && (
              <div className="flex items-center gap-2 mt-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${moodStyle.badgeGradient} border border-white/10 rounded-full transition-colors duration-500`}>
                   <span className={moodStyle.textColor}>
                     {moodStyle.icon}
                   </span>
                   <span className={`text-[10px] font-bold uppercase tracking-wider ${moodStyle.textColor}`}>
                     {song.mood}
                   </span>
                </div>
              </div>
            )}

            {/* Footer Actions Row */}
            <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/10 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {song.searchUrl && (
                    <a href={song.searchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-white/70 hover:text-blue-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Google</span>
                    </a>
                )}

                <button 
                    onClick={onRetry}
                    className="flex items-center gap-1 text-[10px] text-white/70 hover:text-orange-400 transition-colors"
                    title={t.wrongSong}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{t.wrongSong}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SongOverlay;