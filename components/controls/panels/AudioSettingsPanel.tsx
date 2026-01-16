
import React from 'react';
import { SteppedSlider, CustomSelect } from '../ControlWidgets';
import { useAppContext } from '../../AppContext';

export const AudioSettingsPanel: React.FC = () => {
  const { 
    settings, setSettings, audioDevices, selectedDeviceId, 
    onDeviceChange, toggleMicrophone, isListening, resetAudioSettings, setActivePreset, t 
  } = useAppContext();
  
  const hints = t?.hints || {};
  const fftOptions = [
    { value: 512, label: '512' },
    { value: 1024, label: '1024' },
    { value: 2048, label: '2048' },
    { value: 4096, label: '4096' },
  ];

  const deviceOptions = [
    { value: '', label: t?.defaultMic || "Default Microphone" },
    ...audioDevices.map(d => ({ value: d.deviceId, label: d.label }))
  ];

  const handleAudioSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setActivePreset('');
  };

  return (
    <>
      {/* Col 1: Device Management */}
      <div className="p-4 pt-6 h-full flex flex-col space-y-4 border-b lg:border-b-0 lg:border-r border-white/5">
         <CustomSelect 
            label={t?.audioInput || "Input Device"}
            value={selectedDeviceId}
            options={deviceOptions}
            onChange={onDeviceChange}
            hintText={hints?.device}
         />
        <button onClick={() => toggleMicrophone(selectedDeviceId)} className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 ${isListening ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
          {isListening ? (t?.stopMic || "Stop") : (t?.startMic || "Start")}
        </button>
      </div>

      {/* Col 2: Core Processing Parameters */}
      <div className="p-4 pt-6 h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5">
        <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-2">
          <SteppedSlider label={t?.sensitivity || "Sensitivity"} hintText={hints?.sensitivity} options={[{value:settings.sensitivity, label:settings.sensitivity.toFixed(1)}]} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v: number) => handleAudioSettingChange('sensitivity', v)} />
          <SteppedSlider label={t?.smoothing || "Smoothing"} hintText={hints?.smoothing} options={[{value:settings.smoothing, label:settings.smoothing.toFixed(2)}]} value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v: number) => handleAudioSettingChange('smoothing', v)} />
          
          <div className="pt-4 border-t border-white/5">
            <SteppedSlider
                label={t?.fftSize || "Resolution"}
                hintText={hints?.fftSize || "FFT Size"}
                options={fftOptions}
                value={settings.fftSize}
                min={512}
                max={4096}
                step={512}
                onChange={(val) => handleAudioSettingChange('fftSize', val)}
            />
          </div>
        </div>
      </div>

      {/* Col 3: Actions & Advanced Info */}
      <div className="p-4 pt-6 h-full flex flex-col">
          <div className="flex-grow">
             <div className="p-4 bg-white/5 rounded-2xl">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                   {t?.audioPanel?.info || "Adjust input sensitivity and smoothing to customize how the visualizer reacts to audio dynamics. Higher FFT sizes provide more spectral detail but consume more CPU."}
                </span>
             </div>
          </div>
          <div className="mt-auto pt-4">
            <button onClick={resetAudioSettings} className="w-full py-3 bg-white/[0.04] rounded-xl text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white flex items-center justify-center gap-2 border border-transparent hover:border-white/10 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               {t?.resetAudio || "Reset Audio"}
            </button>
          </div>
      </div>
    </>
  );
};
