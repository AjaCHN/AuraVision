
import React from 'react';
import { AudioDevice, VisualizerSettings } from '../../types';
import { CustomSelect, SettingsToggle, Slider, TooltipArea } from '../ControlWidgets';

interface AudioSettingsPanelProps {
  settings: VisualizerSettings;
  setSettings: (settings: VisualizerSettings) => void;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
  toggleMicrophone: () => void;
  isListening: boolean;
  t: any;
}

export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = ({
  settings, setSettings, audioDevices, selectedDeviceId, onDeviceChange, toggleMicrophone, isListening, t
}) => {
  return (
    <>
      <div className="p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-white/10">
        <CustomSelect 
          label={t.audioInput} 
          value={selectedDeviceId} 
          hintText={t.hints.device} 
          options={[
            { value: '', label: t.defaultMic }, 
            ...audioDevices.map(d => ({ value: d.deviceId, label: d.label }))
          ]} 
          onChange={onDeviceChange} 
        />
        <button onClick={toggleMicrophone} className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 ${isListening ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.02]'}`}>
          {isListening ? t.stopMic : t.startMic}
        </button>
        
        <SettingsToggle 
            label={t.monitorAudio} 
            statusText={settings.monitor ? 'ACTIVE' : 'MUTED'}
            value={settings.monitor}
            onChange={() => setSettings({...settings, monitor: !settings.monitor})}
            hintText={t.hints.monitor}
            activeColor="red"
        />
      </div>
      <div className="p-6 space-y-8 border-b lg:border-b-0 lg:border-r border-white/10">
        <Slider label={t.sensitivity} hintText={t.hints.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
        <Slider label={t.smoothing} hintText={t.hints.smoothing} value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v:any) => setSettings({...settings, smoothing: v})} />
        
      </div>
      <TooltipArea text={t.hints.fftSize}>
        <div className="p-6 space-y-6 h-full">
          <span className="text-xs font-black uppercase text-white/50 tracking-[0.25em] block ml-1">{t.fftSize}</span>
          <div className="grid grid-cols-2 gap-3">
            {[512, 1024, 2048, 4096].map(size => (
              <button key={size} onClick={() => setSettings({...settings, fftSize: size})} className={`py-4 rounded-xl border text-[13px] font-mono font-bold transition-all duration-300 ${settings.fftSize === size ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </TooltipArea>
    </>
  );
};
