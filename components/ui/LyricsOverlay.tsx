import React, { useRef } from 'react';
import { VisualizerSettings, SongInfo, LyricsStyle } from '../../core/types';
import { useAudioPulse } from '../../core/hooks/useAudioPulse';

interface LyricsOverlayProps {
  settings: VisualizerSettings;
  song: SongInfo | null;
  showLyrics: boolean;
  lyricsStyle: LyricsStyle;
  analyser: AnalyserNode | null;
}

const LyricsOverlay: React.FC<LyricsOverlayProps> = ({ settings, song, showLyrics, lyricsStyle, analyser }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isEnabled = showLyrics && !!song && (!!song.lyricsSnippet || song.identified);
  
  useAudioPulse({
    elementRef: containerRef,
    analyser,
    settings,
    isEnabled: !!isEnabled,
    pulseStrength: lyricsStyle === LyricsStyle.KARAOKE ? 0.45 : 0.2,
    opacityStrength: lyricsStyle === LyricsStyle.MINIMAL ? 0.3 : 0,
    baseOpacity: lyricsStyle === LyricsStyle.MINIMAL ? 0.7 : 1.0,
  });

  if (!isEnabled) return null;
  const text = (song.lyricsSnippet || "").replace(/\[\d{2}:\d{2}(\.\d{1,3})?\]/g, '').trim();
  if (!text) return null;
  const lines = text.split('\n').slice(0, 6);

  let textClass = "";
  let fontStyle: React.CSSProperties = {
    fontFamily: settings.lyricsFont || 'Inter, sans-serif',
  };
  
  const baseSizeVw = settings.lyricsFontSize || 4;

  if (lyricsStyle === LyricsStyle.KARAOKE) {
     textClass = "font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]";
     const sizeVw = baseSizeVw;
     fontStyle = { ...fontStyle, fontSize: `min(${sizeVw}vw, ${sizeVw * 12}px)`, lineHeight: 1.3 };
  } else if (lyricsStyle === LyricsStyle.MINIMAL) {
     textClass = "font-mono text-white/80 tracking-[0.2em]";
     const sizeVw = baseSizeVw * 0.6;
     fontStyle = { ...fontStyle, fontSize: `min(${sizeVw}vw, ${sizeVw * 8.5}px)`, lineHeight: 1.8 };
  } else {
     textClass = "font-serif italic text-white drop-shadow-md";
     const sizeVw = baseSizeVw * 0.9;
     fontStyle = { ...fontStyle, fontSize: `min(${sizeVw}vw, ${sizeVw * 10}px)`, lineHeight: 1.4 };
  }

  const getPositionClasses = () => {
      const pos = settings.lyricsPosition || 'mc';
      const map: Record<string, string> = {
          // BUG FIX: Switched from absolute positioning (top/left) to Flexbox alignment (justify/items)
          // to make the position selector work correctly with the parent flex container.
          // Vertical alignment: justify-start (top), justify-center (middle), justify-end (bottom)
          // Horizontal alignment (for flex-col): items-start (left), items-center (center), items-end (right)
          tl: 'justify-start items-start text-left',
          tc: 'justify-start items-center text-center',
          tr: 'justify-start items-end text-right',
          ml: 'justify-center items-start text-left',
          mc: 'justify-center items-center text-center',
          mr: 'justify-center items-end text-right',
          bl: 'justify-end items-start text-left',
          bc: 'justify-end items-center text-center',
          br: 'justify-end items-end text-right',
      };
      return map[pos] || map.mc;
  };

  return (
    <div className={`pointer-events-none fixed inset-0 z-10 flex flex-col px-6 pt-24 pb-32 ${getPositionClasses()}`}>
      <div ref={containerRef} className="transition-transform duration-75 ease-out select-none max-w-4xl">
         {lines.map((line, i) => <p key={i} className={textClass} style={fontStyle}>{line}</p>)}
      </div>
    </div>
  );
};

export default LyricsOverlay;