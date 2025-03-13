import { jest, describe, test, expect, beforeEach, beforeAll } from '@jest/globals';
import { UIManager } from '../ui.js';
import { i18n } from '../i18n.js';

describe('UIManager', () => {
    let uiManager;

    // Configuración global para todos los tests
    beforeAll(async () => {
        await i18n.init();
    });

    // Configuración para cada test individual
    beforeEach(async () => {
        jest.useFakeTimers();
        
        // Mock del DOM básico
        document.body.innerHTML = `
            <div class="language-selector">
                <button class="lang-btn" data-lang="es">🇪🇸</button>
                <button class="lang-btn" data-lang="en">🇬🇧</button>
            </div>
            <div id="start-screen" class="game-screen">
                <button id="start-game"></button>
            </div>
            <div id="map-screen" class="game-screen hidden">
                <div id="map-description"></div>
            </div>
            <div id="battle-screen" class="game-screen hidden">
                <div class="battle-area"></div>
            </div>
            <div id="result-screen" class="game-screen hidden">
                <h2 id="result-title"></h2>
                <p id="result-message"></p>
                <button id="next-battle"></button>
            </div>
            <div id="inscription-screen" class="game-screen hidden"></div>
            
            <div class="battle-info">
                <div class="player-stats">
                    <div id="player-health" class="health-fill"></div>
                    <span id="player-health-text">100</span>
                    <span id="player-max-health-text">100</span>
                </div>
                <div class="enemy-stats">
                    <div id="enemy-health" class="health-fill"></div>
                    <span id="enemy-health-text">100</span>
                    <span id="enemy-max-health-text">100</span>
                </div>
            </div>
            
            <div id="battle-message" data-i18n="battle.prepare"></div>
            <div id="enemy-name"></div>
            <div id="enemy-image"></div>
            
            <div id="spell-instruction"></div>
            <div id="spell-buttons">
                <button class="spell-btn" data-note="do">DO</button>
                <button class="spell-btn" data-note="re">RE</button>
            </div>

            <div class="progress-map">
                <div class="map-path"></div>
                <div id="enemies-map" class="enemies-container"></div>
            </div>

            <div id="scores-list"></div>

            <button id="next-battle"></button>
            <button id="restart-game"></button>
            <button id="return-to-menu"></button>
            <div class="difficulty-selector">
                <button class="difficulty-btn" data-difficulty="novice"></button>
            </div>
            <input type="checkbox" id="reference-note-toggle">
        `;

        // Inicializar UIManager
        uiManager = new UIManager();
        await uiManager.init();
    });

    // Limpiar después de cada test
    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
        jest.clearAllTimers();
        
        // Limpiar el timer del efecto mágico
        if (uiManager && uiManager.magicEffectTimer) {
            clearTimeout(uiManager.magicEffectTimer);
            uiManager.magicEffectTimer = null;
        }
        // Restaurar timers reales
        jest.useRealTimers();
    });

    // Función auxiliar para inicializar UI cuando sea necesario
    async function initUI() {
        await uiManager.init();
    }

    test('showScreen debería mostrar la pantalla correcta y ocultar las demás', async () => {
        await initUI();
        const startScreen = document.getElementById('start-screen');
        const mapScreen = document.getElementById('map-screen');
        
        uiManager.showScreen(mapScreen);
        
        expect(startScreen.classList.contains('hidden')).toBe(true);
        expect(mapScreen.classList.contains('hidden')).toBe(false);
    });

    test('updateHealthBars debería actualizar correctamente las barras de salud', async () => {
        await initUI();
        uiManager.updateHealthBars(50, 100, 75, 100);
        
        const playerHealthBar = document.getElementById('player-health');
        const enemyHealthBar = document.getElementById('enemy-health');
        const playerHealthText = document.getElementById('player-health-text');
        const enemyHealthText = document.getElementById('enemy-health-text');
        
        expect(playerHealthBar.style.width).toBe('50%');
        expect(enemyHealthBar.style.width).toBe('75%');
        expect(playerHealthText.textContent).toBe('50');
        expect(enemyHealthText.textContent).toBe('75');
        
        // Verificar color basado en el porcentaje de salud
        expect(playerHealthBar.style.backgroundColor).toBe('rgb(255, 152, 0)'); // naranja para 50%
        expect(enemyHealthBar.style.backgroundColor).toBe('rgb(76, 175, 80)'); // verde para > 60%
    });

    test('toggleSpellButtons debería mostrar/ocultar los botones correctamente', async () => {
        await initUI();
        const availableNotes = ['do'];
        uiManager.toggleSpellButtons(true, availableNotes);
        
        const doButton = document.querySelector('[data-note="do"]');
        const reButton = document.querySelector('[data-note="re"]');
        const spellInstruction = document.getElementById('spell-instruction');
        const spellButtons = document.getElementById('spell-buttons');
        
        expect(spellInstruction.classList.contains('hidden')).toBe(false);
        expect(spellButtons.classList.contains('hidden')).toBe(false);
        expect(doButton.classList.contains('visible')).toBe(true);
        expect(reButton.classList.contains('visible')).toBe(false);
        
        uiManager.toggleSpellButtons(false);
        expect(spellButtons.classList.contains('hidden')).toBe(true);
    });

    test('setBattleMessage debería actualizar el mensaje con las traducciones correctas', async () => {
        await initUI();
        const messageKey = 'battle.enemyTurn';
        const replacements = {
            enemy: 'Melodic Apprentice',
            enemyId: 'melodic_apprentice'
        };
        
        uiManager.setBattleMessage(messageKey, replacements);
        
        const messageElement = document.getElementById('battle-message');
        expect(messageElement.dataset.i18n).toBe(messageKey);
        expect(messageElement.dataset.enemyId).toBe(replacements.enemyId);
    });

    test('showMagicEffect debería crear y eliminar el efecto visual', async () => {
        await initUI();
        jest.useFakeTimers();
        
        uiManager.showMagicEffect('player-cast');
        
        const effect = document.querySelector('.magic-effect');
        expect(effect).toBeDefined();
        expect(effect.classList.contains('player-cast')).toBe(true);
        
        jest.advanceTimersByTime(2000);
        expect(document.querySelector('.magic-effect')).toBeNull();
        
        jest.useRealTimers();
    });

    test('setEnemyInfo debería actualizar la información del enemigo', async () => {
        await initUI();
        const enemyId = 'melodic_apprentice';
        const enemyEmoji = '🧙‍♂️';
        
        uiManager.setEnemyInfo(enemyId, enemyEmoji);
        
        const enemyName = document.getElementById('enemy-name');
        const enemyImage = document.getElementById('enemy-image');
        
        expect(enemyName.dataset.i18n).toBe(`enemies.${enemyId}.name`);
        expect(enemyImage.textContent).toBe(enemyEmoji);
    });

    test('setupSpellButtonListeners debería manejar clicks y toques correctamente', async () => {
        await initUI();
        const mockCallback = jest.fn();
        uiManager.setupSpellButtonListeners(mockCallback);
        
        const button = document.querySelector('.spell-btn');
        button.classList.add('visible');
        
        // Simular click
        button.click();
        expect(mockCallback).toHaveBeenCalledWith('do', button);
        
        // Simular touchstart
        const touchEvent = new Event('touchstart');
        touchEvent.preventDefault = jest.fn();
        button.dispatchEvent(touchEvent);
        
        expect(touchEvent.preventDefault).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledWith('do', button);
    });

    test('updateLanguageButtons debería resaltar el idioma activo', async () => {
        await initUI();
        await i18n.init();
        i18n.setLanguage('es');
        
        uiManager.updateLanguageButtons();
        
        const esButton = document.querySelector('[data-lang="es"]');
        const enButton = document.querySelector('[data-lang="en"]');
        
        expect(esButton.classList.contains('active')).toBe(true);
        expect(enButton.classList.contains('active')).toBe(false);
    });

    test('initializeProgressMap debería crear los marcadores de enemigos correctamente', async () => {
        await initUI();
        const mockEnemies = [
            { id: 'melodic_apprentice', emoji: '🧙‍♂️', difficulty: 1 },
            { id: 'octave_sorcerer', emoji: '🧙‍♀️', difficulty: 2 }
        ];
        const currentLevel = 0;
        const defeatedEnemies = [];
        const mockOnEnemySelect = jest.fn();
        const currentScore = 100;

        uiManager.initializeProgressMap(mockEnemies, currentLevel, defeatedEnemies, mockOnEnemySelect, currentScore);

        const enemiesMap = document.getElementById('enemies-map');
        const markers = enemiesMap.querySelectorAll('.enemy-marker');
        
        expect(markers.length).toBe(2);
        
        // Verificar primer enemigo
        const firstMarker = markers[0];
        expect(firstMarker.querySelector('.enemy-icon').textContent).toBe('🧙‍♂️');
        expect(firstMarker.classList.contains('current')).toBe(true);
        
        // Verificar puntuación actual
        const scoreDisplay = document.querySelector('.current-score span');
        expect(scoreDisplay.dataset.score).toBe('100');
    });

    test('updateMapDescription debería mostrar el mensaje correcto según el estado', async () => {
        await initUI();
        const mockEnemies = [
            { id: 'melodic_apprentice', difficulty: 1 },
            { id: 'octave_sorcerer', difficulty: 2 }
        ];

        // Caso: Siguiente duelo
        uiManager.updateMapDescription(mockEnemies, 0);
        const mapDescription = document.getElementById('map-description');
        expect(mapDescription.dataset.i18n).toBe('map.nextDuel');
        expect(mapDescription.dataset.enemyId).toBe('melodic_apprentice');
        expect(mapDescription.dataset.difficulty).toBe('★');

        // Caso: Todos derrotados
        uiManager.updateMapDescription(mockEnemies, 2);
        expect(mapDescription.dataset.i18n).toBe('map.allDefeated');
    });

    test('setResultScreen debería configurar correctamente la pantalla de resultado', async () => {
        await initUI();
        const titleKey = 'battle.victory';
        const messageKey = 'battle.spellHit';
        const showNextBattleBtn = true;
        const replacements = {
            enemy: 'Melodic Apprentice',
            enemyId: 'melodic_apprentice',
            damage: 20
        };

        uiManager.setResultScreen(titleKey, messageKey, showNextBattleBtn, replacements);

        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');
        const nextBattleBtn = document.getElementById('next-battle');

        expect(resultTitle.dataset.i18n).toBe(titleKey);
        expect(resultMessage.dataset.i18n).toBe(messageKey);
        expect(resultMessage.dataset.enemyId).toBe(replacements.enemyId);
        expect(nextBattleBtn.classList.contains('hidden')).toBe(false);
    });

    test('setupMainButtonListeners debería configurar los event listeners correctamente', async () => {
        await initUI();
        const handlers = {
            onStartGame: jest.fn(),
            onNextBattle: jest.fn(),
            onRestartGame: jest.fn(),
            onReturnToMenu: jest.fn(),
            onDifficultyChange: jest.fn(),
            onReferenceNoteToggle: jest.fn()
        };

        // Re-inicializar el DOM con todos los elementos necesarios
        document.body.innerHTML = `
            <button id="start-game"></button>
            <button id="next-battle"></button>
            <button id="restart-game"></button>
            <button id="return-to-menu"></button>
            <div class="difficulty-selector">
                <button class="difficulty-btn" data-difficulty="novice"></button>
            </div>
            <input type="checkbox" id="reference-note-toggle">
        `;

        // Re-inicializar UIManager después de modificar el DOM
        uiManager = new UIManager();
        uiManager.init();
        uiManager.setupMainButtonListeners(handlers);

        // Simular clicks en los botones principales
        document.getElementById('start-game').click();
        expect(handlers.onStartGame).toHaveBeenCalled();

        document.getElementById('next-battle').click();
        expect(handlers.onNextBattle).toHaveBeenCalled();

        document.getElementById('restart-game').click();
        expect(handlers.onRestartGame).toHaveBeenCalled();

        document.getElementById('return-to-menu').click();
        expect(handlers.onReturnToMenu).toHaveBeenCalled();

        // Simular cambio de dificultad
        const difficultyBtn = document.querySelector('.difficulty-btn');
        difficultyBtn.click();
        expect(handlers.onDifficultyChange).toHaveBeenCalledWith('novice');
        expect(difficultyBtn.classList.contains('active')).toBe(true);

        // Simular cambio en la nota de referencia
        const referenceToggle = document.getElementById('reference-note-toggle');
        referenceToggle.checked = true;
        referenceToggle.dispatchEvent(new Event('change'));
        expect(handlers.onReferenceNoteToggle).toHaveBeenCalledWith(true);
    });

    test('toggleSpellButtons debería ignorar botones sin data-note', async () => {
        await initUI();
        // Añadir un botón sin data-note
        const invalidButton = document.createElement('button');
        invalidButton.className = 'spell-btn';
        document.getElementById('spell-buttons').appendChild(invalidButton);

        const availableNotes = ['do'];
        uiManager.toggleSpellButtons(true, availableNotes);
        
        expect(invalidButton.classList.contains('visible')).toBe(false);
    });

    test('setBattleMessage debería preservar el botón de continuar', async () => {
        await initUI();
        const battleMessage = document.getElementById('battle-message');
        
        // Crear estructura con botón de continuar
        const container = document.createElement('div');
        container.className = 'battle-message-content';
        container.textContent = 'Initial message';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'continue-button-container';
        const continueBtn = document.createElement('button');
        continueBtn.className = 'continue-btn';
        continueBtn.dataset.i18n = 'buttons.continue';
        buttonContainer.appendChild(continueBtn);
        
        battleMessage.appendChild(container);
        battleMessage.appendChild(buttonContainer);
        
        // Actualizar mensaje de derrota
        uiManager.setBattleMessage('battle.defeat', {
            enemy: 'Test Enemy',
            enemyId: 'test_enemy',
            score: '100'
        });
        
        // Verificar que la estructura se mantuvo
        expect(battleMessage.querySelector('.battle-message-content')).toBeTruthy();
        expect(battleMessage.querySelector('.continue-button-container')).toBeTruthy();
        expect(battleMessage.querySelector('.continue-btn')).toBeTruthy();
    });

    test('initializeProgressMap debería manejar correctamente enemigos bloqueados', async () => {
        await initUI();
        const mockEnemies = [
            { id: 'enemy1', emoji: '🧙‍♂️', difficulty: 1 },
            { id: 'enemy2', emoji: '🧙‍♀️', difficulty: 2 },
            { id: 'enemy3', emoji: '🧙', difficulty: 3 }
        ];
        const currentLevel = 1;
        const defeatedEnemies = [0];
        const mockOnEnemySelect = jest.fn();
        
        uiManager.initializeProgressMap(mockEnemies, currentLevel, defeatedEnemies, mockOnEnemySelect);
        
        const markers = document.querySelectorAll('.enemy-marker');
        
        // Verificar primer enemigo (derrotado)
        expect(markers[0].classList.contains('defeated')).toBe(true);
        
        // Verificar enemigo actual
        expect(markers[1].classList.contains('current')).toBe(true);
        expect(markers[1].style.cursor).toBe('pointer');
        
        // Verificar enemigo bloqueado
        expect(markers[2].classList.contains('locked')).toBe(true);
        expect(markers[2].style.cursor).not.toBe('pointer');
        
        // Intentar seleccionar enemigo bloqueado
        markers[2].click();
        expect(mockOnEnemySelect).not.toHaveBeenCalled();
    });

    test('translateInterface debería manejar placeholders y botones de continuar', async () => {
        await initUI();
        
        // Añadir elementos con placeholder
        const input = document.createElement('input');
        input.setAttribute('data-i18n-placeholder', 'hallOfFame.namePlaceholder');
        document.body.appendChild(input);
        
        // Añadir botón de continuar
        const continueBtn = document.createElement('button');
        continueBtn.className = 'continue-btn';
        continueBtn.dataset.i18n = 'buttons.continue';
        document.body.appendChild(continueBtn);
        
        // Forzar traducción
        uiManager.translateInterface();
        
        // Verificar placeholder traducido
        expect(input.placeholder).toBe(i18n.t('hallOfFame.namePlaceholder'));
        
        // Verificar botón traducido
        expect(continueBtn.textContent).toBe(i18n.t('buttons.continue'));
    });

    test('setBattleMessage debería manejar múltiples parámetros', async () => {
        await initUI();
        const messageKey = 'battle.spellHit';
        const replacements = {
            damage: 20,
            enemy: 'Test Enemy',
            enemyId: 'test_enemy',
            score: 100
        };
        
        uiManager.setBattleMessage(messageKey, replacements);
        
        const battleMessage = document.getElementById('battle-message');
        Object.entries(replacements).forEach(([key, value]) => {
            if (key !== 'enemyId') { // enemyId es especial, se usa para traducción
                expect(battleMessage.dataset[key]).toBe(value.toString());
            }
        });
    });

    test('touchend en spell buttons debería prevenir comportamiento por defecto', async () => {
        await initUI();
        const mockCallback = jest.fn();
        uiManager.setupSpellButtonListeners(mockCallback);
        
        const button = document.querySelector('.spell-btn');
        button.classList.add('visible');
        
        // Simular touchend
        const touchEndEvent = new Event('touchend');
        touchEndEvent.preventDefault = jest.fn();
        button.dispatchEvent(touchEndEvent);
        
        expect(touchEndEvent.preventDefault).toHaveBeenCalled();
    });

    test('showScreen debería traducir placeholders en la pantalla de inscripción', async () => {
        await initUI();
        
        // Añadir un input con placeholder en la pantalla de inscripción
        const inscriptionScreen = document.getElementById('inscription-screen');
        const input = document.createElement('input');
        input.setAttribute('data-i18n-placeholder', 'hallOfFame.namePlaceholder');
        inscriptionScreen.appendChild(input);
        
        uiManager.showScreen(inscriptionScreen);
        
        expect(input.placeholder).toBe(i18n.t('hallOfFame.namePlaceholder'));
    });

    test('translateInterface debería manejar casos especiales de traducciones', async () => {
        await initUI();
        
        // Crear elemento con valores dinámicos
        const element = document.createElement('div');
        element.dataset.i18n = 'battle.spellHit';
        element.dataset.score = '1000';
        element.dataset.enemy = 'Test Enemy';
        element.dataset.damage = '50';
        element.dataset.level = '3';
        element.dataset.difficulty = 'master';
        element.dataset.number = '5';
        document.body.appendChild(element);
        
        uiManager.translateInterface();
        
        expect(element.textContent).toBeTruthy();
    });

    test('languageChanged event debería actualizar la interfaz', async () => {
        await initUI();
        
        // Añadir elementos traducibles
        const element = document.createElement('div');
        element.dataset.i18n = 'test.key';
        document.body.appendChild(element);
        
        // Simular cambio de idioma
        const event = new Event('languageChanged');
        window.dispatchEvent(event);
        
        // Verificar que el selector de idioma se actualizó
        const langButtons = document.querySelectorAll('.lang-btn');
        expect(langButtons[0].classList.contains('active') || 
               langButtons[1].classList.contains('active')).toBe(true);
    });

    test('setBattleMessage debería manejar mensaje con enemigo en mapa', async () => {
        await initUI();
        const messageKey = 'map.nextDuel';
        const replacements = {
            enemyId: 'test_enemy',
            enemy: 'Test Enemy'
        };
        
        uiManager.setBattleMessage(messageKey, replacements);
        
        const battleMessage = document.getElementById('battle-message');
        expect(battleMessage.dataset.enemyId).toBe('test_enemy');
    });
    
    // NUEVAS PRUEBAS PARA MEJORAR LA COBERTURA DE RAMAS
    
    // Prueba 1: updateLanguageButtons cuando languageSelector no existe
    test('updateLanguageButtons debería manejar el caso donde languageSelector no existe', async () => {
        await initUI();
        
        // Eliminar el selector de idioma
        const langSelector = document.querySelector('.language-selector');
        langSelector.remove();
        
        // Verificar que no lanza error cuando se llama sin languageSelector
        expect(() => {
            uiManager.updateLanguageButtons();
        }).not.toThrow();
    });
    
    // Prueba 2: showScreen para la pantalla de batalla y no batalla (líneas 452-453)
    test('showScreen debería manejar diferentemente la pantalla de batalla', async () => {
        await initUI();
        
        // Configurar un mensaje de batalla
        const battleMessage = document.getElementById('battle-message');
        battleMessage.textContent = 'Mensaje personalizado que debería persistir';
        
        // Mostrar pantalla de batalla (no debe limpiar el mensaje)
        const battleScreen = document.getElementById('battle-screen');
        uiManager.showScreen(battleScreen);
        
        // El mensaje debe persistir porque estamos mostrando la pantalla de batalla
        expect(battleMessage.textContent).toBe('Mensaje personalizado que debería persistir');
        
        // Ahora mostrar otra pantalla (debe limpiar el mensaje)
        const mapScreen = document.getElementById('map-screen');
        uiManager.showScreen(mapScreen);
        
        // Verificar que el mensaje fue restaurado al predeterminado
        expect(battleMessage.textContent).not.toBe('Mensaje personalizado que debería persistir');
    });
    
    // Prueba 3: updateHealthBars para diferentes rangos de salud (líneas 469-470)
    test('updateHealthBars debería aplicar colores correctos para diferentes porcentajes de salud', async () => {
        await initUI();
        
        // Caso 1: Salud baja (< 30%) - Rojo
        uiManager.updateHealthBars(25, 100, 25, 100);
        
        let playerHealthBar = document.getElementById('player-health');
        let enemyHealthBar = document.getElementById('enemy-health');
        
        expect(playerHealthBar.style.backgroundColor).toBe('rgb(244, 67, 54)'); // Rojo
        expect(enemyHealthBar.style.backgroundColor).toBe('rgb(244, 67, 54)'); // Rojo
        
        // Caso 2: Salud media (30-60%) - Naranja
        uiManager.updateHealthBars(50, 100, 45, 100);
        
        playerHealthBar = document.getElementById('player-health');
        enemyHealthBar = document.getElementById('enemy-health');
        
        expect(playerHealthBar.style.backgroundColor).toBe('rgb(255, 152, 0)'); // Naranja
        expect(enemyHealthBar.style.backgroundColor).toBe('rgb(255, 152, 0)'); // Naranja
        
        // Caso 3: Salud alta (> 60%) - Verde
        uiManager.updateHealthBars(80, 100, 70, 100);
        
        playerHealthBar = document.getElementById('player-health');
        enemyHealthBar = document.getElementById('enemy-health');
        
        expect(playerHealthBar.style.backgroundColor).toBe('rgb(76, 175, 80)'); // Verde
        expect(enemyHealthBar.style.backgroundColor).toBe('rgb(76, 175, 80)'); // Verde
    });

    // Prueba para updateHealthBars con diferentes rangos de salud y manejo de múltiples colores
    test('updateHealthBars maneja correctamente múltiples cambios de color', async () => {
        await initUI();
        
        // Caso 1: Ambos con salud alta
        uiManager.updateHealthBars(90, 100, 85, 100);
        expect(document.getElementById('player-health').style.backgroundColor).toBe('rgb(76, 175, 80)'); // Verde
        expect(document.getElementById('enemy-health').style.backgroundColor).toBe('rgb(76, 175, 80)'); // Verde
        
        // Caso 2: Jugador salud baja, enemigo salud media
        uiManager.updateHealthBars(25, 100, 45, 100);
        expect(document.getElementById('player-health').style.backgroundColor).toBe('rgb(244, 67, 54)'); // Rojo
        expect(document.getElementById('enemy-health').style.backgroundColor).toBe('rgb(255, 152, 0)'); // Naranja
        
        // Caso 3: Jugador salud media, enemigo salud baja
        uiManager.updateHealthBars(55, 100, 15, 100);
        expect(document.getElementById('player-health').style.backgroundColor).toBe('rgb(255, 152, 0)'); // Naranja
        expect(document.getElementById('enemy-health').style.backgroundColor).toBe('rgb(244, 67, 54)'); // Rojo
    });

    // Prueba para setBattleMessage con estructura compleja y botón de continuar
    test('setBattleMessage maneja correctamente mensajes con estructura compleja', async () => {
        await initUI();
        
        // Preparar mensaje con botón de continuar
        const battleMessage = document.getElementById('battle-message');
        const container = document.createElement('div');
        container.className = 'battle-message-content';
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'continue-btn';
        continueBtn.dataset.i18n = 'buttons.continue';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'continue-button-container';
        buttonContainer.appendChild(continueBtn);
        
        battleMessage.appendChild(container);
        battleMessage.appendChild(buttonContainer);
        
        // Caso 1: Mensaje de derrota con botón de continuar
        uiManager.setBattleMessage('battle.defeat', {
            enemy: 'Test Enemy',
            enemyId: 'test_enemy',
            score: '1000',
            damage: '50'
        });
        
        expect(battleMessage.querySelector('.continue-btn')).toBeTruthy();
        expect(battleMessage.querySelector('.battle-message-content')).toBeTruthy();
        expect(battleMessage.dataset.score).toBe('1000');
        expect(battleMessage.dataset.damage).toBe('50');
        
        // Caso 2: Mensaje normal (debería eliminar la estructura anterior)
        uiManager.setBattleMessage('battle.prepare');
        
        expect(battleMessage.querySelector('.continue-btn')).toBeNull();
        expect(battleMessage.querySelector('.battle-message-content')).toBeNull();
    });

    // Prueba para translateInterface con múltiples tipos de elementos y traducciones
    test('translateInterface maneja correctamente diferentes tipos de elementos', async () => {
        await initUI();
        
        // Preparar elementos con diferentes tipos de traducciones
        const elements = [
            { type: 'div', attrs: { 'data-i18n': 'battle.spellHit', 'data-score': '1000', 'data-damage': '50' }},
            { type: 'input', attrs: { 'data-i18n-placeholder': 'hallOfFame.namePlaceholder' }},
            { type: 'div', attrs: { 'data-i18n': 'battle.enemyTurn', 'data-enemy-id': 'test_enemy' }},
            { type: 'button', attrs: { class: 'continue-btn', 'data-i18n': 'buttons.continue' }}
        ];
        
        // Crear y añadir elementos al DOM
        elements.forEach(el => {
            const element = document.createElement(el.type);
            Object.entries(el.attrs).forEach(([key, value]) => {
                if (key === 'class') {
                    element.className = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            document.body.appendChild(element);
        });
        
        // Traducir interfaz
        uiManager.translateInterface();
        
        // Verificar que cada tipo de elemento se tradujo correctamente
        const placeholder = document.querySelector('[data-i18n-placeholder]');
        expect(placeholder.placeholder).toBe(i18n.t('hallOfFame.namePlaceholder'));
        
        const battleMessage = document.querySelector('[data-i18n="battle.spellHit"]');
        expect(battleMessage.textContent).toBeTruthy();
        
        const enemyMessage = document.querySelector('[data-i18n="battle.enemyTurn"]');
        expect(enemyMessage.textContent).toBeTruthy();
        
        const continueBtn = document.querySelector('.continue-btn');
        expect(continueBtn.textContent).toBe(i18n.t('buttons.continue'));
    });

    describe('Cobertura de Barras de Salud', () => {
        beforeEach(async () => {
            // Configurar el DOM antes de cada test
            document.body.innerHTML = `
                <div id="player-health" class="health-fill" style="width: 100%;"></div>
                <div id="enemy-health" class="health-fill" style="width: 100%;"></div>
                <span id="player-health-text">100</span>
                <span id="enemy-health-text">100</span>
                <span id="player-max-health-text">100</span>
                <span id="enemy-max-health-text">100</span>
            `;
            
            // Inicializar UI
            uiManager = new UIManager();
            await uiManager.init();
        });

        test('updateHealthBars debería aplicar colores correctamente según el porcentaje', () => {
            const playerHealth = document.getElementById('player-health');
            const enemyHealth = document.getElementById('enemy-health');
            
            // Configurar muy poca salud (< 30%)
            uiManager.updateHealthBars(25, 100, 100, 100);
            expect(playerHealth.style.backgroundColor).toBe('rgb(244, 67, 54)');
            expect(playerHealth.style.width).toBe('25%');
            
            // Configurar salud media (30-60%)
            uiManager.updateHealthBars(45, 100, 100, 100);
            expect(playerHealth.style.backgroundColor).toBe('rgb(255, 152, 0)');
            expect(playerHealth.style.width).toBe('45%');
            
            // Configurar salud alta (>60%)
            uiManager.updateHealthBars(80, 100, 100, 100);
            expect(playerHealth.style.backgroundColor).toBe('rgb(76, 175, 80)');
            expect(playerHealth.style.width).toBe('80%');
        });
    });

    describe('Gestión de Interfaz', () => {
        beforeEach(async () => {
            // Configurar el DOM antes de cada test
            document.body.innerHTML = `
                <div id="battle-message" data-i18n="battle.prepare"></div>
                <div id="spell-buttons">
                    <button class="spell-btn" data-note="do"></button>
                    <button class="spell-btn" data-note="re"></button>
                </div>
                <div id="spell-instruction"></div>
            `;
            
            // Inicializar UI
            uiManager = new UIManager();
            await uiManager.init();
        });

        test('setBattleMessage debería manejar mensajes con y sin parámetros', () => {
            const battleMessage = document.getElementById('battle-message');
            
            // Mensaje sin parámetros
            uiManager.setBattleMessage('battle.start');
            expect(battleMessage.dataset.i18n).toBe('battle.start');
            
            // Mensaje con parámetros
            uiManager.setBattleMessage('battle.enemyTurn', { enemy: 'Boss', damage: 50 });
            expect(battleMessage.dataset.i18n).toBe('battle.enemyTurn');
            expect(battleMessage.dataset.enemy).toBe('Boss');
            expect(battleMessage.dataset.damage).toBe('50');
        });

        test('toggleSpellButtons debería manejar elementos no encontrados', () => {
            const buttons = document.querySelectorAll('.spell-btn');
            
            // Activar solo el botón 'do'
            uiManager.toggleSpellButtons(true, ['do']);
            
            // Verificar que el primer botón está habilitado y visible
            expect(buttons[0].disabled).toBe(false); // do - habilitado
            expect(buttons[0].classList.contains('visible')).toBe(true);
            
            // Verificar que el segundo botón no está visible
            expect(buttons[1].classList.contains('visible')).toBe(false);
            // No verificamos disabled ya que el comportamiento actual solo se basa en la clase visible
        });
    });

    test('initializeProgressMap debería manejar el caso sin enemigos', async () => {
        await initUI();
        uiManager.initializeProgressMap([], 0, [], () => {});
        
        const enemiesMap = document.getElementById('enemies-map');
        expect(enemiesMap.children.length).toBe(0);
    });

    test('toggleSpellButtons debería manejar correctamente el caso sin availableNotes', async () => {
        await initUI();
        uiManager.toggleSpellButtons(true);
        
        const buttons = document.querySelectorAll('.spell-btn');
        buttons.forEach(button => {
            expect(button.classList.contains('visible')).toBe(false);
        });
    });

    test('showScreen debería limpiar mensajes al cambiar entre pantallas', async () => {
        await initUI();
        
        const battleScreen = document.getElementById('battle-screen');
        const mapScreen = document.getElementById('map-screen');
        const battleMessage = document.getElementById('battle-message');
        
        // Establecer un mensaje personalizado
        battleMessage.textContent = 'Test message';
        
        // Cambiar a pantalla de batalla (no debe limpiar)
        uiManager.showScreen(battleScreen);
        expect(battleMessage.textContent).toBe('Test message');
        
        // Cambiar a otra pantalla (debe limpiar)
        uiManager.showScreen(mapScreen);
        expect(battleMessage.textContent).not.toBe('Test message');
    });

    // ...resto del código sin cambios...
});