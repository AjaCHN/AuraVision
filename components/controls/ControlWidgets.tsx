
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Position } from '../../core/types';

// --- Tooltips ---

interface TooltipProps {
  text: string | undefined | null;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement>;
}

export const FloatingTooltip = ({ text, visible, anchorRef }: TooltipProps) => {
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

export const TooltipArea = ({ children, text }: { children?: React.ReactNode, text: string | undefined | null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <FloatingTooltip text={text} visible={isHovered} anchorRef={containerRef} />
      {children}
    </div>
  );
};

// --- Form Elements ---

export const PositionSelector = ({ label, value, onChange, options, activeColor = 'blue' }: { 
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
            className={`aspect-square rounded flex items-center justify-center transition-all ${value === pos.value ? `${activeBgClass} text-white shadow-lg` : 'bg-white/5 text-white/20 hover:text-white/40'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${value === pos.value ? 'bg-white' : 'bg-white/20'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export const CustomSelect = ({ label, value, options, onChange, hintText }: { label: string, value: string, options: {value: string, label: string}[], onChange: (val: any) => void, hintText?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className={`space-y-1.5 relative transition-all duration-200 ${isOpen ? 'z-[60]' : 'z-10'}`} ref={dropdownRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {hintText && <FloatingTooltip text={hintText} visible={isHovered && !isOpen} anchorRef={dropdownRef} />}
      <span className="text-xs font-bold uppercase text-white/50 tracking-[0.15em] block ml-1">{label}</span>
      <button onClick={() => setIsOpen(!isOpen)} aria-haspopup="listbox" aria-expanded={isOpen} aria-label={label}
        className={`w-full flex items-center justify-between bg-white/[0.04] border ${isOpen ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-transparent hover:bg-white/[0.08]'} rounded-xl px-3 py-3 text-xs text-white/90 transition-all duration-300`}>
        <span className="truncate font-bold tracking-tight">{currentLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 text-white/40 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 z-50 bg-[#0c0c0e] border border-white/10 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-48 overflow-y-auto custom-scrollbar animate-fade-in-up py-1" role="listbox" aria-label={label}>
          {options.map((opt) => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} role="option" aria-selected={value === opt.value}
              className={`w-full px-4 py-3 text-left text-xs transition-all flex items-center justify-between ${value === opt.value ? 'bg-blue-500/20 text-blue-300' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <span className={value === opt.value ? 'font-bold' : 'font-medium'}>{opt.label}</span>
              {value === opt.value && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const SettingsToggle = ({ label, statusText, value, onChange, hintText, children, activeColor = 'blue' }: { label: string, statusText?: string, value: boolean, onChange: () => void, hintText?: string, children?: React.ReactNode, activeColor?: 'blue' | 'red' | 'green' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  let bgClass = value ? (activeColor === 'red' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : activeColor === 'green' ? 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]') : 'bg-white/10';

  return (
    <div className="bg-black/20 rounded-xl p-3 space-y-3 border border-white/5 hover:border-white/10 transition-colors">
      <div ref={containerRef} className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
         {hintText && <FloatingTooltip text={hintText} visible={isHovered} anchorRef={containerRef} />}
         <button onClick={onChange} role="switch" aria-checked={value} aria-label={label} className="w-full flex items-center justify-between text-left cursor-pointer">
           <div className="flex flex-col justify-center">
             <span className="text-xs font-black uppercase text-white/70 tracking-widest">{label}</span>
             {statusText && <span className={`text-[10px] font-medium mt-0.5 transition-colors ${value ? 'text-white' : 'text-white/30'}`}>{statusText}</span>}
           </div>
           <div className={`w-10 h-5 rounded-full relative transition-all duration-500 shrink-0 ${bgClass}`} aria-hidden="true">
             <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-500 ${value ? 'translate-x-[20px]' : 'translate-x-0'}`} />
           </div>
         </button>
      </div>
      {value && children && (<div className="animate-fade-in-up pt-3 border-t border-white/5">{children}</div>)}
    </div>
  );
};

export const Slider = ({ label, value, min, max, step, onChange, icon, hintText, unit = "" }: { 
  label: string; value: number; min: number; max: number; step: number; 
  onChange: (value: number) => void; icon?: React.ReactNode; hintText?: string; unit?: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={containerRef} className="space-y-2 relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <FloatingTooltip text={hintText} visible={isHovered} anchorRef={containerRef} />
        <div className="flex justify-between items-end text-xs text-white/40 uppercase font-black tracking-widest group-hover:text-white/70 transition-colors">
          <span className="flex items-center gap-2">
            {icon} <span className="font-bold">{label}</span>
          </span>
          <span className="text-white font-mono text-xs bg-white/10 px-2 py-0.5 rounded-md leading-none transition-all group-hover:text-blue-300 group-hover:bg-blue-500/20">
            {value.toFixed(step >= 1 ? 0 : 2)}{unit}
          </span>
        </div>
        <div className="relative h-4 flex items-center">
          <input type="range" min={min} max={max} step={step} value={value} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
            onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} onChange={(e) => onChange(parseFloat(e.target.value))} 
            className="w-full h-1 bg-transparent cursor-pointer appearance-none relative z-10" />
        </div>
      </div>
    );
};

// --- Buttons ---

export const ActionButton = ({ onClick, icon, hintText, className = "" }: { onClick: () => void, icon: React.ReactNode, hintText: string | undefined | null, className?: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const ariaLabel = hintText?.replace(/\[.*\]$/, '').trim() || "Action Button";
    return (
      <div ref={buttonRef} className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <FloatingTooltip text={hintText} visible={isHovered} anchorRef={buttonRef} />
        <button onClick={onClick} aria-label={ariaLabel} className={`w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/10 transition-all duration-300 ${className}`}>
          {icon}
        </button>
      </div>
    );
};

export const ControlPanelButton = ({ onClick, label, active, hintText }: { onClick: () => void, label: string, active: boolean, hintText?: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    return (
      <div ref={buttonRef} className="relative flex-1" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {hintText && <FloatingTooltip text={hintText} visible={isHovered} anchorRef={buttonRef} /> }
        <button onClick={onClick} aria-pressed={active}
          className={`w-full py-3 rounded-xl border text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 ${active ? 'bg-white/15 border-white/30 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/10'}`}>
          {label}
        </button>
      </div>
    );
};
