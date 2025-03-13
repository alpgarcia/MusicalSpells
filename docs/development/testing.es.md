# Guía de Testing para Musical Spells

## Visión General
Musical Spells usa Jest para tests unitarios con soporte experimental de módulos ES, proporcionando una cobertura completa para todos los componentes principales. El entorno de testing está configurado para manejar:
- Manipulación del DOM via jsdom
- Simulación de Web Audio API
- Simulación de Local Storage
- Módulos CSS
- Soporte para Módulos ES6 via módulos VM experimentales de Node.js

## Estructura de Tests
```
js/__tests__/
├── audio.test.js    # Tests del sistema de audio
├── game.test.js     # Tests de la lógica del juego
├── i18n.test.js     # Tests de internacionalización
├── scores.test.js   # Tests del sistema de puntuación
└── ui.test.js       # Tests de UI
```

## Ejecutar Tests

### Ejecución Estándar
```bash
npm test
```
Este comando usa el soporte experimental de módulos VM de Node.js para compatibilidad con módulos ES. El comando real que se ejecuta es:
```bash
NODE_OPTIONS=--experimental-vm-modules jest
```

### Modo Watch
```bash
npm test -- --watch
```

### Informe de Cobertura
El proyecto usa c8 para generar informes de cobertura. Para generar un informe de cobertura:
```bash
npm run coverage
```

Esto generará:
- Un informe de texto en la consola
- Un informe HTML en el directorio coverage/lcov-report
- Un informe lcov para integración con otras herramientas

El proyecto mantiene un alto nivel de cobertura de tests en todos los archivos, con pruebas exhaustivas de la funcionalidad principal.

## Escribir Tests

### Organización del Archivo de Test
Cada archivo de test debe:
1. Importar los módulos necesarios
2. Simular dependencias
3. Agrupar tests relacionados con `describe`
4. Usar descripciones claras
5. Limpiar después de los tests

Estructura de ejemplo:
```javascript
import { ModuloATestear } from '../modulo';
import { Dependencias } from '../dependencias';

jest.mock('../dependencias');

describe('ModuloATestear', () => {
    let instancia;
    
    beforeEach(() => {
        instancia = new ModuloATestear();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('caracteristicaEspecifica', () => {
        test('debería comportarse de cierta manera', () => {
            // Código del test
        });
    });
});
```

### Directrices por Componente

#### Tests del Sistema de Audio (audio.test.js)
- Simular Web Audio API
- Probar cálculos de frecuencia de notas
- Verificar efectos de sonido
- Comprobar gestión del contexto de audio
- Probar manejo de errores

#### Tests de Lógica del Juego (game.test.js)
- Probar gestión de estado
- Verificar mecánicas de batalla
- Comprobar escalado de dificultad
- Probar generación de secuencias
- Validar lógica de puntuación

#### Tests de UI (ui.js)
- Probar transiciones de pantalla
- Verificar actualizaciones del DOM
- Comprobar manejadores de eventos
- Probar visualización de mensajes
- Validar actualizaciones de barras de salud

#### Tests de Internacionalización (i18n.test.js)
- Probar cambio de idioma
- Verificar traducciones
- Comprobar reemplazo de placeholders
- Probar actualizaciones del DOM
- Validar manejo de eventos

#### Tests del Sistema de Puntuación (scores.test.js)
- Probar cálculos de puntuación
- Verificar lógica de puntuaciones altas
- Comprobar almacenamiento local
- Probar persistencia de datos
- Validar formatos de puntuación

### Guías de Simulación (Mocking)

#### Web Audio API
```javascript
const mockContextoAudio = {
    createOscillator: jest.fn(),
    createGain: jest.fn(),
    // Añadir otros métodos necesarios
};

window.AudioContext = jest.fn(() => mockContextoAudio);
```

