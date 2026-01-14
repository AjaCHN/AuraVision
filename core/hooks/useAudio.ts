
import { useState, useRef, useEffect, useCallback } from 'react';
import { AudioDevice, VisualizerSettings, Language } from '../types';
import { TRANSLATIONS } from '../i18n';
import { createDemoAudioGraph } from '../services/audioSynthesis';

interface UseAudioProps {
  settings: VisualizerSettings;
  language: Language;
}

export const useAudio = ({ settings, language }: UseAudioProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const demoGraphRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = settings.smoothing;
      if (analyser.fftSize !== settings.fftSize) analyser.fftSize = settings.fftSize;
    }
  }, [settings.smoothing, settings.fftSize, analyser]);

  const updateAudioDevices = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioDevices(devices.filter(d => d.kind === 'audioinput').map(d => ({ deviceId: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 5)}` })));
    } catch (e) {
        console.warn("Could not enumerate audio devices", e);
    }
  }, []);

  const startMicrophone = useCallback(async (deviceId?: string) => {
    setErrorMessage(null);
    setIsSimulating(false);
    if (demoGraphRef.current) demoGraphRef.current.stop();

    try {
      const oldContext = audioContextRef.current;
      if (oldContext && oldContext.state !== 'closed') await oldContext.close();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
            deviceId: deviceId ? { exact: deviceId } : undefined, 
            echoCancellation: false, 
            noiseSuppression: false, 
            autoGainControl: false 
        } 
      });
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (context.state === 'suspended') {
        await context.resume();
      }

      const node = context.createAnalyser();
      node.fftSize = settings.fftSize;
      node.smoothingTimeConstant = settings.smoothing;
      context.createMediaStreamSource(stream).connect(node);

      audioContextRef.current = context;
      setAudioContext(context);
      setAnalyser(node);
      setMediaStream(stream);
      setIsListening(true);
      updateAudioDevices();
    } catch (err: any) {
      const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
      setErrorMessage(err.name === 'NotAllowedError' ? t.errors.accessDenied : t.errors.general);
      setIsListening(false);
      console.error("[Audio] Access Error:", err);
    }
  }, [settings.fftSize, settings.smoothing, updateAudioDevices, language]);

  const startDemoMode = useCallback(async () => {
    try {
        setErrorMessage(null);
        if (demoGraphRef.current) demoGraphRef.current.stop();

        const oldContext = audioContextRef.current;
        if (oldContext && oldContext.state !== 'closed') await oldContext.close();

        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (context.state === 'suspended') await context.resume();

        const node = context.createAnalyser();
        node.fftSize = settings.fftSize;
        node.smoothingTimeConstant = settings.smoothing;

        const silentDestination = context.createGain();
        silentDestination.gain.value = 0;
        node.connect(silentDestination);
        silentDestination.connect(context.destination);

        const demoGraph = createDemoAudioGraph(context, node);
        demoGraph.start();
        demoGraphRef.current = demoGraph;

        audioContextRef.current = context;
        setAudioContext(context);
        setAnalyser(node);
        setMediaStream(null);
        setIsListening(true);
        setIsSimulating(true);
    } catch (e) {
        console.error("Demo mode synthesis failed", e);
    }
  }, [settings.fftSize, settings.smoothing]);

  const toggleMicrophone = useCallback((deviceId: string) => {
    if (isListening) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
      if (demoGraphRef.current) demoGraphRef.current.stop();
      audioContextRef.current?.close();
      setIsListening(false);
      setIsSimulating(false);
    } else {
      startMicrophone(deviceId);
    }
  }, [isListening, mediaStream, startMicrophone]);

  return { isListening, isSimulating, audioContext, analyser, mediaStream, audioDevices, errorMessage, setErrorMessage, startMicrophone, startDemoMode, toggleMicrophone };
};
