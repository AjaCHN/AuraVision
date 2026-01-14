
import { useState, useRef, useEffect, useCallback } from 'react';
import { AudioDevice, VisualizerSettings, Language } from '../types';
import { TRANSLATIONS } from '../i18n';

interface UseAudioProps {
  settings: VisualizerSettings;
  language: Language;
}

export const useAudio = ({ settings, language }: UseAudioProps) => {
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Sync Analyser settings
  useEffect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = settings.smoothing;
      if (analyser.fftSize !== settings.fftSize) {
        analyser.fftSize = settings.fftSize;
      }
    }
  }, [settings.smoothing, settings.fftSize, analyser]);

  // Auto-resume AudioContext on visibility change (Mobile Safari fix)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      const ctx = audioContextRef.current;
      if (document.visibilityState === 'visible' && ctx && ctx.state === 'suspended' && isListening) {
         try {
           await ctx.resume();
           console.log("AudioContext resumed after visibility change.");
         } catch (e) {
           console.warn("Failed to resume AudioContext", e);
         }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isListening]);

  const updateAudioDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices
        .filter(d => d.kind === 'audioinput')
        .map(d => ({ deviceId: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 5)}` }));
      setAudioDevices(inputs);
    } catch (e) {
      console.warn("Device fetch warning:", e);
    }
  }, []);

  useEffect(() => {
    updateAudioDevices();
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', updateAudioDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', updateAudioDevices);
      };
    }
  }, [updateAudioDevices]);

  const startMicrophone = useCallback(async (deviceId?: string) => {
    setErrorMessage(null);
    try {
      let stream: MediaStream;

      const oldContext = audioContextRef.current;
      if (oldContext) {
        audioContextRef.current = null;
        if (oldContext.state !== 'closed') {
          try { await oldContext.close(); } catch(e) { console.warn("Error closing old context", e); }
        }
      }

      try {
          const constraints: MediaStreamConstraints = { 
              audio: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
              }
          };
          stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e: any) {
           if (deviceId && (e.name === 'OverconstrainedError' || e.name === 'NotFoundError' || e.name === 'NotReadableError')) {
               console.warn(`Device ${deviceId} unavailable, falling back to default.`);
               const fallbackConstraints = { 
                   audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
               };
               stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
           } else {
               throw e;
           }
      }
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (context.state === 'suspended') {
        await context.resume();
      }

      const src = context.createMediaStreamSource(stream);
      const node = context.createAnalyser();
      node.fftSize = settings.fftSize;
      node.smoothingTimeConstant = settings.smoothing;
      
      src.connect(node);
      
      // Removed monitor node logic to prevent feedback loops

      audioContextRef.current = context;
      setAudioContext(context);
      setAnalyser(node);
      setMediaStream(stream);
      setIsListening(true);
      updateAudioDevices();

    } catch (err: any) {
      const t = TRANSLATIONS[language];
      const isPermissionError = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      
      console.warn(isPermissionError ? "Permission denied" : "Audio init error", err);
      setIsListening(false);
      
      let msg = t.errors.general;
      if (isPermissionError) msg = t.errors.accessDenied;
      else if (err.name === 'NotFoundError') msg = t.errors.noDevice;
      else if (err.name === 'NotReadableError') msg = t.errors.deviceBusy;
      else if (err.message) msg = err.message;
      
      setErrorMessage(msg);
    }
  }, [settings.fftSize, settings.smoothing, updateAudioDevices, language]);

  const toggleMicrophone = useCallback((deviceId: string) => {
    if (isListening) {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
      const oldContext = audioContextRef.current;
      if (oldContext) {
        audioContextRef.current = null;
        if (oldContext.state !== 'closed') {
           oldContext.close().catch(e => console.warn("Error closing context on toggle", e));
        }
      }
      setAudioContext(null);
      setIsListening(false);
    } else {
      startMicrophone(deviceId);
    }
  }, [isListening, mediaStream, startMicrophone]);

  // Cleanup
  useEffect(() => {
    return () => {
      const ctx = audioContextRef.current;
      if (ctx && ctx.state !== 'closed') {
        ctx.close().catch(e => console.warn("Error closing context on unmount", e));
      }
    };
  }, []);

  return {
    isListening,
    audioContext,
    analyser,
    mediaStream,
    audioDevices,
    errorMessage,
    setErrorMessage,
    startMicrophone,
    toggleMicrophone
  };
};
