import { jest } from '@jest/globals';

// Mock window object with all required properties
global.window = {
    dispatchEvent: jest.fn(),
    AudioContext: jest.fn(),
    navigator: {
        language: 'en-US'
    },
    getComputedStyle: jest.fn(() => ({
        getPropertyValue: jest.fn()
    }))
};

// Mock document object
global.document = {
    ...document,
    documentElement: {
        lang: 'en'
    },
    createElement: jest.fn((tag) => ({
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn()
        },
        addEventListener: jest.fn(),
        appendChild: jest.fn(),
        getAttribute: jest.fn(),
        setAttribute: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(),
        dataset: {},
        style: {},
        tagName: tag.toUpperCase()
    })),
    createTextNode: jest.fn()
};

// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
};

// Mock navigator
global.navigator = {
    language: 'en-US'
};

// Clean up
beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
});