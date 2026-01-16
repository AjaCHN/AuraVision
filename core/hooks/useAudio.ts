
/**
 * File: core/hooks/useAudio.ts
 * Version: 0.7.2
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

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
  const streamRef = useRef<MediaStream | null>(null);

  const stopListening = useCallback(() => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (demoGraphRef.current) demoGraphRef.current.stop();
    if (audioContextRef.current) {
        audioContextRef.current.close().catch(e => console.warn("Error closing AudioContext", e));
        audioContextRef.current = null;
    }
    setIsListening(false);
    setIsSimulating(false);
    setMediaStream(null);
  }, []);

  // Resilience: Monitor AudioContext state changes (especially for mobile focus loss)
  const attemptResume = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log("[Audio] Context resumed successfully.");
      } catch (e) {
        console.warn("[Audio] Resume failed:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isListening) {
        attemptResume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isListening, attemptResume]);


  const updateAudioDevices = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAudioDevices(devices.filter(d => d.kind === 'audioinput').map(d => ({ deviceId: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 5)}` })));
    } catch (e) {
        console.warn("Could not enumerate audio devices", e);
    }
  }, []);
  
  useEffect(() => {
    navigator.mediaDevices?.addEventListener('devicechange', updateAudioDevices);
    return () => navigator.mediaDevices?.removeEventListener('devicechange', updateAudioDevices);
  }, [updateAudioDevices]);

  const startMicrophone = useCallback(async (deviceId?: string) => {
    setErrorMessage(null);
    if (isListening) stopListening();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
            deviceId: deviceId ? { exact: deviceId } : undefined, 
            echoCancellation: false, 
            noiseSuppression: false, 
            autoGainControl: false 
        } 
      });
      streamRef.current = stream;

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
          audioTrack.onended = () => {
              console.log("Audio track ended. Stopping listener.");
              stopListening();
          };
      }
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Monitor state for debugging and recovery
      context.onstatechange = () => {
          console.log(`[Audio] State changed: ${context.state}`);
          if (context.state === 'suspended' && isListening) {
              // Potential recovery trigger could go here
          }
      };

      if (context.state === 'suspended') await context.resume();

      const node = context.createAnalyser();
      node.fftSize = settings.fftSize;
      node.smoothingTimeConstant = settings.smoothing;
      context.createMediaStreamSource(stream).connect(node);

      audioContextRef.current = context;
      setAudioContext(context);
      setAnalyser(node);
      setMediaStream(stream);
      setIsListening(true);
      setIsSimulating(false);
      updateAudioDevices();
    } catch (err: any) {
      const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
      setErrorMessage(err.name === 'NotAllowedError' ? t.errors.accessDenied : t.errors.general);
      setIsListening(false);
      console.error("[Audio] Access Error:", err);
    }
  }, [settings.fftSize, settings.smoothing, updateAudioDevices, language, isListening, stopListening]);

  const startDemoMode = useCallback(async () => {
    setErrorMessage(null);
    if (isListening) stopListening();

    try {
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
  }, [settings.fftSize, settings.smoothing, isListening, stopListening]);

  const toggleMicrophone = useCallback((deviceId: string) => {
    if (isListening) {
      stopListening();
    } else {
      startMicrophone(deviceId);
    }
  }, [isListening, startMicrophone, stopListening]);
  
  useEffect(() => {
    if (analyser) {
      analyser.smoothingTimeConstant = settings.smoothing;
      if (analyser.fftSize !== settings.fftSize) analyser.fftSize = settings.fftSize;
    }
  }, [settings.smoothing, settings.fftSize, analyser]);

  return { isListening, isSimulating, audioContext, analyser, mediaStream, audioDevices, errorMessage, setErrorMessage, startMicrophone, startDemoMode, toggleMicrophone };
};
