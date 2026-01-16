/**
 * File: core/hooks/useAppState.ts
 * Version: 0.7.5
 * Author: Aura Vision Team
 * Copyright (c) 2024 Aura Vision. All rights reserved.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Language, Region } from '../types';
import { TRANSLATIONS } from '../i18n';

const ONBOARDING_KEY = 'has_onboarded';
const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Detects the most appropriate UI language based on browser settings.
 */
const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
  
  const fullLang = navigator.language.toLowerCase();
  const primaryLang = fullLang.split('-')[0] as Language;
  
  // Supported languages list (matches Language type in core/types)
  const supported: Language[] = ['en', 'zh', 'tw', 'ja', 'es', 'ko', 'de', 'fr', 'ar', 'ru'];

  // Priority Check 1: Traditional Chinese Variants
  if (fullLang.includes('zh-tw') || fullLang.includes('zh-hk') || fullLang.includes('zh-hant')) {
    return 'tw';
  }

  // Priority Check 2: Direct match or primary language match
  if (supported.includes(primaryLang)) {
    return primaryLang;
  }

  return DEFAULT_LANGUAGE;
};

/**
 * Maps language to a sensible default region for AI search grounding.
 */
const detectDefaultRegion = (lang: Language): Region => {
  switch (lang) {
    case 'zh': return 'CN';
    case 'tw': return 'CN';
    case 'ja': return 'JP';
    case 'ko': return 'KR';
    case 'es': return 'LATAM';
    case 'de': return 'EU';
    case 'fr': return 'EU';
    default: return 'global';
  }
};

export const useAppState = () => {
  const { getStorage, setStorage, clearStorage } = useLocalStorage();

  const [hasStarted, setHasStarted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !getStorage(ONBOARDING_KEY, false));
  const [isUnsupported, setIsUnsupported] = useState(false);
  
  // Initialize language: LocalStorage > Browser Detection > Fallback
  const [language, setLanguage] = useState<Language>(() => {
    const saved = getStorage<Language | null>('language', null);
    if (saved) return saved;
    return detectBrowserLanguage();
  });

  // Initialize region based on detected/saved language
  const [region, setRegion] = useState<Region>(() => {
    const saved = getStorage<Region | null>('region', null);
    if (saved) return saved;
    return detectDefaultRegion(language);
  });

  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    setStorage('language', language);
  }, [language, setStorage]);

  useEffect(() => {
    setStorage('region', region);
  }, [region, setStorage]);

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE], [language]);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    setStorage(ONBOARDING_KEY, true);
  }, [setStorage]);

  const manageWakeLock = useCallback(async (enabled: boolean) => {
    if (!('wakeLock' in navigator)) return;
    try {
      if (enabled && !wakeLockRef.current) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } else if (!enabled && wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch (err) {
      console.warn("WakeLock Error:", err);
    }
  }, []);

  const resetSettings = useCallback(() => {
    clearStorage();
    window.location.reload();
  }, [clearStorage]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsUnsupported(true);
    }
  }, []);

  return {
    hasStarted, setHasStarted,
    showOnboarding, setShowOnboarding,
    isUnsupported,
    language, setLanguage,
    region, setRegion,
    t,
    manageWakeLock,
    handleOnboardingComplete,
    resetSettings
  };
};