#### Elementos DOM
```javascript
document.getElementById = jest.fn(() => ({
    classList: {
        add: jest.fn(),
        remove: jest.fn()
    },
    addEventListener: jest.fn()
}));
```

#### Almacenamiento Local
```javascript
const mockAlmacenamiento = {};
global.localStorage = {
    getItem: jest.fn(key => mockAlmacenamiento[key]),
    setItem: jest.fn((key, value) => { mockAlmacenamiento[key] = value; }),
    clear: jest.fn(() => { for (const key in mockAlmacenamiento) delete mockAlmacenamiento[key]; })
};
```

## Categorías de Tests

### Tests Unitarios
- Probar funciones individuales
- Simular dependencias
- Enfocarse en responsabilidad única
- Comprobar casos límite
- Verificar manejo de errores

### Tests de Integración
- Probar interacciones entre componentes
- Reducir simulaciones
- Enfocarse en flujos de trabajo
- Verificar cambios de estado
- Comprobar manejo de eventos

### Tests de Snapshot
- Capturar estados de UI
- Verificar estructura del DOM
- Seguir cambios en el marcado
- Documentar evolución de la UI

## Mejores Prácticas

### Escribir Tests
1. La descripción del test debe indicar claramente qué se está probando
2. Cada test debe enfocarse en una cosa específica
3. Usar setup y teardown apropiadamente
4. Simular dependencias externas
5. Probar casos límite y condiciones de error

### Organización de Tests
1. Agrupar tests relacionados usando `describe`
2. Usar nombres claros y descriptivos
3. Mantener los tests independientes
4. Limpiar después de cada test
5. Seguir patrones consistentes

### Aserciones
1. Usar aserciones específicas
2. Probar casos positivos y negativos
3. Verificar cambios de estado
4. Comprobar condiciones de error
5. Validar formatos de salida

## Patrones Comunes

### Setup y Teardown
```javascript
describe('Componente', () => {
    let instancia;
    
    beforeEach(() => {
        instancia = new Componente();
    });
    
    afterEach(() => {
        instancia.limpiar();
        jest.clearAllMocks();
    });
});
```

### Testing Asíncrono
```javascript
test('operación asíncrona', async () => {
    await expect(operacionAsincrona()).resolves.toBe(esperado);
});
```

### Testing de Eventos
```javascript
test('manejador de eventos', () => {
    const manejador = jest.fn();
    elemento.addEventListener('click', manejador);
    elemento.click();
    expect(manejador).toHaveBeenCalled();
});
```

## Solución de Problemas en Tests

### Problemas Comunes
1. **Tests Asíncronos Expirando**
   - Aumentar timeout
   - Comprobar resolución de promesas
   - Verificar operaciones asíncronas

2. **Problemas con Mocks**
   - Comprobar implementación del mock
   - Verificar llamadas al mock
   - Limpiar mocks entre tests

3. **Problemas con Testing DOM**
   - Comprobar configuración de jsdom
   - Verificar creación de elementos
   - Probar propagación de eventos

### Consejos de Depuración
1. Usar `console.log` en tests
2. Comprobar modo watch de Jest
3. Ejecutar tests específicos
4. Revisar informes de cobertura
5. Comprobar implementaciones de mocks

## Integración Continua

Los tests se ejecutan automáticamente en:
- Pull requests
- Pushes a la rama principal
- Tags de release

### Pipeline de CI
1. Instalar dependencias
2. Ejecutar linting
3. Ejecutar tests
4. Generar cobertura
5. Reportar resultados

## Mantenimiento de Tests

### Cuándo Actualizar Tests
- Nuevas funcionalidades añadidas
- Bugs corregidos
- Código refactorizado
- Dependencias actualizadas
- Comportamiento cambiado

### Mantenimiento de Tests
1. Revisar cobertura de tests
2. Actualizar tests obsoletos
3. Eliminar tests obsoletos
4. Añadir casos faltantes
5. Mejorar aserciones

## Recursos

- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API)