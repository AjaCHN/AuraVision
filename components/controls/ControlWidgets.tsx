import React, { useState, useEffect, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { Position } from '../../core/types';

// --- Tooltips ---

interface TooltipProps {
  text: string | undefined | null;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement>;
}

const FloatingTooltipInternal = ({ text, visible, anchorRef }: TooltipProps) => {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [isAutoHidden, setIsAutoHidden] = useState(false);

  const isMobile = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768);

  useEffect(() => {
    if (!isMobile && visible && anchorRef.current && text) {
      const updatePosition = () => {
        if (anchorRef.current) {
          const rect = anchorRef.current.getBoundingClientRect();
          setCoords({
            top: rect.top - 8,
            left: rect.left + rect.width / 2
          });
        }
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible, anchorRef, text, isMobile]);

  useEffect(() => {
    if (visible && !isMobile) {
      setIsAutoHidden(false);
      const timer = setTimeout(() => setIsAutoHidden(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setIsAutoHidden(false);
    }
  }, [visible, isMobile]);

  if (isMobile || !visible || !coords || !text || isAutoHidden) return null;

  const match = typeof text === 'string' ? text.match(/^(.*)\s?\[(.+)\]$/) : null;
  const displayContent = match ? match[1] : text;
  const shortcutKey = match ? match[2] : null;

  return createPortal(
    <div className="fixed z-[9999] pointer-events-none" style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -100%)' }}>
      <div className="animate-fade-in-up">
        <div className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-2xl whitespace-nowrap flex items-center gap-2 relative border border-white/10">
          <span>{displayContent}</span>
          {shortcutKey && (<span className="px-1.5 py-0.5 bg-black/20 rounded border border-white/10 text-[10px] font-mono shadow-sm tracking-wider">{shortcutKey}</span>)}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-blue-600" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export const FloatingTooltip = memo(FloatingTooltipInternal);

export const TooltipArea = memo(({ children, text }: { children?: React.ReactNode, text: string | undefined | null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <FloatingTooltip text={text} visible={isHovered} anchorRef={containerRef} />
      {children}
    </div>
  );
});

// --- Form Elements ---

export const PositionSelector = memo(({ label, value, onChange, options, activeColor = 'blue' }: { 
  label: string; value: Position; onChange: (value: Position) => void; 
  options: { value: string; label: string }[]; activeColor?: 'blue' | 'green';
}) => {
  const activeBgClass = activeColor === 'blue' ? 'bg-blue-600' : 'bg-green-600';
  return (
    <div className="space-y-3" role="radiogroup" aria-label={label}>
      {label && <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.15em] block ml-1">{label}</span>}
      <div className="grid grid-cols-3 gap-1 bg-white/[0.02] p-2 rounded-xl border border-white/5 max-w-[160px]">
        {options.map(pos => (
          <button key={pos.value} onClick={() => onChange(pos.value as Position)} title={pos.label} aria-label={pos.label} role="radio" aria-checked={value === pos.value}
            className={`aspect-[4/3] rounded flex items-center justify-center transition-all ${value === pos.value ? `${activeBgClass} text-white shadow-lg` : 'bg-white/5 text-white/20 hover:text-white/40'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${value === pos.value ? 'bg-white' : 'bg-white/20'}`} />
          </button>
        ))}
      </div>
    </div>
  );
});

export const SettingsToggle = memo(({ label, value, onChange, activeColor = 'blue', hintText, statusText, children }: {
  label: string; value: boolean; onChange: () => void; activeColor?: string; hintText?: string; statusText?: string; children?: React.ReactNode
}) => {
  const activeBg = activeColor === 'green' ? 'bg-green-500' : 'bg-blue-600';
  return (
    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between min-h-[24px]">
        <TooltipArea text={hintText}>
          <span className="text-xs font-bold text-white/70 leading-none">{label}</span>
        </TooltipArea>
        <button 
          onClick={onChange} 
          className={`relative w-9 h-5 rounded-full transition-all duration-200 ease-in-out focus:outline-none flex items-center shrink-0 ${value ? activeBg : 'bg-white/10'}`}
          role="switch" 
          aria-checked={value}
          aria-label={label}
        >
          <span className={`inline-block w-3 h-3 transform transition-transform duration-200 ease-in-out bg-white rounded-full ${value ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
      </div>
      {statusText && <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest text-right mt-1">{statusText}</div>}
      {value && children && <div className="mt-3 pt-3 border-t border-white/5 animate-fade-in-up">{children}</div>}
    </div>
  );
});

export const Slider = memo(({ label, value, min, max, step, onChange, unit = '', hintText }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (val: number) => void; unit?: string; hintText?: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <TooltipArea text={hintText}>
        <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.15em] ml-1">{label}</span>
      </TooltipArea>
      <span className="text-[10px] font-mono text-white/80">{value.toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0)}{unit}</span>
    </div>
    <div className="group relative flex items-center h-6 w-full">
        <input 
            type="range" 
            min={min} max={max} step={step} 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            className="absolute w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={label}
        />
        <div className="w-full h-1.5 bg-white/10 rounded-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
        </div>
        <div className="absolute h-3 w-3 bg-white rounded-full shadow-lg transform -translate-x-1.5 pointer-events-none transition-all group-hover:scale-125" style={{ left: `${((value - min) / (max - min)) * 100}%` }} />
    </div>
  </div>
));

export const SteppedSlider = memo(({ label, value, min, max, step, onChange, options, hintText }: {
    label: string; value: number; min: number; max: number; step: number; onChange: (val: number) => void; options?: {value: number, label: string}[]; hintText?: string;
}) => {
    const isDiscrete = options && options.length > 1;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newVal = parseFloat(e.target.value);
        if (isDiscrete && options) {
            const closest = options.reduce((prev, curr) => 
                Math.abs(curr.value - newVal) < Math.abs(prev.value - newVal) ? curr : prev
            );
            newVal = closest.value;
        }
        onChange(newVal);
    };

    let displayLabel = value.toString();
    if (options) {
        const match = options.find(o => o.value === value);
        if (match) displayLabel = match.label;
        else if (!isDiscrete && options.length === 1) displayLabel = options[0].label;
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <TooltipArea text={hintText}>
                    <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.15em] ml-1">{label}</span>
                </TooltipArea>
                <span className="text-[10px] font-mono text-white/80">{displayLabel}</span>
            </div>
            <div className="relative flex items-center h-6 w-full group">
                <input 
                    type="range" 
                    min={min} max={max} step={step} 
                    value={value} 
                    onChange={handleChange} 
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                    aria-label={label}
                />
                 <div className="w-full h-1.5 bg-white/10 rounded-lg overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
                </div>
                {isDiscrete && options && (
                    <div className="absolute w-full h-full pointer-events-none flex justify-between px-1">
                        {options.map(o => (
                            <div key={o.value} className={`w-0.5 h-1.5 mt-0.5 rounded-full ${o.value <= value ? 'bg-white/50' : 'bg-white/10'}`} style={{ left: `${((o.value - min) / (max - min)) * 100}%`, position: 'absolute' }} />
                        ))}
                    </div>
                )}
                 <div className="absolute h-3 w-3 bg-white rounded-full shadow-lg transform -translate-x-1.5 pointer-events-none transition-all group-hover:scale-125 z-10" style={{ left: `${((value - min) / (max - min)) * 100}%` }} />
            </div>
        </div>
    );
});

export const CustomSelect = memo(({ label, value, options, onChange, hintText }: {
  label: string; value: string | number; options: { value: string | number; label: string }[]; onChange: (val: any) => void; hintText?: string;
}) => (
  <div className="space-y-2">
    <TooltipArea text={hintText}>
      <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.15em] block ml-1">{label}</span>
    </TooltipArea>
    <div className="relative">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white uppercase tracking-wider appearance-none focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
        aria-label={label}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[#0f0f11] text-white">{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
));

export const ActionButton = memo(({ onClick, hintText, icon }: { onClick: () => void; hintText: string; icon: React.ReactNode }) => (
  <TooltipArea text={hintText}>
    <button 
      onClick={onClick} 
      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 hover:border-white/20 flex items-center justify-center transition-all duration-300"
      aria-label={hintText}
    >
      {icon}
    </button>
  </TooltipArea>
));