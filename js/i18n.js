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
 * i18n.js - Internationalization system for Musical Spells
 */

import { TRANSLATIONS } from './translations/index.js';

class I18nManager {
    constructor() {
        this.currentLanguage = 'es';
        this.translations = TRANSLATIONS;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        // Use browser language if available
        const browserLang = navigator.language.split('-')[0];
        if (this.translations[browserLang]) {
            this.currentLanguage = browserLang;
        }

        this.initialized = true;
        // Dispatch language changed event
        this.dispatchLanguageChanged();
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            document.documentElement.lang = lang;
            this.dispatchLanguageChanged();
        }
    }

    t(key, replacements = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        // Replace placeholders
        return value.replace(/\{(\w+)\}/g, (match, key) => 
            replacements[key] !== undefined ? replacements[key] : match
        );
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    dispatchLanguageChanged() {
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }
}

// Export a single instance
export const i18n = new I18nManager();