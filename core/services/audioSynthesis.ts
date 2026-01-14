
export const createDemoAudioGraph = (context: AudioContext, node: AnalyserNode) => {
  // 1. Bass (Sawtooth)
  const oscBass = context.createOscillator();
  oscBass.type = 'sawtooth';
  oscBass.frequency.value = 55; // A1
  
  const gainBass = context.createGain();
  gainBass.gain.value = 0; 
  
  // LFO for rhythmic pulsing (120 BPM)
  const lfoBass = context.createOscillator();
  lfoBass.type = 'square';
  lfoBass.frequency.value = 2.0; 
  
  const lfoBassGain = context.createGain();
  lfoBassGain.gain.value = 1.0; 
  
  lfoBass.connect(lfoBassGain);
  lfoBassGain.connect(gainBass.gain);
  oscBass.connect(gainBass);
  gainBass.connect(node);

  // 2. Melody/Mids (Triangle)
  const oscMid = context.createOscillator();
  oscMid.type = 'triangle';
  oscMid.frequency.value = 220; // A3
  
  const lfoArp = context.createOscillator();
  lfoArp.type = 'square';
  lfoArp.frequency.value = 6;
  const lfoArpGain = context.createGain();
  lfoArpGain.gain.value = 110;
  lfoArp.connect(lfoArpGain);
  lfoArpGain.connect(oscMid.frequency);
  
  const gainMid = context.createGain();
  gainMid.gain.value = 0.2;
  oscMid.connect(gainMid);
  gainMid.connect(node);

  // 3. Highs/Atmosphere (Filtered Noise)
  const bufferSize = context.sampleRate * 2; 
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
  }
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filterHigh = context.createBiquadFilter();
  filterHigh.type = 'highpass';
  filterHigh.frequency.value = 5000;
  const gainNoise = context.createGain();
  gainNoise.gain.value = 0.1;
  
  noise.connect(filterHigh);
  filterHigh.connect(gainNoise);
  gainNoise.connect(node);

  return {
    start: () => {
      oscBass.start();
      lfoBass.start();
      oscMid.start();
      lfoArp.start();
      noise.start();
    },
    stop: () => {
      oscBass.stop();
      lfoBass.stop();
      oscMid.stop();
      lfoArp.stop();
      noise.stop();
    }
  };
};
