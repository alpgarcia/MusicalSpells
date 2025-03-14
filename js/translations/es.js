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
 * es.js - Spanish translations for Musical Spells
 */

export const spanishTranslations = {
    "game": {
        "title": "Musical Spells",
        "subtitle": "El Duelo de Magos Musicales",
        "description": "Eres un aprendiz de mago que debe enfrentarse a otros hechiceros en duelos musicales.",
        "instructions": "Escucha y repite las secuencias musicales para derrotar a tus oponentes.",
        "playerTitle": "Aprendiz"
    },
    "difficulty": {
        "title": "Selecciona la dificultad:",
        "novice": "Novato (2 notas)",
        "apprentice": "Aprendiz (3 notas)",
        "adept": "Adepto (5 notas)",
        "master": "Maestro (7 notas)"
    },
    "options": {
        "title": "Opciones de juego:",
        "referenceNote": "Escuchar nota de referencia antes de cada duelo"
    },
    "buttons": {
        "startGame": "¡Comenzar Aventura!",
        "nextBattle": "Siguiente Duelo",
        "restart": "Volver al Inicio",
        "returnToMenu": "Volver al Menú",
        "saveScore": "Guardar",
        "continue": "Continuar",
        "returnToStart": "Volver a la Academia de Magia",
        "enterHallOfFame": "Inscribir mi Nombre en la Leyenda"
    },
    "battle": {
        "prepare": "¡Prepárate para el duelo!",
        "enemyTurn": "{enemy} está lanzando un hechizo...",
        "playerTurn": "¡Tu turno! Repite la secuencia",
        "referenceNote": "Escucha la nota de referencia (DO)...",
        "prepareForSpell": "Prepárate para el hechizo del enemigo...",
        "spellHit": "¡Tu hechizo golpea! -{damage} puntos de energía",
        "spellFail": "¡Te equivocaste! El hechizo te daña. -{damage} puntos de energía",
        "victory": "¡Victoria! El enemigo ha sido derrotado...",
        "defeat": "{enemy} ha sido demasiado poderoso. Puntuación final: {score}",
        "defeatNotHighScore": "Tu energía mágica de {score} puntos, aunque notable, aún no es suficiente para entrar en las leyendas del Salón de la Fama. ¡Sigue practicando tus hechizos musicales y algún día tu nombre resonará entre los más grandes!",
        "defeatHighScore": "¡Impresionante! A pesar de la derrota, tu dominio de la magia musical con {score} puntos te ha ganado un lugar entre las leyendas. ¡Es hora de inscribir tu nombre en los antiguos pergaminos del Salón de la Fama!",
        "finalVictory": "¡Has derrotado a todos los magos! ¡Eres el nuevo Archimago Maestro!"
    },
    "developer": {
        "enabled": "Modo desarrollador activado",
        "disabled": "Modo desarrollador desactivado"
    },
    "map": {
        "title": "Mapa de Duelos",
        "progress": "Tu progreso en el camino mágico:",
        "selectOpponent": "Selecciona un oponente para comenzar el duelo",
        "nextDuel": "Próximo duelo: {enemy} - Dificultad: {difficulty}",
        "allDefeated": "¡Has derrotado a todos los magos! Ya eres un maestro.",
        "currentScore": "Puntuación actual: {score}",
        "level": "Nivel {number}"
    },
    "hallOfFame": {
        "title": "Muro de la Hechicería",
        "newHighScore": "¡Un Nuevo Poder Mágico!",
        "hallOfFameEntry": "Tu dominio de la magia musical merece un lugar en el Muro de la Hechicería",
        "scoreLabel": "Poder mágico acumulado:",
        "levelLabel": "Nivel de maestría alcanzado:",
        "enterName": "Inscribe tu nombre mágico:",
        "enterNameAlert": "Debes inscribir tu nombre para que tu leyenda perdure",
        "namePlaceholder": "Tu nombre mágico",
        "inscription": "Tus hazañas quedarán grabadas para siempre en el antiguo Muro de la Hechicería.",
        "columns": {
            "position": "Rango",
            "wizard": "Hechicero",
            "score": "Poder",
            "level": "Maestría",
            "difficulty": "Disciplina",
            "reference": "Guía"
        }
    },
    "screens": {
        "inscription": {
            "title": "El Muro de la Hechicería",
            "subtitle": "Donde las Leyendas Perduran",
            "instruction": "Con tu varita mágica, inscribe tu nombre en el antiguo muro...",
            "confirm": "Grabar en el Muro",
            "cancel": "Declinar el Honor"
        }
    },
    "enemies": {
        "melodic_apprentice": {
            "name": "Aprendiz Melodioso"
        },
        "octave_sorcerer": {
            "name": "Hechicero de las Octavas"
        },
        "harmonic_mage": {
            "name": "Maga Armónica"
        },
        "symphonic_archmage": {
            "name": "Archimago Sinfónico"
        }
    }
};