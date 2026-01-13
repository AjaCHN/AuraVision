
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// --- Tooltips ---

interface TooltipProps {
  text: string;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement>;
}

export const FloatingTooltip = ({ text, visible, anchorRef }: TooltipProps) => {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (visible && anchorRef.current) {
      const updatePosition = () => {
        if (anchorRef.current) {
          const rect = anchorRef.current.getBoundingClientRect();
          setCoords({
            top: rect.top - 8, // 8px padding above element
            left: rect.left + rect.width / 2
          });
        }
      };
      
      updatePosition();
      // Listen to global scroll and resize to update tooltip position
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible, anchorRef]);

  if (!visible || !coords) return null;

  return createPortal(
    <div 
      className="fixed z-[9999] px-3 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-lg shadow-2xl whitespace-normal w-max max-w-[240px] text-center pointer-events-none animate-fade-in-up"
      style={{
        top: coords.top,
        left: coords.left,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-blue-600" />
    </div>,
    document.body
  );
};

export const TooltipArea = ({ children, text }: { children: React.ReactNode, text: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={containerRef}
      className="relative" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <FloatingTooltip text={text} visible={isHovered} anchorRef={containerRef} />
      {children}
    </div>
  );
};

// --- Form Elements ---

export const CustomSelect = ({ label, value, options, onChange, hintText }: { label: string, value: string, options: {value: string, label: string}[], onChange: (val: any) => void, hintText?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div 
      className={`space-y-2 relative transition-all duration-200 ${isOpen ? 'z-[60]' : 'z-10'}`} 
      ref={dropdownRef} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      {hintText && <FloatingTooltip text={hintText} visible={isHovered && !isOpen} anchorRef={dropdownRef} />}
      <span className="text-[11px] font-bold uppercase text-white/50 tracking-[0.18em] block ml-1">{label}</span>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white/[0.04] border ${isOpen ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-transparent hover:bg-white/[0.08]'} rounded-xl px-4 py-3.5 text-sm text-white/90 transition-all duration-300`}
      >
        <span className="truncate font-semibold tracking-tight">{currentLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-white/40 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 z-50 bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-56 overflow-y-auto custom-scrollbar animate-fade-in-up py-2.5">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full px-4 py-3.5 text-left text-sm transition-all flex items-center justify-between ${value === opt.value ? 'bg-blue-500/20 text-blue-300' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              <span className={value === opt.value ? 'font-bold' : 'font-medium'}>{opt.label}</span>
              {value === opt.value && <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const SettingsToggle = ({ label, statusText, value, onChange, hintText, children, activeColor = 'blue' }: { 
  label: string, 
  statusText: string, 
  value: boolean, 
  onChange: () => void, 
  hintText?: string, 
  children?: React.ReactNode,
  activeColor?: 'blue' | 'red' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const bgClass = activeColor === 'red' 
    ? (value ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/10')
    : (value ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/10');

  return (
    <div className="bg-black/20 rounded-2xl p-5 space-y-5">
      <div 
        ref={containerRef}
        className="flex items-center justify-between relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        onClick={onChange}
      >
         {hintText && <FloatingTooltip text={hintText} visible={isHovered} anchorRef={containerRef} />}
         <div className="flex flex-col">
           <span className="text-[11px] font-black uppercase text-white/60 tracking-widest">{label}</span>
           <span className="text-[9px] text-white/30 font-bold mt-0.5">{statusText}</span>
         </div>
         <button onClick={(e) => { e.stopPropagation(); onChange(); }} className={`w-12 h-6.5 rounded-full relative transition-all duration-500 ${bgClass}`}>
           <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-lg transition-all duration-500 ${value ? 'translate-x-[22px]' : 'translate-x-0 left-1'}`} />
         </button>
      </div>
      {value && children && (
         <div className="animate-fade-in-up">
           {children}
         </div>
      )}
    </div>
  );
};

export const Slider = ({ label, value, min, max, step, onChange, icon, hintText, unit = "" }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
      <div 
        ref={containerRef}
        className="space-y-3.5 relative group" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <FloatingTooltip text={hintText} visible={isHovered} anchorRef={containerRef} />
        <div className="flex justify-between items-end text-[11px] text-white/40 uppercase font-black tracking-widest group-hover:text-white/70 transition-colors">
          <span className="flex items-center gap-2">
            {icon} <span className="font-bold">{label}</span>
          </span>
          <span className="text-white font-mono text-xs bg-white/10 px-2 py-0.5 rounded-md leading-none transition-all group-hover:text-blue-300 group-hover:bg-blue-500/20">
            {value.toFixed(step >= 1 ? 0 : 2)}{unit}
          </span>
        </div>
        <div className="relative h-5 flex items-center">
          <input 
            type="range" min={min} max={max} step={step} value={value} 
            onPointerDown={(e) => e.stopPropagation()} 
            // 阻止键盘事件冒泡，确保左右箭头仅控制滑块，不触发全局快捷键
            onKeyDown={(e) => e.stopPropagation()} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            className="w-full h-1.5 bg-transparent cursor-pointer appearance-none relative z-10" 
          />
        </div>
      </div>
    );
};

// --- Buttons ---

export const ActionButton = ({ onClick, icon, hintText, className = "" }: { onClick: () => void, icon: React.ReactNode, hintText: string, className?: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    return (
      <div 
        ref={buttonRef}
        className="relative" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        <FloatingTooltip text={hintText} visible={isHovered} anchorRef={buttonRef} />
        <button onClick={onClick} className={`w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/10 transition-all duration-300 ${className}`}>
          {icon}
        </button>
      </div>
    );
};

export const ControlPanelButton = ({ onClick, label, active, hintText }: { onClick: () => void, label: string, active: boolean, hintText?: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    return (
      <div 
        ref={buttonRef}
        className="relative flex-1" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        {hintText && <FloatingTooltip text={hintText} visible={isHovered} anchorRef={buttonRef} />}
        <button 
          onClick={onClick} 
          className={`w-full py-4 rounded-xl border text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${active ? 'bg-white/15 border-white/30 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/10'}`}
        >
          {label}
        </button>
      </div>
    );
};
