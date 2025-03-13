import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ScoreManager } from '../scores.js';

describe('ScoreManager', () => {
    let scoreManager;
    let mockGetItem;
    let mockSetItem;

    beforeEach(() => {
        // Mock localStorage
        mockGetItem = jest.fn();
        mockSetItem = jest.fn();
        
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: mockGetItem,
                setItem: mockSetItem
            },
            writable: true
        });
        
        scoreManager = new ScoreManager();
    });

    test('resetScore debería devolver 0', () => {
        scoreManager.currentScore = 100;
        expect(scoreManager.resetScore()).toBe(0);
        expect(scoreManager.getCurrentScore()).toBe(0);
    });

    test('addSpellSuccess debería calcular correctamente la puntuación', () => {
        const enemyLevel = 2;
        const withReference = true;
        const withoutReference = false;
        
        // Con nota de referencia (80% de la puntuación)
        let score = scoreManager.addSpellSuccess(enemyLevel, withReference);
        expect(score).toBe(Math.round(100 * (1 + 2 * 0.5) * 0.8));
        
        // Sin nota de referencia (100% de la puntuación)
        scoreManager.resetScore();
        score = scoreManager.addSpellSuccess(enemyLevel, withoutReference);
        expect(score).toBe(Math.round(100 * (1 + 2 * 0.5)));
    });

    test('addSpellFailure debería restar puntos y no permitir valores negativos', () => {
        scoreManager.currentScore = 30;
        expect(scoreManager.addSpellFailure()).toBe(0);
        
        scoreManager.currentScore = 100;
        expect(scoreManager.addSpellFailure()).toBe(50);
    });

    test('isHighScore debería identificar correctamente puntuaciones altas', () => {
        // Mock de puntuaciones existentes
        const mockScores = Array(9).fill().map((_, i) => ({
            score: 1000 - i * 100
        }));
        scoreManager.scores = mockScores;

        // Debería ser high score (solo hay 9 puntuaciones)
        expect(scoreManager.isHighScore(100)).toBe(true);
        
        // Añadir una puntuación más baja para completar el top 10
        scoreManager.scores.push({ score: 50 });
        
        // No debería ser high score (menor que la más baja)
        expect(scoreManager.isHighScore(40)).toBe(false);
        
        // Debería ser high score (mayor que la más baja)
        expect(scoreManager.isHighScore(60)).toBe(true);
    });

    test('isHighScore debería rechazar puntuaciones de cero', () => {
        expect(scoreManager.isHighScore(0)).toBe(false);
    });

    test('loadScores debería cargar puntuaciones desde localStorage', () => {
        const mockScores = [
            { playerName: 'Player1', score: 1000 },
            { playerName: 'Player2', score: 500 }
        ];
        
        mockGetItem.mockReturnValue(JSON.stringify(mockScores));
        scoreManager = new ScoreManager(); // Crear nueva instancia para probar carga
        
        expect(scoreManager.scores).toEqual(mockScores);
        expect(mockGetItem).toHaveBeenCalledWith('musicalSpellsScores');
    });

    test('loadScores debería manejar localStorage vacío', () => {
        mockGetItem.mockReturnValue(null);
        scoreManager = new ScoreManager();
        
        expect(scoreManager.scores).toEqual([]);
    });

    test('saveScores debería guardar puntuaciones en localStorage', () => {
        const mockScores = [
            { playerName: 'Player1', score: 1000 },
            { playerName: 'Player2', score: 500 }
        ];
        scoreManager.scores = mockScores;
        
        scoreManager.saveScores();
        
        expect(mockSetItem).toHaveBeenCalledWith(
            'musicalSpellsScores',
            JSON.stringify(mockScores)
        );
    });

    test('addVictoryBonus debería calcular correctamente el bonus', () => {
        const enemyLevel = 2;
        const withReference = true;
        const withoutReference = false;
        
        // Con nota de referencia (80% del bonus)
        let score = scoreManager.addVictoryBonus(enemyLevel, withReference);
        expect(score).toBe(Math.round(500 * (enemyLevel + 1) * 0.8));
        
        // Sin nota de referencia (100% del bonus)
        scoreManager.resetScore();
        score = scoreManager.addVictoryBonus(enemyLevel, withoutReference);
        expect(score).toBe(500 * (enemyLevel + 1));
    });

    test('addScore debería añadir y ordenar puntuaciones correctamente', () => {
        const gameState = {
            currentLevel: 3,
            difficulty: 'master',
            playReferenceNote: true
        };
        
        // Preparar algunas puntuaciones existentes
        scoreManager.scores = [
            { playerName: 'High', score: 2000 },
            { playerName: 'Low', score: 500 }
        ];
        scoreManager.currentScore = 1000;
        
        const result = scoreManager.addScore(gameState, 'Test');
        
        // Verificar el nuevo score
        expect(result).toEqual({
            playerName: 'Test',
            score: 1000,
            level: 3,
            difficulty: 'master',
            usedReference: true,
            date: expect.any(String)
        });
        
        // Verificar ordenación
        expect(scoreManager.scores[0].score).toBe(2000);
        expect(scoreManager.scores[1].score).toBe(1000);
        expect(scoreManager.scores[2].score).toBe(500);
        
        // Verificar que se guardó
        expect(mockSetItem).toHaveBeenCalled();
    });

    test('addScore debería mantener solo top 10 puntuaciones', () => {
        // Crear 10 puntuaciones iniciales de 1000 a 100
        scoreManager.scores = Array(10).fill().map((_, i) => ({
            playerName: `Player${i}`,
            score: 1000 - i * 100
        }));
        
        scoreManager.currentScore = 550; // Puntuación que debería quedar entre 500 y 600
        const gameState = {
            currentLevel: 1,
            difficulty: 'novice',
            playReferenceNote: false
        };
        
        scoreManager.addScore(gameState, 'Test');
        
        // Verificar que sigue habiendo 10 puntuaciones
        expect(scoreManager.scores.length).toBe(10);
        // Verificar que las puntuaciones están ordenadas correctamente
        expect(scoreManager.scores[0].score).toBe(1000); // Mayor puntuación
        expect(scoreManager.scores[4].score).toBe(600);
        expect(scoreManager.scores[5].score).toBe(550);  // Nueva puntuación
        expect(scoreManager.scores[5].playerName).toBe('Test');
        expect(scoreManager.scores[6].score).toBe(500);
        expect(scoreManager.scores[9].score).toBe(200);  // Última puntuación (100 eliminada)
    });

    test('getTopScores debería devolver todas las puntuaciones', () => {
        const mockScores = [
            { playerName: 'Player1', score: 1000 },
            { playerName: 'Player2', score: 500 }
        ];
        scoreManager.scores = mockScores;
        
        expect(scoreManager.getTopScores()).toEqual(mockScores);
    });

    test('formatScore debería formatear números correctamente', () => {
        expect(ScoreManager.formatScore(1000)).toBe('1,000');
        expect(ScoreManager.formatScore(1000000)).toBe('1,000,000');
        expect(ScoreManager.formatScore(0)).toBe('0');
    });
});