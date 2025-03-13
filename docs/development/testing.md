# Testing Guide for Musical Spells

## Overview
Musical Spells uses Jest for unit testing with experimental ES modules support, providing complete test coverage for all major components. The testing environment is configured to handle:
- DOM manipulation via jsdom
- Web Audio API mocking
- Local Storage simulation
- CSS Modules
- ES6 Modules support via Node.js experimental VM modules

## Test Structure
```
js/__tests__/
├── audio.test.js    # Audio system tests
├── game.test.js     # Game logic tests
├── i18n.test.js     # Internationalization tests
├── scores.test.js   # Score system tests
└── ui.test.js       # UI tests
```

## Running Tests

### Standard Test Run
```bash
npm test
```
This command uses Node.js experimental VM modules support for ES modules compatibility. The actual command that runs is:
```bash
NODE_OPTIONS=--experimental-vm-modules jest
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage Report
The project uses c8 for code coverage reporting. To generate a coverage report:
```bash
npm run coverage
```

This will generate:
- A text report in the console
- An HTML report in the coverage/lcov-report directory
- An lcov report for integration with other tools

The project aims to maintain high test coverage across all files, with comprehensive testing of core functionality.

## Writing Tests

### Test File Organization
Each test file should:
1. Import required modules
2. Mock dependencies
3. Group related tests with `describe`
4. Use clear test descriptions
5. Clean up after tests

Example structure:
```javascript
import { ModuleToTest } from '../module';
import { Dependencies } from '../dependencies';

jest.mock('../dependencies');

describe('ModuleToTest', () => {
    let instance;
    
    beforeEach(() => {
        instance = new ModuleToTest();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('specificFeature', () => {
        test('should behave in a certain way', () => {
            // Test code
        });
    });
});
```

### Component-Specific Guidelines

#### Audio System Tests (audio.test.js)
- Mock Web Audio API
- Test note frequency calculations
- Verify sound effects
- Check audio context management
- Test error handling

#### Game Logic Tests (game.test.js)
- Test state management
- Verify battle mechanics
- Check difficulty scaling
- Test sequence generation
- Validate scoring logic

#### UI Tests (ui.js)
- Test screen transitions
- Verify DOM updates
- Check event handlers
- Test message displays
- Validate health bar updates

#### Internationalization Tests (i18n.test.js)
- Test language switching
- Verify translations
- Check placeholder replacement
- Test DOM updates
- Validate event handling

#### Score System Tests (scores.test.js)
- Test score calculations
- Verify high score logic
- Check local storage
- Test data persistence
- Validate score formats

### Mocking Guidelines

#### Web Audio API
```javascript
const mockAudioContext = {
    createOscillator: jest.fn(),
    createGain: jest.fn(),
    // Add other required methods
};

window.AudioContext = jest.fn(() => mockAudioContext);
```

#### DOM Elements
```javascript
document.getElementById = jest.fn(() => ({
    classList: {
        add: jest.fn(),
        remove: jest.fn()
    },
    addEventListener: jest.fn()
}));
```

#### Local Storage
```javascript
const mockStorage = {};
global.localStorage = {
    getItem: jest.fn(key => mockStorage[key]),
    setItem: jest.fn((key, value) => { mockStorage[key] = value; }),
    clear: jest.fn(() => { for (const key in mockStorage) delete mockStorage[key]; })
};
```

## Test Categories

### Unit Tests
- Test individual functions
- Mock dependencies
- Focus on single responsibility
- Check edge cases
- Verify error handling

### Integration Tests
- Test component interactions
- Reduce mocking
- Focus on workflows
- Verify state changes
- Check event handling

### Snapshot Tests
- Capture UI states
- Verify DOM structure
- Track markup changes
- Document UI evolution

## Best Practices

### Writing Tests
1. Test description should clearly state what's being tested
2. Each test should focus on one specific thing
3. Use setup and teardown appropriately
4. Mock external dependencies
5. Test edge cases and error conditions

### Test Organization
1. Group related tests using `describe`
2. Use clear, descriptive names
3. Keep tests independent
4. Clean up after each test
5. Follow consistent patterns

### Assertions
1. Use specific assertions
2. Test both positive and negative cases
3. Verify state changes
4. Check error conditions
5. Validate output formats

## Common Patterns

### Setup and Teardown
```javascript
describe('Component', () => {
    let instance;
    
    beforeEach(() => {
        instance = new Component();
    });
    
    afterEach(() => {
        instance.cleanup();
        jest.clearAllMocks();
    });
});
```

### Async Testing
```javascript
test('async operation', async () => {
    await expect(asyncOperation()).resolves.toBe(expected);
});
```

### Event Testing
```javascript
test('event handler', () => {
    const handler = jest.fn();
    element.addEventListener('click', handler);
    element.click();
    expect(handler).toHaveBeenCalled();
});
```

## Troubleshooting Tests

### Common Issues
1. **Async Tests Timing Out**
   - Increase timeout
   - Check promise resolution
   - Verify async operations

2. **Mock Issues**
   - Check mock implementation
   - Verify mock calls
   - Clear mocks between tests

3. **DOM Testing Problems**
   - Check jsdom setup
   - Verify element creation
   - Test event propagation

### Debug Tips
1. Use `console.log` in tests
2. Check Jest watch mode
3. Run specific tests
4. Review coverage reports
5. Check mock implementations

## Continuous Integration

Tests are run automatically on:
- Pull requests
- Main branch pushes
- Release tags

### CI Pipeline
1. Install dependencies
2. Run linting
3. Execute tests
4. Generate coverage
5. Report results

## Maintaining Tests

### When to Update Tests
- New features added
- Bugs fixed
- Code refactored
- Dependencies updated
- Behavior changed

### Test Maintenance
1. Review test coverage
2. Update outdated tests
3. Remove obsolete tests
4. Add missing cases
5. Improve assertions

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)