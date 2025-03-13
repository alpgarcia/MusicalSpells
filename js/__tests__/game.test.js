import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Game, DIFFICULTY_CONFIG } from '../game.js';
import { i18n } from '../i18n.js';
import { ScoreManager } from '../scores.js';

describe('Game', () => {
    let game;
    let mockUiManager;
    let mockAudioManager;
    let mockScoreManager;
    let mockEnemies;

    beforeEach(() => {
        jest.useFakeTimers();
        
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="battle-score">
                <span data-score="0">Puntuación actual: 0</span>
            </div>
            <div id="inscription-screen"></div>
            <div id="result-screen"></div>
            <div id="start-screen"></div>
            <input id="inscription-name" />
            <button id="confirm-inscription"></button>
            <button id="cancel-inscription"></button>
            <div class="final-score">
                <span class="score-value"></span>
            </div>
            <div class="final-level">
                <span class="level-value"></span>
            </div>
            <table id="scores-list"></table>
        `;

        // Mock dependencies
        mockUiManager = {
            showScreen: jest.fn(),
            setBattleMessage: jest.fn(),
            toggleSpellButtons: jest.fn(),
            updateHealthBars: jest.fn(),
            showMagicEffect: jest.fn(),
            setEnemyInfo: jest.fn(),
            initializeProgressMap: jest.fn(),
            setResultScreen: jest.fn(),
            setupMainButtonListeners: jest.fn(),
            setupSpellButtonListeners: jest.fn(),
            mapScreen: document.createElement('div'),
            startScreen: document.getElementById('start-screen'),
            battleScreen: document.createElement('div'),
            resultScreen: document.getElementById('result-screen'),
            inscriptionScreen: document.getElementById('inscription-screen')
        };

        mockAudioManager = {
            initAudio: jest.fn(),
            playNote: jest.fn(),
            playSoundEffect: jest.fn(),
            cleanup: jest.fn()
        };

        mockScoreManager = {
            resetScore: jest.fn(),
            addSpellSuccess: jest.fn().mockReturnValue(100),
            addSpellFailure: jest.fn().mockReturnValue(50),
            getCurrentScore: jest.fn().mockReturnValue(100),
            addVictoryBonus: jest.fn(),
            addScore: jest.fn(),
            isHighScore: jest.fn(),
            getTopScores: jest.fn().mockReturnValue([
                { name: 'Player1', score: 1000, level: 3, difficulty: 'novice' },
                { name: 'Player2', score: 800, level: 2, difficulty: 'master' }
            ])
        };

        mockEnemies = [
            { id: 'melodic_apprentice', difficulty: 0, health: 100, emoji: '🧙‍♂️' },
            { id: 'octave_sorcerer', difficulty: 1, health: 120, emoji: '🧙‍♀️' }
        ];

        game = new Game(mockUiManager, mockAudioManager, mockEnemies, mockScoreManager);
        game.state.currentEnemy = mockEnemies[0];
    });

    afterEach(() => {
        if (game) {
            game.cleanup();
        }
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test('setupDifficulty debería configurar correctamente las notas disponibles', () => {
        game.state.difficulty = 'novice';
        game.setupDifficulty();
        expect(game.state.availableNotes).toEqual(DIFFICULTY_CONFIG.novice.notes);

        game.state.difficulty = 'master';
        game.setupDifficulty();
        expect(game.state.availableNotes).toEqual(DIFFICULTY_CONFIG.master.notes);
    });

    test('startGame debería inicializar correctamente el estado del juego', () => {
        game.startGame();
        
        expect(mockAudioManager.initAudio).toHaveBeenCalled();
        expect(mockScoreManager.resetScore).toHaveBeenCalled();
        expect(game.state.playerHealth).toBe(100);
        expect(game.state.currentLevel).toBe(0);
        expect(game.state.defeatedEnemies).toEqual([]);
        expect(mockUiManager.showScreen).toHaveBeenCalled();
    });

    test('checkPlayerSequence debería detectar secuencias correctas e incorrectas', () => {
        game.state.spellSequence = ['do', 're', 'mi'];
        game.state.playerSequence = ['do', 're', 'mi'];
        game.state.isPlayerTurn = true;
        game.state.hasFailed = false;

        game.checkPlayerSequence();
        
        setTimeout(() => {
            expect(mockAudioManager.playSoundEffect).toHaveBeenCalledWith('success');
        }, 500);

        // Test secuencia incorrecta
        game.state.spellSequence = ['do', 're', 'mi'];
        game.state.playerSequence = ['do', 're', 'fa'];
        game.state.hasFailed = false;

        game.checkPlayerSequence();
        
        setTimeout(() => {
            expect(mockAudioManager.playSoundEffect).toHaveBeenCalledWith('fail');
        }, 500);
    });

    test('handlePlayerSuccess debería aplicar el daño correctamente', () => {
        game.state.enemyHealth = 100;
        game.handlePlayerSuccess();
        
        expect(game.state.enemyHealth).toBeLessThan(100);
        expect(mockUiManager.showMagicEffect).toHaveBeenCalledWith('player-cast');
        expect(mockScoreManager.addSpellSuccess).toHaveBeenCalledWith(
            game.state.currentEnemy.difficulty,
            game.state.playReferenceNote
        );
    });

    test('handlePlayerFail debería aplicar el daño al jugador correctamente', () => {
        game.state.playerHealth = 100;
        game.handlePlayerFail();
        
        expect(game.state.playerHealth).toBeLessThan(100);
        expect(mockUiManager.showMagicEffect).toHaveBeenCalledWith('enemy-cast');
        expect(mockScoreManager.addSpellFailure).toHaveBeenCalled();
    });

    describe('Inscripción de Puntuaciones', () => {
        test('validateAndShowInscription debería mostrar la pantalla de inscripción correctamente', () => {
            const result = game.validateAndShowInscription(1000, 2);
            
            expect(result).toBe(true);
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.inscriptionScreen);
            expect(document.querySelector('.score-value').textContent).toBe('1,000');
            expect(document.querySelector('.level-value').textContent).toBe('3');
        });

        test('handleInscriptionConfirm debería manejar la inscripción correctamente', () => {
            const inscriptionName = document.getElementById('inscription-name');
            inscriptionName.value = 'TestPlayer';
            
            game.handleInscriptionConfirm();
            
            expect(mockScoreManager.addScore).toHaveBeenCalledWith(
                expect.any(Object),
                'TestPlayer'
            );
            expect(mockAudioManager.playSoundEffect).toHaveBeenCalledWith('success');
            expect(mockUiManager.showScreen).toHaveBeenCalled();
        });

        test('handleInscriptionConfirm no debería procesar nombres vacíos', () => {
            const inscriptionName = document.getElementById('inscription-name');
            inscriptionName.value = '';
            
            const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
            
            game.handleInscriptionConfirm();
            
            expect(alertMock).toHaveBeenCalled();
            expect(mockScoreManager.addScore).not.toHaveBeenCalled();
            
            alertMock.mockRestore();
        });
    });

    describe('Ciclo de Juego', () => {
        test('startEnemyTurn debería iniciar correctamente el turno del enemigo', () => {
            game.state.difficulty = 'novice';
            game.setupDifficulty();
            game.startEnemyTurn();
            
            expect(game.state.isPlayerTurn).toBe(false);
            expect(game.state.spellSequence.length).toBeGreaterThan(0);
            expect(mockUiManager.setBattleMessage).toHaveBeenCalled();
            expect(game.state.spellSequence.every(note => 
                game.state.availableNotes.includes(note)
            )).toBe(true);
        });

        test('playReferenceNote debería reproducir la nota de referencia', () => {
            game.playReferenceNote();
            
            expect(mockUiManager.setBattleMessage).toHaveBeenCalledWith('battle.referenceNote');
            
            jest.advanceTimersByTime(1000);
            expect(mockAudioManager.playNote).toHaveBeenCalledWith('do', 1.0);
        });

        test('forceDefeatTransition debería manejar correctamente la derrota', () => {
            mockScoreManager.isHighScore.mockReturnValue(true);
            document.getElementById('result-screen').innerHTML = '<button>Existente</button>';
            
            // Preparar el estado para la derrota
            game.state.playReferenceNote = true;
            game.state.isPlayerTurn = true;
            
            game.forceDefeatTransition();
            
            jest.advanceTimersByTime(2500);
            
            expect(game.state.isPlayerTurn).toBe(false);
            expect(mockUiManager.setResultScreen).toHaveBeenCalledWith(
                'battle.defeat',
                'battle.defeatHighScore',
                false,
                expect.any(Object)
            );
        });

        test('playSequence debería reproducir la secuencia correctamente', () => {
            game.state.spellSequence = ['do', 're'];
            game.playSequence();
            
            expect(mockUiManager.toggleSpellButtons).toHaveBeenCalledWith(false);
            jest.advanceTimersByTime(800);
            expect(mockAudioManager.playNote).toHaveBeenCalledWith('do');
            
            jest.advanceTimersByTime(800);
            expect(mockAudioManager.playNote).toHaveBeenCalledWith('re');
            
            // Verificar que se inicia el turno del jugador después de la secuencia
            jest.advanceTimersByTime(500);
            expect(game.state.isPlayerTurn).toBe(true);
        });

        test('startPlayerTurn debería configurar correctamente el estado del jugador', () => {
            game.state.availableNotes = ['do', 're'];
            game.startPlayerTurn();
            
            expect(game.state.isPlayerTurn).toBe(true);
            expect(game.state.playerSequence).toEqual([]);
            expect(game.state.hasFailed).toBe(false);
            expect(mockUiManager.setBattleMessage).toHaveBeenCalledWith('battle.playerTurn');
            expect(mockUiManager.toggleSpellButtons).toHaveBeenCalledWith(true, ['do', 're']);
        });

        test('handleInscriptionCancel debería volver a la pantalla de inicio', () => {
            game.handleInscriptionCancel();
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.startScreen);
        });

        test('showResultScreen debería mostrar la pantalla correcta según el estado', () => {
            // Caso: Victoria final
            game.state.currentLevel = game.enemies.length;
            game.showResultScreen();
            
            expect(mockUiManager.setResultScreen).toHaveBeenCalledWith(
                'victory',
                'battle.finalVictory',
                false
            );
            
            // Caso: Victoria intermedia
            game.state.currentLevel = 0;
            game.showResultScreen();
            
            expect(mockUiManager.setResultScreen).toHaveBeenCalledWith(
                'victory',
                'battle.victory',
                true,
                expect.any(Object)
            );
        });
    });

    describe('Manejo de Eventos', () => {
        test('handleKeyPress debería procesar correctamente las pulsaciones de teclas', () => {
            game.state.isPlayerTurn = true;
            game.state.hasFailed = false;
            game.state.spellSequence = ['do', 're'];
            game.state.playerSequence = [];
            game.state.availableNotes = ['do', 're'];
            
            // Simular pulsación de tecla válida
            game.handleKeyPress({ key: 'c' }); // 'c' mapea a 'do'
            
            expect(game.state.playerSequence).toContain('do');
            expect(mockAudioManager.playNote).toHaveBeenCalledWith('do', 0.3);
            
            // Simular pulsación de tecla inválida
            game.handleKeyPress({ key: 'x' });
            
            expect(game.state.playerSequence.length).toBe(1);
            
            // Simular pulsación cuando no es el turno del jugador
            game.state.isPlayerTurn = false;
            game.handleKeyPress({ key: 'c' });
            
            expect(mockAudioManager.playNote).toHaveBeenCalledTimes(1);
        });

        test('handleNextBattle debería preparar correctamente la siguiente batalla', () => {
            const currentScore = 100;
            mockScoreManager.getCurrentScore.mockReturnValue(currentScore);
            
            game.handleNextBattle();
            
            expect(mockUiManager.initializeProgressMap).toHaveBeenCalledWith(
                mockEnemies,
                game.state.currentLevel,
                game.state.defeatedEnemies,
                expect.any(Function),
                currentScore
            );
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(
                mockUiManager.mapScreen
            );
        });
    });

    describe('Ciclo de Vida', () => {
        test('cleanup debería limpiar correctamente los recursos', () => {
            const mockSetTimeout = jest.spyOn(global, 'setTimeout');
            const timer = setTimeout(() => {}, 1000);
            game.addTimer(timer);
            
            game.cleanup();
            
            expect(mockAudioManager.cleanup).toHaveBeenCalled();
            expect(mockSetTimeout).toHaveBeenCalled();
            
            mockSetTimeout.mockRestore();
        });

        test('selectEnemy debería configurar correctamente el enemigo seleccionado', () => {
            game.selectEnemy(0);
            
            expect(game.state.currentLevel).toBe(0);
            expect(game.state.isPlayerTurn).toBe(false);
            expect(game.state.hasFailed).toBe(false);
            expect(game.state.spellSequence).toEqual([]);
            expect(game.state.playerSequence).toEqual([]);
            expect(game.state.currentEnemy).toBe(mockEnemies[0]);
            expect(mockUiManager.setEnemyInfo).toHaveBeenCalledWith(
                mockEnemies[0].id,
                mockEnemies[0].emoji
            );
        });
    });

    describe('Diálogo de Puntuación', () => {
        beforeEach(() => {
            // Create UI elements
            game.finalScoreSpan = document.createElement('span');
            game.finalLevelSpan = document.createElement('span');
            game.playerNameInput = document.createElement('input');
            game.highscoreDialog = document.createElement('div');
            game.scoreValue = document.createElement('span');
            
            // Mock score formatting
            mockScoreManager.formatScore = jest.fn(score => score.toLocaleString());
            mockScoreManager.getCurrentScore = jest.fn().mockReturnValue(1000);
        });

        test('showHighscoreDialog debería mostrar el diálogo correctamente', () => {
            game.showHighscoreDialog(1000, 3);
            
            expect(game.playerNameInput.value).toBe('');
            expect(game.highscoreDialog.classList.contains('hidden')).toBe(false);
            expect(game.finalScoreSpan.textContent).toBe('1,000');
            expect(game.finalLevelSpan.textContent).toBe('3');
        });

        test('hideHighscoreDialog debería ocultar el diálogo correctamente', () => {
            game._handleDialogClose = jest.fn();
            game.hideHighscoreDialog();
            
            expect(game.highscoreDialog.classList.contains('hidden')).toBe(true);
            expect(game._handleDialogClose).toBe(null);
        });

        test('updateScoresTable debería actualizar la tabla correctamente', () => {
            const mockScores = [
                { playerName: 'Test1', score: 1000, level: 1, difficulty: 'novice', usedReference: true },
                { playerName: 'Test2', score: 500, level: 2, difficulty: 'master', usedReference: false }
            ];
            mockScoreManager.getTopScores.mockReturnValue(mockScores);
            
            game.updateScoresTable();
            
            const rows = document.querySelectorAll('#scores-list tr');
            expect(rows.length).toBe(2);
            expect(rows[0].innerHTML).toContain('Test1');
            expect(rows[0].innerHTML).toContain('1,000');
            expect(rows[0].innerHTML).toContain('✓');
            expect(rows[1].innerHTML).toContain('Test2');
            expect(rows[1].innerHTML).toContain('500');
            expect(rows[1].innerHTML).toContain('✗');
        });
    });

    describe('Manejo de Estado del Juego', () => {
        beforeEach(() => {
            // Añadir métodos faltantes al mock de UIManager
            mockUiManager.setupMainButtonListeners = jest.fn();
            mockUiManager.setupSpellButtonListeners = jest.fn();
        });

        test('init debería configurar correctamente los listeners', () => {
            const spellButton = document.createElement('button');
            spellButton.dataset.note = 'do';
            document.body.appendChild(spellButton);
            
            game.init();
            
            expect(mockUiManager.setupMainButtonListeners).toHaveBeenCalled();
            expect(mockUiManager.setupSpellButtonListeners).toHaveBeenCalled();
            
            document.body.removeChild(spellButton);
        });

        test('getDifficultyLabel debería retornar la etiqueta correcta', () => {
            const mockT = jest.fn(key => key);
            const originalT = i18n.t;
            i18n.t = mockT;
            
            expect(game.getDifficultyLabel('novice')).toBe('difficulty.novice');
            expect(game.getDifficultyLabel('master')).toBe('difficulty.master');
            
            i18n.t = originalT;
        });
    });

    describe('Developer Mode', () => {
        test('toggleDeveloperMode debería activar/desactivar el modo desarrollador', () => {
            expect(game.state.isDeveloperModeActive).toBe(false);
            
            game.toggleDeveloperMode();
            expect(game.state.isDeveloperModeActive).toBe(true);
            expect(mockUiManager.setBattleMessage).toHaveBeenCalledWith('developer.enabled');
            
            game.toggleDeveloperMode();
            expect(game.state.isDeveloperModeActive).toBe(false);
            expect(mockUiManager.setBattleMessage).toHaveBeenCalledWith('developer.disabled');
        });
        
        test('autoCompleteSequence debería completar la secuencia en modo desarrollador', () => {
            game.state.isDeveloperModeActive = true;
            game.state.isPlayerTurn = true;
            game.state.spellSequence = ['do', 're', 'mi'];
            game.state.playerSequence = [];
            
            game.autoCompleteSequence();
            
            expect(game.state.playerSequence).toEqual(game.state.spellSequence);
            expect(mockAudioManager.playSoundEffect).toHaveBeenCalledWith('success');
            
            // Verificar que llama a handlePlayerSuccess
            const spy = jest.spyOn(game, 'handlePlayerSuccess');
            game.autoCompleteSequence();
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
        
        test('handleKeyPress debería manejar teclas de desenvolvedor cuando está activo', () => {
            // Configurar el mock para el módulo config
            const originalConfig = global.DEVELOPER_MODE;
            
            // Configurar el modo desarrollador directamente
            global.DEVELOPER_MODE = {
                enabled: true,
                toggleKey: 'F2',
                autoCompleteKey: 'x'
            };
            
            // Inicializar el juego
            game.init();
            
            // Crear espías
            const toggleSpy = jest.spyOn(game, 'toggleDeveloperMode');
            const autoCompleteSpy = jest.spyOn(game, 'autoCompleteSequence');
            
            // Simular tecla de activación del modo desarrollador con keydown
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2' }));
            expect(toggleSpy).toHaveBeenCalled();
            
            // Configurar estado para autoCompletar
            game.state.isDeveloperModeActive = true;
            game.state.isPlayerTurn = true;
            game.state.hasFailed = false;
            
            // Simular tecla de autocompletado con keydown
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
            expect(autoCompleteSpy).toHaveBeenCalled();
            
            // Restaurar la configuración original
            global.DEVELOPER_MODE = originalConfig;
            toggleSpy.mockRestore();
            autoCompleteSpy.mockRestore();
        });
    });

    describe('Inscripción y Gestión de Puntuaciones', () => {
        test('validateAndShowInscription debería manejar casos de elementos faltantes', () => {
            // Eliminar elementos críticos del DOM
            document.getElementById('inscription-screen').innerHTML = '';
            document.querySelector('.score-value')?.remove();
            document.querySelector('.level-value')?.remove();

            const result = game.validateAndShowInscription(1000, 3);
            expect(result).toBe(false);
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.startScreen);
        });

        test('handleInscriptionConfirm debería manejar nombres con espacios', () => {
            const inscriptionName = document.getElementById('inscription-name');
            inscriptionName.value = '  Player Name  ';

            game.handleInscriptionConfirm();

            expect(mockScoreManager.addScore).toHaveBeenCalledWith(
                expect.any(Object),
                'Player Name'
            );
        });

        test('_completeDefeatTransition debería manejar puntuación alta en derrota', () => {
            mockScoreManager.isHighScore.mockReturnValue(true);
            mockScoreManager.getCurrentScore.mockReturnValue(1000);

            game.state.currentEnemy = mockEnemies[0];
            game._completeDefeatTransition();

            const enterHallOfFameBtn = document.querySelector('[data-i18n="buttons.enterHallOfFame"]');
            expect(enterHallOfFameBtn).toBeTruthy();
            expect(mockUiManager.setResultScreen).toHaveBeenCalledWith(
                'battle.defeat',
                'battle.defeatHighScore',
                false,
                expect.any(Object)
            );
        });
    });

    describe('Victoria y Puntuaciones', () => {
        test('handlePlayerSuccess debería manejar victoria final correctamente', async () => {
            // Configuración inicial para forzar una victoria
            game.state.enemyHealth = 0;  // Aseguramos victoria inmediata
            game.state.currentLevel = 1;  // Segundo nivel para probar que se agrega correctamente
            game.state.defeatedEnemies = [0]; // Ya derrotamos el primer enemigo
            mockScoreManager.isHighScore.mockReturnValue(true);
            
            // Primera victoria en nivel 1 - debería añadir el enemigo a la lista
            game.handlePlayerSuccess();
            jest.runAllTimers();
            expect(mockAudioManager.playSoundEffect).toHaveBeenCalledWith('win');
            expect(game.state.defeatedEnemies).toContain(1);
            
            // Segunda victoria contra el mismo enemigo - no debería añadirlo de nuevo
            const initialDefeatCount = game.state.defeatedEnemies.filter(id => id === 1).length;
            game.handlePlayerSuccess();
            jest.runAllTimers();
            const finalDefeatCount = game.state.defeatedEnemies.filter(id => id === 1).length;
            expect(finalDefeatCount).toBe(initialDefeatCount); // Verificamos que no se duplicó
            
            expect(mockScoreManager.isHighScore).toHaveBeenCalled();
        });
        // ... resto del código sin cambios ...
    });

    describe('Manejo de Puntuaciones durante el Juego', () => {
        test('updateBattleScore debería actualizar la puntuación en el DOM', () => {
            // Crear elemento para el test
            document.body.innerHTML += `
                <div id="battle-score">
                    <span data-score="0">Puntuación actual: 0</span>
                </div>
            `;
            
            // Mockear getCurrentScore
            mockScoreManager.getCurrentScore.mockReturnValue(500);
            
            // Ejecutar la función
            game.updateBattleScore();
            
            // Verificar que el DOM se actualizó correctamente
            const scoreElement = document.querySelector('#battle-score span');
            expect(scoreElement.dataset.score).toBe('500');
            expect(scoreElement.textContent).toContain('500');
        });
        
        test('handleNextBattle debería inicializar el mapa con la puntuación correcta', () => {
            // Mockear getCurrentScore
            const mockScore = 750;
            mockScoreManager.getCurrentScore.mockReturnValue(mockScore);
            
            // Ejecutar la función
            game.handleNextBattle();
            
            // Verificar que se pasó la puntuación correcta
            expect(mockUiManager.initializeProgressMap).toHaveBeenCalledWith(
                expect.any(Array),
                expect.any(Number),
                expect.any(Array),
                expect.any(Function),
                mockScore
            );
        });
    });
    
    describe('Diálogo de Puntuaciones Altas', () => {
        beforeEach(() => {
            // Crear elementos necesarios para el test
            game.highscoreDialog = document.createElement('div');
            game.finalScoreSpan = document.createElement('span');
            game.finalLevelSpan = document.createElement('span');
            game.playerNameInput = document.createElement('input');
            
            // Configurar eventListeners mock
            game.highscoreDialog.addEventListener = jest.fn();
            game.highscoreDialog.removeEventListener = jest.fn();
            game.playerNameInput.focus = jest.fn();
            
            // Mock para formatScore
            ScoreManager.formatScore = jest.fn(score => score.toLocaleString());
        });
        
        test('showHighscoreDialog debería configurar y mostrar el diálogo correctamente', () => {
            // Ejecutar la función
            game.showHighscoreDialog(1000, 3);
            
            // Verificar que el DOM se actualizó correctamente
            expect(game.finalScoreSpan.textContent).toBe('1,000');
            expect(game.finalLevelSpan.textContent).toBe('3');
            expect(game.playerNameInput.value).toBe('');
            expect(game.highscoreDialog.classList.contains('hidden')).toBe(false);
            expect(game.playerNameInput.focus).toHaveBeenCalled();
            expect(game.highscoreDialog.addEventListener).toHaveBeenCalled();
        });
        
        test('hideHighscoreDialog debería ocultar el diálogo y limpiar eventos', () => {
            // Configurar estado previo
            game._handleDialogClose = () => {};
            
            // Ejecutar la función
            game.hideHighscoreDialog();
            
            // Verificar que el DOM se actualizó correctamente
            expect(game.highscoreDialog.classList.contains('hidden')).toBe(true);
            expect(game.highscoreDialog.removeEventListener).toHaveBeenCalled();
            expect(game._handleDialogClose).toBeNull();
        });
    });
    
    describe('Transición de Derrota', () => {
        beforeEach(() => {
            // Configurar elementos DOM necesarios
            document.body.innerHTML += `
                <div id="result-screen"></div>
            `;
            
            // Mock de funciones
            mockUiManager.setResultScreen = jest.fn();
            mockUiManager.showScreen = jest.fn();
            mockAudioManager.playSoundEffect = jest.fn();
            mockScoreManager.isHighScore = jest.fn().mockReturnValue(true);
            mockScoreManager.getCurrentScore = jest.fn().mockReturnValue(500);
            
            // Configurar estado del juego
            game.state.currentEnemy = mockEnemies[0];
            game.state.currentLevel = 1;
        });
        
        test('_completeDefeatTransition debería manejar correctamente puntuación alta', () => {
            // Ejecutar la función
            game._completeDefeatTransition();
            
            // Verificar que se llamaron las funciones esperadas
            expect(mockScoreManager.isHighScore).toHaveBeenCalled();
            expect(mockUiManager.setResultScreen).toHaveBeenCalledWith(
                'battle.defeat',
                'battle.defeatHighScore',
                false,
                expect.objectContaining({
                    score: '500'
                })
            );
            expect(mockAudioManager.playSoundEffect).toHaveBeenCalledWith('lose');
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.resultScreen);
            
            // Verificar que se creó el botón de Hall of Fame
            const resultScreen = document.getElementById('result-screen');
            const hallOfFameBtn = resultScreen.querySelector('[data-i18n="buttons.enterHallOfFame"]');
            expect(hallOfFameBtn).toBeTruthy();
        });
        
        test('_completeDefeatTransition debería manejar puntuación no alta', () => {
            // Cambiar el mock para simular puntuación baja
            mockScoreManager.isHighScore.mockReturnValueOnce(false);
            
            // Ejecutar la función
            game._completeDefeatTransition();
            
            // Verificar que se llamaron las funciones esperadas con los parámetros correctos
            expect(mockUiManager.setResultScreen).toHaveBeenCalledWith(
                'battle.defeat',
                'battle.defeatNotHighScore',
                false,
                expect.any(Object)
            );
            
            // Verificar que NO se creó el botón de Hall of Fame
            const resultScreen = document.getElementById('result-screen');
            const hallOfFameBtn = resultScreen.querySelector('[data-i18n="buttons.enterHallOfFame"]');
            expect(hallOfFameBtn).toBeFalsy();
            
            // Verificar que se creó el botón de volver al inicio
            const returnBtn = resultScreen.querySelector('[data-i18n="buttons.returnToStart"]');
            expect(returnBtn).toBeTruthy();
        });
        
        test('forceDefeatTransition debería llamar a _completeDefeatTransition', () => {
            // Espiar la función _completeDefeatTransition
            const spy = jest.spyOn(game, '_completeDefeatTransition');
            
            // Ejecutar la función
            game.forceDefeatTransition();
            
            // Avanzar los temporizadores
            jest.advanceTimersByTime(10);
            
            // Verificar que se cambió el estado y se llamó a _completeDefeatTransition
            expect(game.state.isPlayerTurn).toBe(false);
            expect(spy).toHaveBeenCalled();
            
            // Restaurar el espía
            spy.mockRestore();
        });
    });

    describe('Manejo de Derrota del Jugador', () => {
        beforeEach(() => {
            // Configurar el DOM necesario para la prueba
            document.body.innerHTML = `
                <div id="battle-message"></div>
                <div id="result-screen"></div>
                <div id="battle-score">
                    <span data-score="0">Puntuación actual: 0</span>
                </div>
            `;
        });

        test('handlePlayerFail debería manejar correctamente cuando la salud del jugador llega a cero', () => {
            // Configurar salud del jugador a un valor bajo para garantizar que llegue a cero
            game.state.playerHealth = 5;
            
            // Espiar la función forceDefeatTransition antes de ejecutar handlePlayerFail
            const spy = jest.spyOn(game, 'forceDefeatTransition');
            
            // Ejecutar la función
            game.handlePlayerFail();
            
            // Verificar que la salud llegó a cero
            expect(game.state.playerHealth).toBe(0);
            
            // Verificar que se creó el contenido del mensaje de derrota
            const battleMessage = document.getElementById('battle-message');
            expect(battleMessage.dataset.i18n).toBe('battle.defeat');
            
            // Verificar que se creó el botón de continuar
            const continueButton = battleMessage.querySelector('button.continue-btn');
            expect(continueButton).toBeTruthy();
            expect(continueButton.dataset.i18n).toBe('buttons.continue');
            
            // Simular click en el botón de continuar
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            continueButton.dispatchEvent(event);
            
            // Ejecutar todos los temporizadores pendientes
            jest.runAllTimers();
            
            // Verificar que se llamó a la función de transición
            expect(spy).toHaveBeenCalled();
            
            // Limpiar el espía
            spy.mockRestore();
        });
    });

    describe('Event Handlers', () => {
        test('onNextBattle should initialize and show map screen', () => {
            // Setup
            game.state.currentLevel = 1;
            game.state.defeatedEnemies = [0];
            
            // Call handler directly
            game.init();
            const nextBattleHandler = mockUiManager.setupMainButtonListeners.mock.calls[0][0].onNextBattle;
            nextBattleHandler();
            
            expect(mockUiManager.initializeProgressMap).toHaveBeenCalledWith(
                mockEnemies,
                game.state.currentLevel,
                game.state.defeatedEnemies,
                expect.any(Function)
            );
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.mapScreen);
        });

        test('onRestartGame should show start screen', () => {
            game.init();
            const restartGameHandler = mockUiManager.setupMainButtonListeners.mock.calls[0][0].onRestartGame;
            restartGameHandler();
            
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.startScreen);
        });

        test('onReturnToMenu should show start screen', () => {
            game.init();
            const returnToMenuHandler = mockUiManager.setupMainButtonListeners.mock.calls[0][0].onReturnToMenu;
            returnToMenuHandler();
            
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.startScreen);
        });

        test('onDifficultyChange should update game difficulty', () => {
            game.init();
            const difficultyChangeHandler = mockUiManager.setupMainButtonListeners.mock.calls[0][0].onDifficultyChange;
            difficultyChangeHandler('master');
            
            expect(game.state.difficulty).toBe('master');
        });

        test('onReferenceNoteToggle should update reference note state', () => {
            game.init();
            const referenceToggleHandler = mockUiManager.setupMainButtonListeners.mock.calls[0][0].onReferenceNoteToggle;
            referenceToggleHandler(true);
            
            expect(game.state.playReferenceNote).toBe(true);
            
            referenceToggleHandler(false);
            expect(game.state.playReferenceNote).toBe(false);
        });
    });

    describe('Developer Mode', () => {
        beforeEach(() => {
            // Configurar el event listener del documento
            game.init();
        });

        test('handleKeyPress debería activar el modo desarrollador con la tecla correcta', () => {
            const event = new KeyboardEvent('keydown', { key: 'F2' });
            document.dispatchEvent(event);
            
            expect(game.state.isDeveloperModeActive).toBe(true);
            expect(mockUiManager.setBattleMessage).toHaveBeenCalledWith('developer.enabled');
        });

        test('autoCompleteSequence debería activarse con la tecla correcta en modo desarrollador', () => {
            // Activar modo desarrollador
            game.state.isDeveloperModeActive = true;
            game.state.isPlayerTurn = true;
            game.state.spellSequence = ['do', 're'];
            
            // Simular presionar la tecla de autocompletar
            const event = new KeyboardEvent('keydown', { key: 'x' });
            document.dispatchEvent(event);
            
            expect(game.state.playerSequence).toEqual(['do', 're']);
            expect(mockAudioManager.playSoundEffect).toHaveBeenCalledWith('success');
        });
    });

    describe('Victoria Final', () => {
        test('handlePlayerSuccess debería manejar victoria sin highscore correctamente', () => {
            // Configurar estado para victoria final
            game.state.enemyHealth = 0;
            game.state.currentLevel = game.enemies.length - 1;
            mockScoreManager.isHighScore.mockReturnValue(false);
            
            // Ejecutar victoria
            game.handlePlayerSuccess();
            jest.runAllTimers();

            // Verificar que se muestra la pantalla de resultado directamente
            expect(mockUiManager.setResultScreen).toHaveBeenCalledWith(
                'victory',
                'battle.finalVictory',
                false
            );
        });
    });

    describe('Event Handlers', () => {
        test('onNextBattle debería inicializar correctamente el mapa y mostrar la pantalla', () => {
            game.init();
            
            // Obtener el handler de la inicialización
            const handlers = mockUiManager.setupMainButtonListeners.mock.calls[0][0];
            handlers.onNextBattle();
            
            expect(mockUiManager.initializeProgressMap).toHaveBeenCalledWith(
                mockEnemies,
                game.state.currentLevel,
                game.state.defeatedEnemies,
                expect.any(Function)
            );
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.mapScreen);
        });

        test('onRestartGame y onReturnToMenu deberían mostrar la pantalla de inicio', () => {
            game.init();
            const handlers = mockUiManager.setupMainButtonListeners.mock.calls[0][0];
            
            handlers.onRestartGame();
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.startScreen);
            
            handlers.onReturnToMenu();
            expect(mockUiManager.showScreen).toHaveBeenCalledWith(mockUiManager.startScreen);
        });

        test('onDifficultyChange debería actualizar la dificultad', () => {
            game.init();
            const handlers = mockUiManager.setupMainButtonListeners.mock.calls[0][0];
            
            handlers.onDifficultyChange('master');
            expect(game.state.difficulty).toBe('master');
        });

        test('onReferenceNoteToggle debería actualizar el estado de la nota de referencia', () => {
            game.init();
            const handlers = mockUiManager.setupMainButtonListeners.mock.calls[0][0];
            
            handlers.onReferenceNoteToggle(false);
            expect(game.state.playReferenceNote).toBe(false);
            
            handlers.onReferenceNoteToggle(true);
            expect(game.state.playReferenceNote).toBe(true);
        });
    });
});