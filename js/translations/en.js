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
 * en.js - English translations for Musical Spells
 */

export const englishTranslations = {
    "game": {
        "title": "Musical Spells",
        "subtitle": "The Wizards' Duel",
        "description": "You are a wizard apprentice who must face other sorcerers in musical duels.",
        "instructions": "Listen and repeat the musical sequences to defeat your opponents.",
        "playerTitle": "Apprentice"
    },
    "difficulty": {
        "title": "Select difficulty:",
        "novice": "Novice (2 notes)",
        "apprentice": "Apprentice (3 notes)",
        "adept": "Adept (5 notes)",
        "master": "Master (7 notes)"
    },
    "options": {
        "title": "Game options:",
        "referenceNote": "Listen to reference note before each duel"
    },
    "buttons": {
        "startGame": "Start Adventure!",
        "nextBattle": "Next Duel",
        "restart": "Back to Start",
        "returnToMenu": "Return to Menu",
        "saveScore": "Save",
        "continue": "Continue",
        "returnToStart": "Return to Magic Academy",
        "enterHallOfFame": "Inscribe my Name in Legend"
    },
    "battle": {
        "prepare": "Prepare for the duel!",
        "enemyTurn": "{enemy} is casting a spell...",
        "playerTurn": "Your turn! Repeat the sequence",
        "referenceNote": "Listen to the reference note (C)...",
        "prepareForSpell": "Prepare for the enemy's spell...",
        "spellHit": "Your spell hits! -{damage} energy points",
        "spellFail": "You made a mistake! The spell damages you. -{damage} energy points",
        "victory": "Victory! The enemy has been defeated...",
        "defeat": "{enemy} was too powerful. Final score: {score}",
        "defeatNotHighScore": "Your magical energy of {score} points, while remarkable, is not yet enough to join the Hall of Fame legends. Keep practicing your musical spells and one day your name will resonate among the greatest!",
        "defeatHighScore": "Impressive! Despite the defeat, your mastery of musical magic with {score} points has earned you a place among legends. It's time to inscribe your name in the ancient scrolls of the Hall of Fame!",
        "finalVictory": "You have defeated all wizards! You are the new Master Archmage!"
    },
    "developer": {
        "enabled": "Developer mode enabled",
        "disabled": "Developer mode disabled"
    },
    "map": {
        "title": "Duel Map",
        "progress": "Your progress in the magical path:",
        "selectOpponent": "Select an opponent to start the duel",
        "nextDuel": "Next duel: {enemy} - Difficulty: {difficulty}",
        "allDefeated": "You have defeated all wizards! You are now a master.",
        "currentScore": "Current score: {score}",
        "level": "Level {number}"
    },
    "hallOfFame": {
        "title": "Wall of Sorcery",
        "newHighScore": "A New Magical Power!",
        "hallOfFameEntry": "Your mastery of musical magic deserves a place on the Wall of Sorcery",
        "scoreLabel": "Accumulated magical power:",
        "levelLabel": "Mastery level reached:",
        "enterName": "Inscribe your magical name:",
        "enterNameAlert": "You must inscribe your name for your legend to endure",
        "namePlaceholder": "Your magical name",
        "inscription": "Your feats shall be forever engraved on the ancient Wall of Sorcery.",
        "columns": {
            "position": "Rank",
            "wizard": "Sorcerer",
            "score": "Power",
            "level": "Mastery",
            "difficulty": "Discipline",
            "reference": "Guide"
        }
    },
    "screens": {
        "inscription": {
            "title": "The Wall of Sorcery",
            "subtitle": "Where Legends Endure",
            "instruction": "With your magic wand, inscribe your name on the ancient wall...",
            "confirm": "Engrave on the Wall",
            "cancel": "Decline the Honor"
        }
    },
    "enemies": {
        "melodic_apprentice": {
            "name": "Melodic Apprentice"
        },
        "octave_sorcerer": {
            "name": "Octave Sorcerer"
        },
        "harmonic_mage": {
            "name": "Harmonic Mage"
        },
        "symphonic_archmage": {
            "name": "Symphonic Archmage"
        }
    }
};