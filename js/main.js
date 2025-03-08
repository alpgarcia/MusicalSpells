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
 * main.js - Main entry point that initializes Musical Spells game
 */

import { AudioManager } from './audio.js';
import { UIManager } from './ui.js';
import { Game } from './game.js';
import { ENEMIES } from './enemies.js';
import { ScoreManager } from './scores.js';
import { i18n } from './i18n.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the internationalization system first
    await i18n.init();
    
    // Initialize managers
    const audioManager = new AudioManager();
    const uiManager = new UIManager();
    const scoreManager = new ScoreManager();
    
    // Initialize UI first
    await uiManager.init();
    
    // Create and initialize the game
    const game = new Game(uiManager, audioManager, ENEMIES, scoreManager);
    
    // Set up event listeners before initializing
    uiManager.setupMainButtonListeners({
        onStartGame: () => game.startGame(),
        onNextBattle: () => game.handleNextBattle(),
        onRestartGame: () => game.startGame(),
        onReturnToMenu: () => game.startGame(),
        onDifficultyChange: (difficulty) => game.state.difficulty = difficulty,
        onReferenceNoteToggle: (checked) => game.state.playReferenceNote = checked
    });
    
    // Initialize the game
    game.init();
});