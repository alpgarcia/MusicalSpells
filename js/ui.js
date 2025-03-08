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
            element.textContent = i18n.t(key);
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = i18n.t(key);
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
        this.battleMessage.textContent = i18n.t(messageKey, replacements);
    }

    // Set enemy information
    setEnemyInfo(name, emoji) {
        this.enemyName.textContent = name;
        this.enemyImage.textContent = emoji;
    }

    // Set up the result screen
    setResultScreen(titleKey, messageKey, showNextBattleBtn, replacements = {}) {
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
        scoreDisplay.textContent = `${i18n.t('map.currentScore', { score: currentScore.toLocaleString() })}`;
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
            enemyName.textContent = enemy.name;
            
            // Create enemy level with new translation format
            const enemyLevel = document.createElement('div');
            enemyLevel.className = 'enemy-level';
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
            mapDescription.textContent = i18n.t('map.allDefeated');
            return;
        }
        
        const nextEnemy = enemies[currentLevel];
        mapDescription.textContent = i18n.t('map.nextDuel', {
            enemy: nextEnemy.name,
            difficulty: '★'.repeat(nextEnemy.difficulty)
        });
    }
}