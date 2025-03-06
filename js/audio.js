/**
 * Musical Spells - A musical memory game with wizards
 * Copyright (C) 2025 Alberto Pérez García-Plaza
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * audio.js - Audio management for Musical Spells
 */

// Available notes and sounds
export const ALL_NOTES = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];

export const NOTE_SOUNDS = {
    'do': 261.63,  // C4
    're': 293.66,  // D4
    'mi': 329.63,  // E4
    'fa': 349.23,  // F4
    'sol': 392.00, // G4
    'la': 440.00,  // A4
    'si': 493.88   // B4
};

// Mapping between American notation keys and our notes
export const KEYBOARD_MAPPING = {
    'c': 'do',  // C for Do
    'd': 're',  // D for Re
    'e': 'mi',  // E for Mi
    'f': 'fa',  // F for Fa
    'g': 'sol', // G for Sol
    'a': 'la',  // A for La
    'b': 'si'   // B for Si
};

// Class for audio management
export class AudioManager {
    constructor() {
        this.audioContext = null;
    }

    // Initialize the audio context
    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.audioContext;
    }

    // Play a musical note
    playNote(note, duration = 0.5, noteButton = null) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = NOTE_SOUNDS[note];
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configure simple ADSR envelope
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.3, now + duration - 0.05);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
        
        // Start and stop
        oscillator.start();
        oscillator.stop(now + duration);
        
        // If a button is provided, add visual effect
        if (noteButton) {
            noteButton.classList.add('active');
            setTimeout(() => {
                noteButton.classList.remove('active');
            }, duration * 1000);
        }
    }

    // Play sound effects
    playSoundEffect(type) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        const now = this.audioContext.currentTime;
        
        switch (type) {
            case 'success':
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.2);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start();
                oscillator.stop(now + 0.3);
                break;
                
            case 'fail':
                oscillator.frequency.setValueAtTime(220, now);
                oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.2);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start();
                oscillator.stop(now + 0.3);
                break;
                
            case 'win':
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start();
                oscillator.stop(now + 0.3);
                break;
                
            case 'lose':
                oscillator.frequency.setValueAtTime(220, now);
                oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(55, now + 0.2);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start();
                oscillator.stop(now + 0.3);
                break;
        }
    }
}