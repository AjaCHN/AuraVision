
import { SongInfo } from '../types';

const STORAGE_KEY = 'av_fingerprints_v1';
const MAX_CACHE_SIZE = 50;
const SIMILARITY_THRESHOLD = 0.25;

interface FingerprintEntry {
  features: number[]; 
  song: SongInfo;
  timestamp: number;
}

/**
 * Generates a "Bag of Features" acoustic fingerprint from base64 audio.
 * Uses OfflineAudioContext to perform fast FFT analysis.
 */
export const generateFingerprint = async (base64Audio: string): Promise<number[]> => {
  let audioCtx: AudioContext | null = null;
  try {
    // 1. Convert Base64 to ArrayBuffer
    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    const arrayBuffer = bytes.buffer;

    // 2. Decode Audio
    // Note: Creating a new context is cheap, but decoding takes a moment.
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    // 3. Setup Offline Analysis
    const offlineCtx = new OfflineAudioContext(1, audioBuffer.length, audioBuffer.sampleRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;

    const analyser = offlineCtx.createAnalyser();
    analyser.fftSize = 1024; // Frequency resolution ~43Hz per bin at 44.1k
    analyser.smoothingTimeConstant = 0;

    source.connect(analyser);
    source.connect(offlineCtx.destination);

    // 4. Feature Extraction Loop
    const features: Set<number> = new Set();
    const sliceDuration = 0.2; // Analyze every 200ms
    const totalDuration = audioBuffer.duration;

    source.start(0);

    // We schedule "suspend" events to snapshot the frequency data
    for (let t = 0; t < totalDuration; t += sliceDuration) {
      offlineCtx.suspend(t).then(() => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);

        // Find dominant peak in relevant music range (Bass to Low-Mid)
        // Bins 0-100 cover roughly 0Hz to 4300Hz
        let maxVal = 0;
        let maxIndex = -1;
        
        // Filter out silence/noise
        for (let i = 2; i < 100; i++) {
            if (data[i] > maxVal) {
                maxVal = data[i];
                maxIndex = i;
            }
        }

        // Only store significant peaks (silence threshold ~50)
        if (maxVal > 50 && maxIndex !== -1) {
             features.add(maxIndex); 
        }
      });
    }

    await offlineCtx.startRendering();
    
    // Convert Set to Array
    return Array.from(features);

  } catch (e) {
    console.error("Fingerprint generation failed", e);
    return [];
  } finally {
    // Immediately release the hardware context to prevent leaks
    if (audioCtx) {
        try {
            await audioCtx.close();
        } catch (e) {
            console.warn("Error closing temporary decoding context", e);
        }
    }
  }
};

/**
 * Saves a successfully identified song to local storage.
 */
export const saveToLocalCache = (features: number[], song: SongInfo) => {
  if (!features || features.length < 5) return; // Ignore weak signals

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let cache: FingerprintEntry[] = raw ? JSON.parse(raw) : [];

    // Check if song already exists, update it
    const existingIndex = cache.findIndex(c => 
        c.song.title.toLowerCase() === song.title.toLowerCase() && 
        c.song.artist.toLowerCase() === song.artist.toLowerCase()
    );

    if (existingIndex >= 0) {
        cache.splice(existingIndex, 1);
    }

    // Add new entry
    const entry: FingerprintEntry = {
        features,
        song: { ...song, matchSource: 'LOCAL' }, // Ensure cached items are marked LOCAL
        timestamp: Date.now()
    };

    cache.unshift(entry); // Add to top

    // Trim
    if (cache.length > MAX_CACHE_SIZE) {
        cache = cache.slice(0, MAX_CACHE_SIZE);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Local storage save failed", e);
  }
};

/**
 * Attempts to find a matching song in the local cache.
 */
export const findLocalMatch = (features: number[]): SongInfo | null => {
  if (!features || features.length < 5) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const cache: FingerprintEntry[] = JSON.parse(raw);
    
    let bestMatch: SongInfo | null = null;
    let bestScore = 0;

    for (const entry of cache) {
       const score = calculateJaccardSimilarity(features, entry.features);
       
       if (score > bestScore) {
           bestScore = score;
           bestMatch = entry.song;
       }
    }

    if (bestScore >= SIMILARITY_THRESHOLD && bestMatch) {
        return bestMatch;
    }

    return null;

  } catch (e) {
    console.error("Local match lookup failed", e);
    return null;
  }
};

// Jaccard Similarity: Intersection over Union
function calculateJaccardSimilarity(arr1: number[], arr2: number[]): number {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    
    let intersection = 0;
    set1.forEach(val => {
        if (set2.has(val)) intersection++;
    });
    
    const union = set1.size + set2.size - intersection;
    if (union === 0) return 0;
    
    return intersection / union;
}
