
import React, { useRef, useEffect } from 'react';
import { VisualizerSettings, SongInfo, LyricsStyle } from '../../types';

interface LyricsOverlayProps {
  settings: VisualizerSettings;
  song: SongInfo | null;
  showLyrics: boolean;
  lyricsStyle: LyricsStyle;
  analyser: AnalyserNode | null;
}

const LyricsOverlay: React.FC<LyricsOverlayProps> = ({ settings, song, showLyrics, lyricsStyle, analyser }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (!showLyrics || !song || (!song.lyricsSnippet && !song.identified)) {
        return;
    }

    const animate = () => {
      if (containerRef.current && analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        // Bass calculation for scale pulsing
        let bass = 0;
        for (let i = 0; i < 12; i++) bass += dataArray[i];
        const bassNormalized = (bass / 12) / 255;

        const sensitivity = settings.sensitivity;
        // Stronger pulse for Karaoke mode
        const pulseStrength = lyricsStyle === LyricsStyle.KARAOKE ? 0.45 : 0.2;
        const scale = 1.0 + (bassNormalized * pulseStrength * sensitivity);
        
        // Apply transforms
        containerRef.current.style.transform = `scale(${scale})`;
        
        // Dynamic opacity for Minimal mode
        if (lyricsStyle === LyricsStyle.MINIMAL) {
             containerRef.current.style.opacity = `${0.7 + bassNormalized * 0.3}`;
        } else {
             containerRef.current.style.opacity = '1';
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [showLyrics, song, lyricsStyle, settings.sensitivity, analyser]);

  if (!showLyrics || !song || (!song.lyricsSnippet && !song.identified)) return null;

  const text = (song.lyricsSnippet || "").replace(/\[\d{2}:\d{2}(\.\d{1,3})?\]/g, '').trim();
  if (!text) return null;
  
  // Show first 6 lines of lyrics
  const lines = text.split('\n').slice(0, 6);

  // Dynamic styling based on mode
  let containerClass = "flex flex-col items-center text-center transition-transform duration-75 ease-out select-none px-4";
  let textClass = "";
  let fontStyle: React.CSSProperties = {};

  if (lyricsStyle === LyricsStyle.KARAOKE) {
     textClass = "font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]";
     fontStyle = { fontFamily: '"Inter", sans-serif', fontSize: 'min(5vw, 48px)', lineHeight: 1.3 };
  } else if (lyricsStyle === LyricsStyle.MINIMAL) {
     textClass = "font-mono text-white/80 tracking-[0.2em]";
     fontStyle = { fontSize: 'min(2.5vw, 20px)', lineHeight: 1.8 };
  } else {
     textClass = "font-serif italic text-white drop-shadow-md";
     fontStyle = { fontSize: 'min(4vw, 36px)', lineHeight: 1.4 };
  }

  // Positioning Logic
  let positionClass = "justify-center"; // Default center
  if (settings.lyricsPosition === 'top') {
      positionClass = "justify-start pt-32 lg:pt-24";
  } else if (settings.lyricsPosition === 'bottom') {
      positionClass = "justify-end pb-48 lg:pb-36";
  }

  return (
    <div className={`pointer-events-none fixed inset-0 z-10 flex ${positionClass} overflow-hidden`}>
      {/* Background radial gradient to improve readability on busy visualizers */}
      <div className="absolute inset-0 bg-radial-gradient from-black/40 to-transparent opacity-60 pointer-events-none" />
      
      <div ref={containerRef} className={containerClass}>
         {lines.map((line, i) => (
             <p key={i} className={textClass} style={fontStyle}>{line}</p>
         ))}
      </div>
    </div>
  );
};

export default LyricsOverlay;
