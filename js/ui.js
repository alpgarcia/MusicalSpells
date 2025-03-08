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
 * ui.js - User interface management for Musical Spells
 */

import { i18n } from './i18n.js';
import { GAME_VERSION } from './config.js';

// Class to handle the user interface
export class UIManager {
    constructor() {
        // Screen references
        this.startScreen = document.getElementById('start-screen');
        this.mapScreen = document.getElementById('map-screen');
        this.battleScreen = document.getElementById('battle-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.inscriptionScreen = document.getElementById('inscription-screen');
        
        // Main button references
        this.startGameBtn = document.getElementById('start-game');
        this.nextBattleBtn = document.getElementById('next-battle');
        this.restartGameBtn = document.getElementById('restart-game');
        this.returnToMenuBtn = document.getElementById('return-to-menu');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.referenceNoteToggle = document.getElementById('reference-note-toggle');
        
        // Common UI element references
        this.battleMessage = document.getElementById('battle-message');
        this.playerHealthBar = document.getElementById('player-health');
        this.enemyHealthBar = document.getElementById('enemy-health');
        this.playerHealthText = document.getElementById('player-health-text');
        this.enemyHealthText = document.getElementById('enemy-health-text');
        this.playerMaxHealthText = document.getElementById('player-max-health-text');
        this.enemyMaxHealthText = document.getElementById('enemy-max-health-text');
        this.enemyName = document.getElementById('enemy-name');
        this.enemyImage = document.getElementById('enemy-image');
        
        this.spellInstruction = document.getElementById('spell-instruction');
        this.spellButtons = document.getElementById('spell-buttons');
        this.spellBtns = document.querySelectorAll('.spell-btn');
        
        this.resultTitle = document.getElementById('result-title');
        this.resultMessage = document.getElementById('result-message');

        // Language selector reference
        this.languageSelector = document.querySelector('.language-selector');

        // Version reference
        this.versionSpan = document.getElementById('game-version');
    }

    // Initialize the UI
    async init() {
        // Initialize translations first
        await this.initTranslations();

        // Initialize version number
        if (this.versionSpan) {
            this.versionSpan.textContent = GAME_VERSION;
        }

        // Set up language buttons
        if (this.languageSelector) {
            this.languageSelector.addEventListener('click', (e) => {
                const langBtn = e.target.closest('.lang-btn');
                if (langBtn) {
                    const lang = langBtn.dataset.lang;
                    i18n.setLanguage(lang);
                    this.updateLanguageButtons();
                }
            });
        }
    }

    // Initialize translation system
    async initTranslations() {
        await i18n.init();
        this.updateLanguageButtons();
        this.translateInterface();
        
        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.translateInterface();
        });
    }

    // Update interface to current language
    translateInterface() {
        // Translate elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            
            // Skip battle message if it contains the continue button
            if (element.id === 'battle-message' && element.querySelector('.continue-btn')) {
                // Reuse setBattleMessage to handle the translation preserving structure
                const replacements = {};
                if (element.dataset.enemyId) {
                    replacements.enemyId = element.dataset.enemyId;
                    replacements.enemy = i18n.t(`enemies.${element.dataset.enemyId}.name`);
                }
                if (element.dataset.score) {
                    replacements.score = element.dataset.score;
                }
                if (element.dataset.damage) {
                    replacements.damage = element.dataset.damage;
                }
                this.setBattleMessage(key, replacements);
                return;
            }
            
            // Check for dynamic values in data attributes
            const replacements = {};
            
            // Handle score
            if (element.dataset.score !== undefined) {
                replacements.score = element.dataset.score;
                // Formatear el score si es un número
                if (!isNaN(element.dataset.score)) {
                    replacements.score = parseInt(element.dataset.score).toLocaleString();
                }
            }
            
            // Handle level number
            if (element.dataset.number !== undefined) {
                replacements.number = element.dataset.number;
            }
            
            // Handle custom level (para la pantalla de inscripción)
            if (element.dataset.level !== undefined) {
                replacements.level = element.dataset.level;
            }
            
            // Handle enemy name with special case for battle and map messages
            if ((key === 'battle.enemyTurn' || key === 'map.nextDuel' || key === 'battle.defeat') && element.dataset.enemyId) {
                replacements.enemy = i18n.t(`enemies.${element.dataset.enemyId}.name`);
            } else if (element.dataset.enemy !== undefined) {
                replacements.enemy = element.dataset.enemy;
            }
            
            // Handle difficulty
            if (element.dataset.difficulty !== undefined) {
                replacements.difficulty = element.dataset.difficulty;
            }

            // Handle damage
            if (element.dataset.damage !== undefined) {
                replacements.damage = element.dataset.damage;
            }
            
            // Translate with replacements if any exist
            element.textContent = i18n.t(key, Object.keys(replacements).length > 0 ? replacements : undefined);
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = i18n.t(key);
        });

        // Translate continue buttons specifically
        document.querySelectorAll('.continue-btn').forEach(button => {
            if (button.dataset.i18n) {
                button.textContent = i18n.t(button.dataset.i18n);
            }
        });
    }

    // Update language buttons
    updateLanguageButtons() {
        const currentLang = i18n.getCurrentLanguage();
        this.languageSelector.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    // Set up main button event listeners
    setupMainButtonListeners(handlers) {
        // Set up main button event listeners if they exist
        if (this.startGameBtn) {
            this.startGameBtn.addEventListener('click', handlers.onStartGame);
        }
        
        if (this.nextBattleBtn) {
            this.nextBattleBtn.addEventListener('click', handlers.onNextBattle);
        }
        
        if (this.restartGameBtn) {
            this.restartGameBtn.addEventListener('click', handlers.onRestartGame);
        }
        
        if (this.returnToMenuBtn) {
            this.returnToMenuBtn.addEventListener('click', handlers.onReturnToMenu);
        }
        
        // Set up difficulty buttons
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (handlers.onDifficultyChange) {
                    handlers.onDifficultyChange(btn.getAttribute('data-difficulty'));
                }
            });
        });
        
        // Set up reference note toggle
        if (this.referenceNoteToggle) {
            this.referenceNoteToggle.addEventListener('change', () => {
                if (handlers.onReferenceNoteToggle) {
                    handlers.onReferenceNoteToggle(this.referenceNoteToggle.checked);
                }
            });
        }
    }

    // Set up spell button event listeners
    setupSpellButtonListeners(onSpellButtonClick) {
        this.spellBtns.forEach(btn => {
            // Función común para manejar la interacción
            const handleInteraction = () => {
                // Evitar que el botón responda si está oculto
                if (!btn.classList.contains('visible')) return;
                
                const note = btn.getAttribute('data-note');
                onSpellButtonClick(note, btn);
            };

            // Añadir listeners para click y touch
            btn.addEventListener('click', handleInteraction);
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevenir el click fantasma
                handleInteraction();
            });
            
            // Prevent double tap zoom on mobile
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
            });
        });
    }

    // Show a specific screen and hide others
    showScreen(screen) {
        this.startScreen.classList.add('hidden');
        this.mapScreen.classList.add('hidden');
        this.battleScreen.classList.add('hidden');
        this.resultScreen.classList.add('hidden');
        this.inscriptionScreen.classList.add('hidden');
        
        // Si estamos saliendo de la pantalla de batalla, limpiar el mensaje
        if (screen !== this.battleScreen) {
            this.setBattleMessage('battle.prepare');
        }
        
        // Si estamos mostrando la pantalla de inscripción, asegurar que los placeholders estén traducidos
        if (screen === this.inscriptionScreen) {
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                element.placeholder = i18n.t(key);
            });
        }
        
        screen.classList.remove('hidden');
    }

    // Update health bars
    updateHealthBars(playerHealth, playerMaxHealth, enemyHealth, enemyMaxHealth) {
        // Calcular porcentajes para las barras
        const playerHealthPercent = (playerHealth / playerMaxHealth) * 100;
        const enemyHealthPercent = (enemyHealth / enemyMaxHealth) * 100;
        
        // Actualizar el ancho de las barras basado en el porcentaje
        this.playerHealthBar.style.width = `${Math.min(100, playerHealthPercent)}%`;
        this.enemyHealthBar.style.width = `${Math.min(100, enemyHealthPercent)}%`;
        
        // Mostrar los valores reales de energía en el texto
        this.playerHealthText.textContent = Math.round(playerHealth);
        this.enemyHealthText.textContent = Math.round(enemyHealth);
        this.playerMaxHealthText.textContent = Math.round(playerMaxHealth);
        this.enemyMaxHealthText.textContent = Math.round(enemyMaxHealth);
        
        // Change color based on relative health percentage
        if (playerHealthPercent < 30) {
            this.playerHealthBar.style.backgroundColor = '#F44336';
        } else if (playerHealthPercent < 60) {
            this.playerHealthBar.style.backgroundColor = '#FF9800';
        } else {
            this.playerHealthBar.style.backgroundColor = '#4CAF50';
        }
        
        if (enemyHealthPercent < 30) {
            this.enemyHealthBar.style.backgroundColor = '#F44336';
        } else if (enemyHealthPercent < 60) {
            this.enemyHealthBar.style.backgroundColor = '#FF9800';
        } else {
            this.enemyHealthBar.style.backgroundColor = '#4CAF50';
        }
    }

    // Show a message on the battle screen
    setBattleMessage(messageKey, replacements = {}) {
        // Si el mensaje contiene una estructura específica (como el botón de continuar),
        // necesitamos preservarla
        const continueBtn = this.battleMessage.querySelector('.continue-btn');
        
        // Limpiar el contenido anterior y los data attributes
        this.battleMessage.innerHTML = '';
        for (const key of Object.keys(this.battleMessage.dataset)) {
            if (key !== 'i18n') {
                delete this.battleMessage.dataset[key];
            }
        }
        
        // Establecer el nuevo mensaje
        this.battleMessage.dataset.i18n = messageKey;
        
        // Store dynamic values in data attributes
        for (const [key, value] of Object.entries(replacements)) {
            this.battleMessage.dataset[key] = value;
            if ((messageKey === 'battle.enemyTurn' || messageKey === 'battle.defeat') && 
                key === 'enemy' && replacements.enemyId) {
                this.battleMessage.dataset.enemyId = replacements.enemyId;
            }
        }
        
        // Traducir el mensaje
        let translatedMessage = i18n.t(messageKey, replacements);
        
        // Si teníamos un botón de continuar y estamos mostrando el mensaje de derrota,
        // necesitamos preservar la estructura
        if (continueBtn && messageKey === 'battle.defeat') {
            const container = document.createElement('div');
            container.className = 'battle-message-content';
            container.textContent = translatedMessage;
            
            // Restaurar el botón
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'continue-button-container';
            buttonContainer.appendChild(continueBtn);
            
            this.battleMessage.appendChild(container);
            this.battleMessage.appendChild(buttonContainer);
        } else {
            // Para cualquier otro mensaje, simplemente mostrar el texto
            this.battleMessage.textContent = translatedMessage;
        }
    }

    // Set enemy information
    setEnemyInfo(name, emoji) {
        this.enemyName.dataset.i18n = `enemies.${name}.name`;
        this.enemyName.textContent = i18n.t(`enemies.${name}.name`);
        this.enemyImage.textContent = emoji;
    }

    // Set up the result screen
    setResultScreen(titleKey, messageKey, showNextBattleBtn, replacements = {}) {
        this.resultTitle.dataset.i18n = titleKey;
        this.resultMessage.dataset.i18n = messageKey;
        
        // Clear any existing dynamic data attributes
        for (const key of Object.keys(this.resultTitle.dataset)) {
            if (key !== 'i18n') {
                delete this.resultTitle.dataset[key];
            }
        }
        for (const key of Object.keys(this.resultMessage.dataset)) {
            if (key !== 'i18n') {
                delete this.resultMessage.dataset[key];
            }
        }
        
        // Store dynamic values in data attributes
        for (const [key, value] of Object.entries(replacements)) {
            this.resultTitle.dataset[key] = value;
            this.resultMessage.dataset[key] = value;
            
            // If this is a battle message and we have an enemyId, store it
            if (key === 'enemy' && replacements.enemyId) {
                this.resultTitle.dataset.enemyId = replacements.enemyId;
                this.resultMessage.dataset.enemyId = replacements.enemyId;
            }
        }
        
        // If we have a stored enemy ID and this is a battle message
        if ((messageKey.startsWith('battle.') || titleKey.startsWith('battle.')) && 
            this.resultMessage.dataset.enemyId) {
            replacements.enemy = i18n.t(`enemies.${this.resultMessage.dataset.enemyId}.name`);
        }
        
        this.resultTitle.textContent = i18n.t(titleKey, replacements);
        this.resultMessage.textContent = i18n.t(messageKey, replacements);
        
        if (showNextBattleBtn) {
            this.nextBattleBtn.classList.remove('hidden');
        } else {
            this.nextBattleBtn.classList.add('hidden');
        }
    }

    // Show or hide spell buttons
    toggleSpellButtons(show, availableNotes = []) {
        if (show) {
            this.spellInstruction.classList.remove('hidden');
            this.spellButtons.classList.remove('hidden');
            
            // Show only available note buttons
            this.spellBtns.forEach(btn => {
                const note = btn.getAttribute('data-note');
                if (availableNotes.includes(note)) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            });
        } else {
            this.spellInstruction.classList.add('hidden');
            this.spellButtons.classList.add('hidden');
        }
    }

    // Show a magic effect in battle
    showMagicEffect(type) {
        const battleArea = document.querySelector('.battle-area');
        const magicEffect = document.createElement('div');
        magicEffect.classList.add('magic-effect', type);
        magicEffect.textContent = '✨';
        battleArea.appendChild(magicEffect);
        
        setTimeout(() => {
            magicEffect.remove();
        }, 2000);
    }

    // Initialize the progress map
    initializeProgressMap(enemies, currentLevel, defeatedEnemies, onEnemySelect, currentScore = 0) {
        const progressMap = document.querySelector('.progress-map');
        const enemiesMap = document.getElementById('enemies-map');
        
        // Clear existing score marker if any
        const existingScore = progressMap.querySelector('.current-score');
        if (existingScore) {
            existingScore.remove();
        }
        
        // Clear enemies map
        enemiesMap.innerHTML = '';
        
        // Add current score indicator before enemies container
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'current-score';
        const scoreSpan = document.createElement('span');
        scoreSpan.dataset.i18n = 'map.currentScore';
        scoreSpan.dataset.score = currentScore;
        scoreSpan.textContent = i18n.t('map.currentScore', { score: currentScore.toLocaleString() });
        scoreDisplay.appendChild(scoreSpan);
        progressMap.insertBefore(scoreDisplay, enemiesMap);
        
        // Create markers for each enemy
        enemies.forEach((enemy, index) => {
            const enemyMarker = document.createElement('div');
            enemyMarker.className = 'enemy-marker';
            enemyMarker.dataset.index = index;
            
            // Apply classes based on state
            if (defeatedEnemies.includes(index)) {
                enemyMarker.classList.add('defeated');
            } else if (index === currentLevel) {
                enemyMarker.classList.add('current');
            } else if (index > currentLevel) {
                enemyMarker.classList.add('locked');
            }
            
            // Create enemy icon
            const enemyIcon = document.createElement('div');
            enemyIcon.className = 'enemy-icon';
            enemyIcon.textContent = enemy.emoji;
            
            // Create enemy name
            const enemyName = document.createElement('div');
            enemyName.className = 'enemy-name';
            enemyName.dataset.i18n = `enemies.${enemy.id}.name`;
            enemyName.textContent = enemy.name;
            
            // Create enemy level
            const enemyLevel = document.createElement('div');
            enemyLevel.className = 'enemy-level';
            enemyLevel.dataset.i18n = 'map.level';
            enemyLevel.dataset.number = index + 1;
            enemyLevel.textContent = i18n.t('map.level', { number: index + 1 });
            
            // Build marker
            enemyMarker.appendChild(enemyIcon);
            enemyMarker.appendChild(enemyName);
            enemyMarker.appendChild(enemyLevel);
            
            // Add click event only to available enemies
            if (index <= currentLevel) {
                enemyMarker.addEventListener('click', () => onEnemySelect(index));
                enemyMarker.style.cursor = 'pointer';
            }
            
            // Add to map
            enemiesMap.appendChild(enemyMarker);
        });
        
        this.updateMapDescription(enemies, currentLevel);
    }

    // Update map description
    updateMapDescription(enemies, currentLevel) {
        const mapDescription = document.getElementById('map-description');
        
        if (currentLevel >= enemies.length) {
            mapDescription.dataset.i18n = 'map.allDefeated';
            mapDescription.textContent = i18n.t('map.allDefeated');
            return;
        }
        
        const nextEnemy = enemies[currentLevel];
        mapDescription.dataset.i18n = 'map.nextDuel';
        mapDescription.dataset.enemyId = nextEnemy.id;
        mapDescription.dataset.difficulty = '★'.repeat(nextEnemy.difficulty);
        mapDescription.textContent = i18n.t('map.nextDuel', {
            enemy: i18n.t(`enemies.${nextEnemy.id}.name`),
            difficulty: '★'.repeat(nextEnemy.difficulty)
        });
    }
}