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
 * config.js - Configuration constants for Musical Spells
 */

// Versión del juego - Modificar esta constante para actualizar la versión en toda la aplicación
export const GAME_VERSION = '0.6.0-beta';

// Configuración del modo desarrollador
export const DEVELOPER_MODE = {
    enabled: false,  // Cambiar a true para permitir activar el modo desarrollador
    toggleKey: 'F2', // Tecla para activar/desactivar el modo desarrollador durante el juego
    autoCompleteKey: 'x'  // Tecla para completar hechizos automáticamente
};

// Aquí se pueden añadir más configuraciones globales del juego en el futuro