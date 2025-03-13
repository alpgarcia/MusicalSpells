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
 * game.js - Main game logic for Musical Spells
 */

import { KEYBOARD_MAPPING } from './audio.js';
import { i18n } from './i18n.js';
import { ScoreManager } from './scores.js';
import { DEVELOPER_MODE } from './config.js';

// Difficulty configuration
export const DIFFICULTY_CONFIG = {
    'novice': {
        notes: ['do', 're'],
        baseSequenceLength: 2
    },
    'apprentice': {
        notes: ['do', 're', 'mi'],
        baseSequenceLength: 2
    },
    'adept': {
        notes: ['do', 're', 'mi', 'fa', 'sol'],
        baseSequenceLength: 3
    },
    'master': {
        notes: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
        baseSequenceLength: 3
    }
};

// Main game class
export class Game {
    constructor(uiManager, audioManager, enemies, scoreManager) {
        this.ui = uiManager;
        this.audio = audioManager;
        this.enemies = enemies;
        this.scoreManager = scoreManager;
        
        // Game state
        this.state = {
            currentLevel: 0,
            playerHealth: 100,
            playerMaxHealth: 100,
            enemyHealth: 100,
            enemyMaxHealth: 100,
            currentEnemy: null,
            spellSequence: [],
            playerSequence: [],
            isPlayerTurn: false,
            hasFailed: false,
            difficulty: 'novice',
            availableNotes: [],
            playReferenceNote: true,
            defeatedEnemies: [],
            isDeveloperModeActive: false  // Estado de activación del modo desarrollador
        };
        
        // Referencias a elementos de la pantalla de inscripción
        this.inscriptionScreen = document.getElementById('inscription-screen');
        this.inscriptionScore = document.getElementById('inscription-score');
        this.inscriptionLevel = document.getElementById('inscription-level');
        this.inscriptionName = document.getElementById('inscription-name');
        this.confirmInscription = document.getElementById('confirm-inscription');
        this.cancelInscription = document.getElementById('cancel-inscription');

        // Configurar los manejadores de eventos de inscripción solo si los elementos existen
        if (this.confirmInscription && this.cancelInscription && this.inscriptionName) {
            this.confirmInscription.addEventListener('click', () => this.handleInscriptionConfirm());
            this.cancelInscription.addEventListener('click', () => this.handleInscriptionCancel());
            this.inscriptionName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleInscriptionConfirm();
                }
            });
        } else {
            console.warn('Algunos elementos de la pantalla de inscripción no se encontraron.');
        }

        this.gameTimers = [];
    }
    
    // Initialize the game
    init() {
        // Set up main button listeners
        this.ui.setupMainButtonListeners({
            onStartGame: () => this.startGame(),
            onNextBattle: () => {
                this.ui.initializeProgressMap(
                    this.enemies, 
                    this.state.currentLevel, 
                    this.state.defeatedEnemies,
                    (index) => this.selectEnemy(index)
                );
                this.ui.showScreen(this.ui.mapScreen);
            },
            onRestartGame: () => {
                this.ui.showScreen(this.ui.startScreen);
            },
            onReturnToMenu: () => {
                this.ui.showScreen(this.ui.startScreen);
            },
            onDifficultyChange: (difficulty) => {
                this.state.difficulty = difficulty;
            },
            onReferenceNoteToggle: (checked) => {
                this.state.playReferenceNote = checked;
            }
        });
        
        // Set up spell button listeners
        this.ui.setupSpellButtonListeners((note, button) => {
            if (!this.state.isPlayerTurn || this.state.hasFailed) return;
            
            this.state.playerSequence.push(note);
            this.audio.playNote(note, 0.3, button);
            
            this.checkPlayerSequence();
        });
        
        // Add keyboard listener for game controls and developer mode
        document.addEventListener('keydown', (event) => {
            // Toggle developer mode if enabled in config
            if (DEVELOPER_MODE.enabled && event.key === DEVELOPER_MODE.toggleKey) {
                this.toggleDeveloperMode();
                return;
            }

            // Auto-complete sequence with configured key in developer mode
            if (DEVELOPER_MODE.enabled && 
                this.state.isDeveloperModeActive && 
                event.key === DEVELOPER_MODE.autoCompleteKey && 
                this.state.isPlayerTurn &&
                !this.state.hasFailed) {
                this.autoCompleteSequence();
                return;
            }

            // Handle regular key presses
            this.handleKeyPress(event);
        });
        
        // Load and display scores
        this.updateScoresTable();
    }
    
    // Toggle developer mode
    toggleDeveloperMode() {
        this.state.isDeveloperModeActive = !this.state.isDeveloperModeActive;
        this.ui.setBattleMessage(
            this.state.isDeveloperModeActive ? 
            'developer.enabled' : 
            'developer.disabled'
        );
    }
    
    // Auto-complete sequence in developer mode
    autoCompleteSequence() {
        this.state.playerSequence = [...this.state.spellSequence];
        this.audio.playSoundEffect('success');
        this.handlePlayerSuccess();
    }
    
    // Start the game
    startGame() {
        this.audio.initAudio();
        this.state.playerHealth = 100;
        this.state.currentLevel = 0;
        this.state.defeatedEnemies = [];
        this.setupDifficulty();
        this.scoreManager.resetScore();  // Resetear la puntuación al empezar
        
        // Limpiar y reiniciar el mensaje de batalla
        this.ui.setBattleMessage('battle.prepare');
        
        // Inicializar el mapa de progreso
        this.ui.initializeProgressMap(
            this.enemies, 
            this.state.currentLevel, 
            this.state.defeatedEnemies,
            (index) => this.selectEnemy(index)
        );
        this.ui.showScreen(this.ui.mapScreen);
    }
    
    // Set up difficulty
    setupDifficulty() {
        const config = DIFFICULTY_CONFIG[this.state.difficulty];
        this.state.availableNotes = config.notes;
    }
    
    // Select an enemy to fight
    selectEnemy(index) {
        if (index > this.state.currentLevel) return;
        
        this.state.currentLevel = index;
        this.state.isPlayerTurn = false;  // Asegurarnos de que el jugador no pueda interactuar hasta que empiece el combate
        this.state.hasFailed = false;     // Resetear el estado de fallo
        this.state.spellSequence = [];    // Limpiar la secuencia anterior
        this.state.playerSequence = [];   // Limpiar la secuencia del jugador
        
        this.state.currentEnemy = this.enemies[index];
        this.ui.setEnemyInfo(this.state.currentEnemy.id, this.state.currentEnemy.emoji);
        this.startLevel();
        this.ui.showScreen(this.ui.battleScreen);
    }

    // Start a level
    startLevel() {
        // Reset combat-specific state
        this.state.isPlayerTurn = false;
        this.state.hasFailed = false;
        this.state.spellSequence = [];
        this.state.playerSequence = [];
        
        // Set up enemy
        this.state.currentEnemy = this.enemies[this.state.currentLevel];
        this.state.enemyHealth = this.state.currentEnemy.health;
        this.state.enemyMaxHealth = this.state.currentEnemy.health;
        
        // Update UI - Pass enemy ID instead of translated name
        this.ui.setEnemyInfo(this.state.currentEnemy.id, this.state.currentEnemy.emoji);
        this.ui.updateHealthBars(
            this.state.playerHealth, 
            this.state.playerMaxHealth, 
            this.state.enemyHealth, 
            this.state.enemyMaxHealth
        );
        this.ui.setBattleMessage('battle.prepare');
        this.ui.toggleSpellButtons(false);
        
        // Actualizar la puntuación en tiempo real
        this.updateBattleScore();
        
        // Si está activada la nota de referencia, reproducirla antes de empezar
        if (this.state.playReferenceNote) {
            this.playReferenceNote();
        } else {
            this.startEnemyTurn();
        }
    }

    // Actualizar la puntuación en tiempo real durante el combate
    updateBattleScore() {
        const currentScore = this.scoreManager.getCurrentScore();
        const battleScoreElement = document.getElementById('battle-score').querySelector('span');
        
        if (battleScoreElement) {
            battleScoreElement.dataset.score = currentScore;
            battleScoreElement.textContent = i18n.t('map.currentScore', { score: currentScore.toLocaleString() });
        }
    }
    
    // Start enemy turn
    startEnemyTurn() {
        this.ui.setBattleMessage('battle.enemyTurn', { 
            enemy: i18n.t(`enemies.${this.state.currentEnemy.id}.name`),
            enemyId: this.state.currentEnemy.id 
        });
        this.state.isPlayerTurn = false;
        this.state.spellSequence = [];
        this.state.playerSequence = [];
        
        // Generate sequence based on difficulty and level
        const config = DIFFICULTY_CONFIG[this.state.difficulty];
        const sequenceLength = config.baseSequenceLength + this.state.currentEnemy.difficulty;
        
        for (let i = 0; i < sequenceLength; i++) {
            const randomNote = this.state.availableNotes[
                Math.floor(Math.random() * this.state.availableNotes.length)
            ];
            this.state.spellSequence.push(randomNote);
        }
        
        // Play sequence
        const timer = setTimeout(() => this.playSequence(), 1000);
        this.addTimer(timer);
    }
    
    // Play the spell sequence
    playSequence() {
        this.ui.toggleSpellButtons(false);
        let i = 0;
        
        const interval = setInterval(() => {
            this.audio.playNote(this.state.spellSequence[i]);
            
            i++;
            if (i >= this.state.spellSequence.length) {
                clearInterval(interval);
                const timer = setTimeout(() => this.startPlayerTurn(), 500);
                this.addTimer(timer);
            }
        }, 800);
        
        // Store interval ID as a timer to clean up if needed
        this.addTimer(interval);
    }
    
    // Start player turn
    startPlayerTurn() {
        this.state.isPlayerTurn = true;
        this.state.playerSequence = [];
        this.state.hasFailed = false;  // Resetear el flag al comenzar un nuevo turno
        this.ui.setBattleMessage('battle.playerTurn');
        this.ui.toggleSpellButtons(true, this.state.availableNotes);
    }
    
    // Check player sequence
    checkPlayerSequence() {
        // Si ya hemos fallado en esta secuencia, ignorar más entradas
        if (this.state.hasFailed) {
            return;
        }

        const currentIndex = this.state.playerSequence.length - 1;
        
        // Verificar si la nota actual es correcta
        if (this.state.playerSequence[currentIndex] !== this.state.spellSequence[currentIndex]) {
            // Marcar que hemos fallado para ignorar más entradas
            this.state.hasFailed = true;
            
            // Desactivar los botones inmediatamente
            this.ui.toggleSpellButtons(false);
            
            // Failure - Wait a moment before showing feedback
            setTimeout(() => {
                this.audio.playSoundEffect('fail');
                this.handlePlayerFail();
            }, 500);
            return;
        }
        
        // Si la secuencia está completa y todas las notas son correctas
        if (this.state.playerSequence.length === this.state.spellSequence.length) {
            // Desactivar los botones después de completar correctamente la secuencia
            this.ui.toggleSpellButtons(false);
            
            // Complete correct sequence - Wait a moment
            setTimeout(() => {
                this.audio.playSoundEffect('success');
                this.handlePlayerSuccess();
            }, 500);
        }
    }
    
    // Handle player success
    handlePlayerSuccess() {
        // Desactivar botones durante la animación
        this.ui.toggleSpellButtons(false);
        
        const damage = 20 + Math.floor(Math.random() * 10);
        this.state.enemyHealth -= damage;
        
        if (this.state.enemyHealth < 0) {
            this.state.enemyHealth = 0;
        }
        
        this.ui.showMagicEffect('player-cast');
        this.ui.setBattleMessage('battle.spellHit', { damage });
        this.ui.updateHealthBars(
            this.state.playerHealth, 
            this.state.playerMaxHealth, 
            this.state.enemyHealth, 
            this.state.enemyMaxHealth
        );
        
        // Sumar puntos por hechizo exitoso
        this.scoreManager.addSpellSuccess(this.state.currentEnemy.difficulty, this.state.playReferenceNote);
        this.updateBattleScore();
        
        if (this.state.enemyHealth <= 0) {
            this.state.isPlayerTurn = false;
            this.ui.setBattleMessage('battle.victory');
            
            // Añadir bonus por victoria
            this.scoreManager.addVictoryBonus(this.state.currentEnemy.difficulty, this.state.playReferenceNote);
            this.updateBattleScore();
            
            // Retardar para mostrar el mensaje
            setTimeout(() => {
                this.audio.playSoundEffect('win');
                
                // Añadir enemigo a la lista de derrotados
                this.state.defeatedEnemies.push(this.state.currentLevel);
                
                const currentScore = this.scoreManager.getCurrentScore();
                this.state.currentLevel++;
                
                // Victoria final
                if (this.state.currentLevel >= this.enemies.length) {
                    if (this.scoreManager.isHighScore(currentScore)) {
                        this.showInscriptionScreen(currentScore, this.state.currentLevel - 1);
                    } else {
                        this.showResultScreen();
                    }
                } else {
                    this.ui.initializeProgressMap(
                        this.enemies,
                        this.state.currentLevel,
                        this.state.defeatedEnemies,
                        (index) => this.selectEnemy(index),
                        currentScore
                    );
                    this.ui.showScreen(this.ui.mapScreen);
                }
            }, 2500);
        } else {
            setTimeout(() => this.startEnemyTurn(), 2500);
        }
    }
    
    // Handle player failure
    handlePlayerFail() {
        this.ui.toggleSpellButtons(false);
        
        const damage = 10 + Math.floor(Math.random() * 10);
        this.state.playerHealth -= damage;
        
        if (this.state.playerHealth < 0) this.state.playerHealth = 0;
        
        this.ui.showMagicEffect('enemy-cast');
        this.ui.setBattleMessage('battle.spellFail', { damage });
        this.ui.updateHealthBars(
            this.state.playerHealth, 
            this.state.playerMaxHealth, 
            this.state.enemyHealth, 
            this.state.enemyMaxHealth
        );
        
        // Restar puntos por fallo
        this.scoreManager.addSpellFailure();
        this.updateBattleScore();
        
        if (this.state.playerHealth <= 0) {
            // Limpiar contenido existente
            const battleMessage = document.getElementById('battle-message');
            battleMessage.innerHTML = '';
            
            // Crear contenedor para el mensaje
            const messageContainer = document.createElement('div');
            messageContainer.className = 'battle-message-content';
            
            // Configurar el mensaje
            battleMessage.dataset.i18n = 'battle.defeat';
            battleMessage.dataset.enemyId = this.state.currentEnemy.id;
            battleMessage.dataset.score = this.scoreManager.getCurrentScore();
            
            messageContainer.textContent = i18n.t('battle.defeat', {
                enemy: i18n.t(`enemies.${this.state.currentEnemy.id}.name`),
                score: this.scoreManager.getCurrentScore().toLocaleString()
            });
            
            // Crear contenedor del botón
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'continue-button-container';
            
            // Crear el botón
            const continueButton = document.createElement('button');
            continueButton.dataset.i18n = 'buttons.continue';
            continueButton.textContent = i18n.t('buttons.continue');
            continueButton.className = 'continue-btn';
            
            // Agregar los elementos al DOM
            battleMessage.appendChild(messageContainer);
            buttonContainer.appendChild(continueButton);
            battleMessage.appendChild(buttonContainer);
            
            // Agregar el evento click
            continueButton.addEventListener('click', () => {
                this.forceDefeatTransition();
            });
        } else {
            const timer = setTimeout(() => this.startEnemyTurn(), 2500); // Aumentado de 1500 a 2500 ms
            this.addTimer(timer);
        }
    }
    
    // Método para forzar la transición después de una derrota
    forceDefeatTransition() {
        this.state.isPlayerTurn = false;  // Asegurar que el turno del jugador termina
        this._completeDefeatTransition();
    }

    // Método privado para completar la transición de derrota
    _completeDefeatTransition() {
        // Obtener puntuación final
        const finalScore = this.scoreManager.getCurrentScore();
        
        // Determinar si la puntuación es suficiente para el hall of fame
        const isHighScore = finalScore > 0 && this.scoreManager.isHighScore(finalScore);
        
        // Configurar la pantalla de resultado con el mensaje apropiado
        this.ui.setResultScreen(
            'battle.defeat',
            isHighScore ? 'battle.defeatHighScore' : 'battle.defeatNotHighScore',
            false,
            { 
                enemy: i18n.t(`enemies.${this.state.currentEnemy.id}.name`),
                enemyId: this.state.currentEnemy.id,
                score: finalScore.toLocaleString()
            }
        );
        
        // Reproducir sonido de derrota
        this.audio.playSoundEffect('lose');
        
        // Mostrar la pantalla de resultado
        this.ui.showScreen(this.ui.resultScreen);
        
        // Limpiar los botones existentes
        const resultScreen = document.getElementById('result-screen');
        const existingButtons = resultScreen.querySelectorAll('button');
        existingButtons.forEach(button => button.remove());
        
        // Crear los nuevos botones
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'result-buttons';
        
        if (isHighScore) {
            const enterHallOfFameBtn = document.createElement('button');
            enterHallOfFameBtn.dataset.i18n = 'buttons.enterHallOfFame';
            enterHallOfFameBtn.textContent = i18n.t('buttons.enterHallOfFame');
            // Usar bind para asegurar el contexto correcto de 'this'
            const boundShowInscription = () => this.showInscriptionScreen(finalScore, this.state.currentLevel);
            enterHallOfFameBtn.addEventListener('click', boundShowInscription);
            buttonContainer.appendChild(enterHallOfFameBtn);
        }
        
        // Siempre añadir el botón de volver al inicio
        const returnBtn = document.createElement('button');
        returnBtn.dataset.i18n = 'buttons.returnToStart';
        returnBtn.textContent = i18n.t('buttons.returnToStart');
        returnBtn.addEventListener('click', () => {
            this.ui.showScreen(this.ui.startScreen);
        });
        buttonContainer.appendChild(returnBtn);
        
        // Añadir el contenedor de botones al DOM
        resultScreen.appendChild(buttonContainer);
    }

    // Handle click on "Next Battle"
    handleNextBattle() {
        const currentScore = this.scoreManager.getCurrentScore();  // Usar getCurrentScore en lugar de calculateScore
        this.ui.initializeProgressMap(
            this.enemies,
            this.state.currentLevel,
            this.state.defeatedEnemies,
            (index) => this.selectEnemy(index),
            currentScore
        );
        this.ui.showScreen(this.ui.mapScreen);
    }

    // Show result screen based on game state
    showResultScreen() {
        if (this.state.currentLevel >= this.enemies.length) {
            this.ui.setResultScreen(
                'victory',
                'battle.finalVictory',
                false
            );
        } else {
            this.ui.setResultScreen(
                'victory',
                'battle.victory',
                true,
                { 
                    enemy: i18n.t(`enemies.${this.state.currentEnemy.id}.name`),
                    enemyId: this.state.currentEnemy.id
                }
            );
        }
        
        this.ui.showScreen(this.ui.resultScreen);
    }
    
    // Handle key presses
    handleKeyPress(event) {
        if (!this.state.isPlayerTurn || this.state.hasFailed) return;
        
        // Ignorar pulsaciones si ya tenemos todas las notas necesarias
        if (this.state.playerSequence.length >= this.state.spellSequence.length) {
            return;
        }
        
        const key = event.key.toLowerCase();
        
        if (KEYBOARD_MAPPING[key] && this.state.availableNotes.includes(KEYBOARD_MAPPING[key])) {
            const note = KEYBOARD_MAPPING[key];
            
            // Visual effect on button
            const noteButton = document.querySelector(`.spell-btn[data-note="${note}"]`);
            if (noteButton) {
                noteButton.classList.add('keyboard-press');
                setTimeout(() => {
                    noteButton.classList.remove('keyboard-press');
                }, 200);
            }
            
            this.state.playerSequence.push(note);
            this.audio.playNote(note, 0.3);
            
            this.checkPlayerSequence();
        }
    }
    
    // Update scores table
    updateScoresTable() {
        const scores = this.scoreManager.getTopScores();
        const tbody = document.getElementById('scores-list');
        tbody.innerHTML = '';
        
        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.playerName}</td>
                <td>${ScoreManager.formatScore(score.score)}</td>
                <td>${score.level}</td>
                <td>${this.getDifficultyLabel(score.difficulty)}</td>
                <td>${score.usedReference ? '✓' : '✗'}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Get difficulty label
    getDifficultyLabel(difficulty) {
        return i18n.t(`difficulty.${difficulty}`);
    }
    
    // Show new score dialog
    showHighscoreDialog(score = 0, level = 0) {
        this.finalScoreSpan.textContent = ScoreManager.formatScore(score);
        this.finalLevelSpan.textContent = String(level);
        this.playerNameInput.value = '';
        this.highscoreDialog.classList.remove('hidden');
        this.playerNameInput.focus();
        
        // Eliminar manejador anterior si existe
        if (this._handleDialogClose) {
            this.highscoreDialog.removeEventListener('click', this._handleDialogClose);
        }
        
        // Crear nuevo manejador
        this._handleDialogClose = (e) => {
            if (e.target === this.highscoreDialog) {
                this.hideHighscoreDialog();
                this.ui.showScreen(this.ui.resultScreen);
            }
        };
        
        this.highscoreDialog.addEventListener('click', this._handleDialogClose);
    }
    
    // Hide new score dialog
    hideHighscoreDialog() {
        this.highscoreDialog.classList.add('hidden');
        
        // Limpiar el manejador del evento
        if (this._handleDialogClose) {
            this.highscoreDialog.removeEventListener('click', this._handleDialogClose);
            this._handleDialogClose = null;
        }
    }

    // Validar y mostrar la pantalla de inscripción
    validateAndShowInscription(score, level) {
        const inscriptionScreen = document.getElementById('inscription-screen');
        const scoreValue = document.querySelector('.final-score .score-value');
        const levelValue = document.querySelector('.final-level .level-value');
        const inscriptionName = document.getElementById('inscription-name');
        
        if (!inscriptionScreen || !scoreValue || !levelValue || !inscriptionName) {
            console.error('Elementos de inscripción no encontrados');
            this.ui.showScreen(this.ui.startScreen);
            return false;
        }
        
        // Actualizar valores
        scoreValue.textContent = ScoreManager.formatScore(score);
        levelValue.textContent = String(level + 1);
        inscriptionName.value = '';
        
        this.ui.showScreen(inscriptionScreen);
        
        // Enfocar el campo de nombre
        setTimeout(() => {
            inscriptionName.focus();
        }, 100);
        
        return true;
    }

    // Mostrar la pantalla de inscripción
    showInscriptionScreen(score, level) {
        const inscriptionScreen = document.getElementById('inscription-screen');
        const scoreValue = document.querySelector('.final-score .score-value');
        const levelValue = document.querySelector('.final-level .level-value');
        const inscriptionName = document.getElementById('inscription-name');
        
        if (!inscriptionScreen || !scoreValue || !levelValue || !inscriptionName) {
            console.error('Elementos de inscripción no encontrados');
            this.ui.showScreen(this.ui.startScreen);
            return false;
        }
        
        // Actualizar valores
        scoreValue.textContent = ScoreManager.formatScore(score);
        levelValue.textContent = String(level + 1);
        inscriptionName.value = '';
        
        this.ui.showScreen(inscriptionScreen);
        
        // Enfocar el campo de nombre
        setTimeout(() => {
            inscriptionName.focus();
        }, 100);
        
        return true;
    }

    // Manejar la confirmación de inscripción
    handleInscriptionConfirm() {
        const playerName = this.inscriptionName.value.trim();
        if (!playerName) {
            alert(i18n.t('hallOfFame.enterNameAlert'));
            this.inscriptionName.focus();
            return;
        }
        
        // Guardar la puntuación
        this.scoreManager.addScore(this.state, playerName);
        
        // Actualizar la tabla de puntuaciones
        this.updateScoresTable();
        
        // Reproducir un efecto de sonido de éxito
        this.audio.playSoundEffect('success');
        
        // Mostrar la pantalla de inicio inmediatamente
        this.ui.showScreen(this.ui.startScreen);
    }

    // Manejar la cancelación de inscripción
    handleInscriptionCancel() {
        this.ui.showScreen(this.ui.startScreen);
    }

    // Play reference note before battle
    playReferenceNote() {
        this.ui.setBattleMessage('battle.referenceNote');
        setTimeout(() => {
            this.audio.playNote('do', 1.0);
            setTimeout(() => this.startEnemyTurn(), 1500);
        }, 1000);
    }

    // Helper to manage timers
    addTimer(timer) {
        this.gameTimers.push(timer);
    }

    cleanup() {
        // Clear all active timers
        this.gameTimers.forEach(timer => clearTimeout(timer));
        this.gameTimers = [];
        
        // Clean up audio effects
        this.audio.cleanup();
    }
}