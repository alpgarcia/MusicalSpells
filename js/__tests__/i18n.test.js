import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { i18n } from '../i18n.js';

describe('I18nManager', () => {
    beforeEach(() => {
        // Reset language to default
        i18n.setLanguage('en');
    });

    test('debería cargar las traducciones correctamente', async () => {
        await i18n.init();
        expect(i18n.translations).toBeDefined();
        expect(i18n.translations.en).toBeDefined();
        expect(i18n.translations.es).toBeDefined();
    });

    test('debería cambiar el idioma correctamente', () => {
        i18n.setLanguage('es');
        expect(i18n.getCurrentLanguage()).toBe('es');
        
        i18n.setLanguage('en');
        expect(i18n.getCurrentLanguage()).toBe('en');
    });

    test('debería traducir correctamente las claves simples', () => {
        expect(i18n.t('game.title')).toBe('Musical Spells');
    });

    test('debería manejar correctamente los placeholders', () => {
        const enemyName = 'Melodic Apprentice';
        const damage = 10;
        
        const message = i18n.t('battle.spellHit', { damage });
        expect(message).toContain(damage.toString());
        
        const enemyMessage = i18n.t('battle.enemyTurn', { enemy: enemyName });
        expect(enemyMessage).toContain(enemyName);
    });

    test('debería devolver la clave si no existe la traducción', () => {
        const nonExistentKey = 'nonexistent.key';
        expect(i18n.t(nonExistentKey)).toBe(nonExistentKey);
    });

    test('debería emitir el evento languageChanged al cambiar el idioma', () => {
        const mockDispatchEvent = jest.spyOn(window, 'dispatchEvent');
        i18n.setLanguage('es');
        
        expect(mockDispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'languageChanged',
                detail: { language: 'es' }
            })
        );
    });
});