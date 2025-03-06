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
 * enemies.js - Enemy configuration for Musical Spells
 */

import { i18n } from './i18n.js';

// Export enemy configuration
const ENEMY_DATA = [
    { id: 'melodic_apprentice', health: 100, difficulty: 1, emoji: "🧙‍♀️" },
    { id: 'octave_sorcerer', health: 120, difficulty: 2, emoji: "🧙‍♂️" },
    { id: 'harmonic_mage', health: 150, difficulty: 3, emoji: "🧝‍♀️" },
    { id: 'symphonic_archmage', health: 200, difficulty: 4, emoji: "🧙‍♂️" }
];

// Add dynamic getter for translated name
export const ENEMIES = ENEMY_DATA.map(enemy => ({
    ...enemy,
    get name() {
        return i18n.t(`enemies.${enemy.id}.name`);
    }
}));