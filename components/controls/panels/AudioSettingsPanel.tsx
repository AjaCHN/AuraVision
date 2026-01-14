
import React from 'react';
import { AudioDevice, VisualizerSettings } from '../../../types';
import { CustomSelect, SettingsToggle, Slider, TooltipArea } from '../ControlWidgets';

interface AudioSettingsPanelProps {
  settings: VisualizerSettings;
  setSettings: (settings: VisualizerSettings) => void;
  audioDevices: AudioDevice[];
  selectedDeviceId: string;
  onDeviceChange: (id: string) => void;
  toggleMicrophone: () => void;
  isListening: boolean;
  resetAudioSettings: () => void;
  t: any;
}

export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = ({
  settings, setSettings, audioDevices, selectedDeviceId, onDeviceChange, toggleMicrophone, isListening, resetAudioSettings, t
}) => {
  const hints = t?.hints || {};

  return (
    <>
      <div className="p-4 pt-6 h-full flex flex-col space-y-4 border-b lg:border-b-0 lg:border-r border-white/5">
        <CustomSelect 
          label={t?.audioInput || "Input Device"} 
          value={selectedDeviceId} 
          hintText={hints?.device} 
          options={[
            { value: '', label: t?.defaultMic || "Default Microphone" }, 
            ...audioDevices.map(d => ({ value: d.deviceId, label: d.label }))
          ]} 
          onChange={onDeviceChange} 
        />
        <button onClick={toggleMicrophone} className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 ${isListening ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.02]'}`}>
          {isListening ? (t?.stopMic || "Stop") : (t?.startMic || "Start")}
        </button>
      </div>

      <div className="p-4 pt-6 h-full flex flex-col space-y-6 border-b lg:border-b-0 lg:border-r border-white/5">
        <Slider label={t?.sensitivity || "Sensitivity"} hintText={hints?.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v:any) => setSettings({...settings, sensitivity: v})} />
        <Slider label={t?.smoothing || "Smoothing"} hintText={hints?.smoothing} value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v:any) => setSettings({...settings, smoothing: v})} />
        
        <button onClick={resetAudioSettings} className="w-full py-2.5 mt-auto bg-white/[0.04] rounded-lg text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t?.resetAudio || "Reset Audio"}
        </button>
      </div>

      <TooltipArea text={hints?.fftSize || "FFT Size"}>
        <div className="p-4 pt-6 h-full flex flex-col space-y-4">
          <span className="text-xs font-bold uppercase text-white/50 tracking-[0.25em] block ml-1">{t?.fftSize || "Resolution"}</span>
          <div className="grid grid-cols-2 gap-2">
            {[512, 1024, 2048, 4096].map(size => (
              <button key={size} onClick={() => setSettings({...settings, fftSize: size})} className={`py-3 rounded-lg border text-xs font-mono font-bold transition-all duration-300 ${settings.fftSize === size ? 'bg-white/20 border-white/40 text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-white/[0.04] border-transparent text-white/40 hover:text-white hover:bg-white/[0.08]'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </TooltipArea>
    </>
  );
};
