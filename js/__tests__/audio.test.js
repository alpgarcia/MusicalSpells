import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AudioManager, ALL_NOTES, NOTE_SOUNDS } from '../audio.js';

describe('AudioManager', () => {
    let audioManager;
    let mockAudioContext;
    let mockOscillator;
    let mockGainNode;

    beforeEach(() => {
        // Mock Web Audio API
        mockOscillator = {
            connect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
            type: 'sine',
            frequency: {
                value: 0,
                setValueAtTime: jest.fn(),
                exponentialRampToValueAtTime: jest.fn()
            }
        };

        mockGainNode = {
            connect: jest.fn(),
            gain: {
                setValueAtTime: jest.fn(),
                linearRampToValueAtTime: jest.fn()
            }
        };

        mockAudioContext = {
            createOscillator: jest.fn(() => mockOscillator),
            createGain: jest.fn(() => mockGainNode),
            destination: {},
            currentTime: 0
        };

        global.AudioContext = jest.fn(() => mockAudioContext);
        audioManager = new AudioManager();
        audioManager.initAudio();
    });

    test('initAudio debería inicializar el contexto de audio', () => {
        expect(audioManager.audioContext).toBeDefined();
        expect(global.AudioContext).toHaveBeenCalled();
    });

    test('playNote debería configurar correctamente el oscilador y la envolvente ADSR', () => {
        const duration = 0.5; // duración por defecto
        audioManager.playNote('do');

        // Verificar configuración básica
        expect(mockOscillator.type).toBe('sine');
        expect(mockOscillator.frequency.value).toBe(NOTE_SOUNDS['do']);
        expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
        expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
        
        // Verificar envolvente ADSR
        const now = mockAudioContext.currentTime;
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, now);
        expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.5, now + 0.05);
        expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.3, now + duration - 0.05);
        expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, now + duration);
        
        // Verificar inicio y fin
        expect(mockOscillator.start).toHaveBeenCalled();
        expect(mockOscillator.stop).toHaveBeenCalledWith(now + duration);
    });

    test('playSoundEffect debería configurar correctamente los efectos de sonido', () => {
        const now = mockAudioContext.currentTime;
        
        audioManager.playSoundEffect('success');
        expect(mockOscillator.frequency.setValueAtTime)
            .toHaveBeenCalledWith(440, now);
        expect(mockOscillator.frequency.exponentialRampToValueAtTime)
            .toHaveBeenCalledWith(880, now + 0.2);
        expect(mockGainNode.gain.setValueAtTime)
            .toHaveBeenCalledWith(0.2, now);
        expect(mockGainNode.gain.linearRampToValueAtTime)
            .toHaveBeenCalledWith(0, now + 0.3);
            
        jest.clearAllMocks(); // Limpiar los mocks antes del siguiente test
        
        audioManager.playSoundEffect('fail');
        expect(mockOscillator.frequency.setValueAtTime)
            .toHaveBeenCalledWith(220, now);
        expect(mockOscillator.frequency.exponentialRampToValueAtTime)
            .toHaveBeenCalledWith(110, now + 0.2);
    });

    test('ALL_NOTES debería contener todas las notas musicales', () => {
        expect(ALL_NOTES).toEqual(['do', 're', 'mi', 'fa', 'sol', 'la', 'si']);
    });

    test('NOTE_SOUNDS debería tener las frecuencias correctas', () => {
        expect(NOTE_SOUNDS['do']).toBe(261.63); // C4
        expect(NOTE_SOUNDS).toHaveProperty('do');
        expect(NOTE_SOUNDS).toHaveProperty('re');
        expect(NOTE_SOUNDS).toHaveProperty('mi');
        expect(NOTE_SOUNDS).toHaveProperty('fa');
        expect(NOTE_SOUNDS).toHaveProperty('sol');
        expect(NOTE_SOUNDS).toHaveProperty('la');
        expect(NOTE_SOUNDS).toHaveProperty('si');
    });

    test('playNote no debería hacer nada si no hay audioContext', () => {
        audioManager.audioContext = null;
        audioManager.playNote('do');
        expect(mockOscillator.start).not.toHaveBeenCalled();
    });

    test('playNote debería manejar efectos visuales de botones correctamente', () => {
        jest.useFakeTimers();
        const mockButton = document.createElement('button');
        const duration = 0.5;

        audioManager.playNote('do', duration, mockButton);
        expect(mockButton.classList.contains('active')).toBe(true);

        // Simular el paso del tiempo
        jest.advanceTimersByTime(duration * 1000);
        expect(mockButton.classList.contains('active')).toBe(false);

        jest.useRealTimers();
    });

    test('playNote debería limpiar timers existentes para el mismo botón', () => {
        jest.useFakeTimers();
        const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
        const mockButton = document.createElement('button');
        
        // Primera llamada
        audioManager.playNote('do', 0.5, mockButton);
        const firstTimer = audioManager.buttonEffectTimers.get(mockButton);
        
        // Segunda llamada antes de que expire el primer timer
        audioManager.playNote('do', 0.5, mockButton);
        
        // Verificar que el primer timer fue limpiado
        expect(mockClearTimeout).toHaveBeenCalledWith(firstTimer);
        
        mockClearTimeout.mockRestore();
        jest.useRealTimers();
    });

    test('playSoundEffect no debería hacer nada si no hay audioContext', () => {
        audioManager.audioContext = null;
        audioManager.playSoundEffect('success');
        expect(mockOscillator.start).not.toHaveBeenCalled();
    });

    test('playSoundEffect debería manejar todos los tipos de efectos', () => {
        const now = mockAudioContext.currentTime;
        
        // Test win effect
        audioManager.playSoundEffect('win');
        expect(mockOscillator.frequency.setValueAtTime)
            .toHaveBeenCalledWith(440, now);
        expect(mockOscillator.frequency.exponentialRampToValueAtTime)
            .toHaveBeenCalledWith(880, now + 0.1);
        expect(mockOscillator.frequency.exponentialRampToValueAtTime)
            .toHaveBeenCalledWith(1760, now + 0.2);
            
        jest.clearAllMocks();
        
        // Test lose effect
        audioManager.playSoundEffect('lose');
        expect(mockOscillator.frequency.setValueAtTime)
            .toHaveBeenCalledWith(220, now);
        expect(mockOscillator.frequency.exponentialRampToValueAtTime)
            .toHaveBeenCalledWith(110, now + 0.1);
        expect(mockOscillator.frequency.exponentialRampToValueAtTime)
            .toHaveBeenCalledWith(55, now + 0.2);
            
        jest.clearAllMocks();
        
        // Test invalid effect type
        audioManager.playSoundEffect('invalid');
        expect(mockOscillator.start).not.toHaveBeenCalled();
    });

    test('cleanup debería limpiar todos los timers', () => {
        jest.useFakeTimers();
        const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
        
        const button1 = document.createElement('button');
        const button2 = document.createElement('button');
        
        audioManager.playNote('do', 0.5, button1);
        audioManager.playNote('re', 0.5, button2);
        
        expect(audioManager.buttonEffectTimers.size).toBe(2);
        
        audioManager.cleanup();
        
        expect(audioManager.buttonEffectTimers.size).toBe(0);
        expect(mockClearTimeout).toHaveBeenCalledTimes(2);
        
        mockClearTimeout.mockRestore();
        jest.useRealTimers();
    });
});