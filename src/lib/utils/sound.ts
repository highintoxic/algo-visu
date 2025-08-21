// Sound engine for sorting visualizer
import * as Tone from 'tone';

let synth: Tone.Synth | null = null;
let currentSoundType = 'sine';

export const SOUND_TYPES = {
    'none': 'No Sound',
    'sine': 'Sine Wave',
    'square': 'Square Wave',
    'sawtooth': 'Sawtooth Wave',
    'triangle': 'Triangle Wave'
};

export const startAudioContext = async () => {
    try {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        if (!synth && currentSoundType !== 'none') {
            synth = new Tone.Synth({
                oscillator: { type: currentSoundType as any },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.5 }
            }).toDestination();
        }
    } catch (error) {
        console.error("Failed to start audio context:", error);
    }
};

export const setSoundType = (soundType: string) => {
    currentSoundType = soundType;
    
    // Dispose of existing synth
    if (synth) {
        synth.dispose();
        synth = null;
    }
    
    // Create new synth with the selected sound type (unless it's 'none')
    if (soundType !== 'none') {
        try {
            synth = new Tone.Synth({
                oscillator: { type: soundType as any },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.5 }
            }).toDestination();
        } catch (error) {
            console.error("Failed to create synth:", error);
        }
    }
};

export const mapValueToFrequency = (value: number) => (value / 100) * (800 - 150) + 150;

export const playSound = (value: number, type: string) => {
    if (synth && currentSoundType !== 'none') {
        try {
            const freq = mapValueToFrequency(value);
            synth.triggerAttackRelease(freq * (type === 'swap' ? 1.2 : 1), '16n');
        } catch (error) {
            console.error("Failed to play sound:", error);
        }
    }
};
