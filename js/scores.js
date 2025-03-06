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
 * scores.js - Scoring system and hall of fame for Musical Spells
 */

// Puntuación base por acciones
const SCORE_CONFIG = {
    // Puntos base por acertar un hechizo
    SPELL_SUCCESS_BASE: 100,
    // Multiplicador por nivel del enemigo para hechizos acertados
    LEVEL_MULTIPLIER: 0.5,
    // Puntos que se restan por fallar un hechizo
    SPELL_FAIL_PENALTY: -50,
    // Puntos extra por derrotar a un mago según su nivel
    VICTORY_BONUS_BASE: 500
};

export class ScoreManager {
    constructor() {
        this.scores = this.loadScores();
        this.currentScore = 0;  // Nueva variable para la puntuación actual
    }

    // Load saved scores
    loadScores() {
        const savedScores = localStorage.getItem('musicalSpellsScores');
        return savedScores ? JSON.parse(savedScores) : [];
    }

    // Save scores
    saveScores() {
        localStorage.setItem('musicalSpellsScores', JSON.stringify(this.scores));
    }

    // Reset current score
    resetScore() {
        this.currentScore = 0;
        return this.currentScore;
    }

    // Add points for successful spell
    addSpellSuccess(enemyLevel) {
        const points = Math.round(SCORE_CONFIG.SPELL_SUCCESS_BASE * (1 + enemyLevel * SCORE_CONFIG.LEVEL_MULTIPLIER));
        this.currentScore += points;
        return this.currentScore;
    }

    // Subtract points for failed spell
    addSpellFailure() {
        this.currentScore += SCORE_CONFIG.SPELL_FAIL_PENALTY;
        // No permitimos puntuación negativa
        if (this.currentScore < 0) this.currentScore = 0;
        return this.currentScore;
    }

    // Add victory bonus
    addVictoryBonus(enemyLevel) {
        const bonus = SCORE_CONFIG.VICTORY_BONUS_BASE * (enemyLevel + 1);
        this.currentScore += bonus;
        return this.currentScore;
    }

    // Get current score
    getCurrentScore() {
        return this.currentScore;
    }

    // Add new score to hall of fame
    addScore(gameState, playerName) {
        const score = {
            playerName: playerName,
            score: this.currentScore,
            level: gameState.currentLevel,
            difficulty: gameState.difficulty,
            usedReference: gameState.playReferenceNote,
            date: new Date().toISOString()
        };

        this.scores.push(score);
        this.scores.sort((a, b) => b.score - a.score); // Sort from highest to lowest
        this.scores = this.scores.slice(0, 10); // Keep only top 10
        this.saveScores();

        return score;
    }

    // Get top scores
    getTopScores() {
        return this.scores;
    }

    // Check if a score would make it to the hall of fame
    isHighScore(score) {
        if (score <= 0) return false;
        return this.scores.length < 10 || score > this.scores[this.scores.length - 1].score;
    }

    // Format score for display
    static formatScore(score) {
        return score.toLocaleString();
    }
}