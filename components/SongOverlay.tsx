
import React, { useEffect, useRef } from 'react';
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
      <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md border-l-4 border-blue-500 pl-4 py-3 pr-4 rounded-r-xl max-w-xs md:max-w-md transition-all duration-700 transform translate-y-0 opacity-100 shadow-[0_4px_10px_rgba(0,0,0,0.5)] pointer-events-auto group">
        
        {/* Close Button (Visible on Hover) */}
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-white/20 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
          title={t.close}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 
          ref={titleRef}
          className="text-white font-bold text-xl md:text-2xl truncate tracking-tight pr-6 origin-left transition-transform duration-75 ease-out"
        >
          {song.title}
        </h2>
        <p className="text-blue-300 text-sm md:text-base truncate font-medium pr-6">{song.artist}</p>
        
        {song.mood && (
          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
               </svg>
               <span className="text-[10px] font-bold uppercase tracking-wider text-purple-100/90">
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
  );
};

export default SongOverlay;
