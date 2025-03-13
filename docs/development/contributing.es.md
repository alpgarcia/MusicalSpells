# Contribuir a Musical Spells

¡Gracias por tu interés en contribuir a Musical Spells! Esta guía te ayudará a entender cómo contribuir al proyecto.

## Estructura del Proyecto

```
MusicalSpells/
├── js/              # Módulos JavaScript
│   ├── main.js      # Punto de entrada principal
│   ├── game.js      # Lógica principal del juego
│   ├── audio.js     # Gestión de audio y notas musicales
│   ├── scores.js    # Sistema de puntuación y salón de la fama
│   ├── ui.js        # Gestión de la interfaz de usuario
│   ├── i18n.js      # Sistema de internacionalización
│   ├── config.js    # Constantes de configuración
│   ├── enemies.js   # Configuración de enemigos
│   ├── __tests__/   # Tests unitarios
│   └── translations/ # Módulos de traducción
├── docs/            # Documentación
├── styles.css       # Estilos CSS
├── index.html       # Página principal del juego
└── server.js        # Servidor de desarrollo local
```

## Configuración del Entorno

1. Haz fork y clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   node server.js
   ```
4. Abre http://localhost:3000 para ver el juego

## Componentes Principales

### Motor del Juego (game.js)
La lógica principal del juego es gestionada por la clase `Game`, que maneja:
- Gestión del estado del juego
- Sistema de batalla
- IA de enemigos y escalado de dificultad
- Seguimiento de puntuación
- Procesamiento de entrada del jugador

### Sistema de Audio (audio.js)
Maneja toda la funcionalidad relacionada con el sonido:
- Generación de notas musicales usando Web Audio API
- Efectos de sonido
- Gestión del contexto de audio
- Mapeo de frecuencias de notas

### Interfaz de Usuario (ui.js)
Gestiona los componentes de la interfaz del juego:
- Transiciones entre pantallas
- Barras de salud
- Mensajes de batalla
- Cambio de idioma
- Visualización de puntuación
- Mapa de progreso

### Internacionalización (i18n.js)
Proporciona soporte multiidioma:
- Cambio dinámico de idioma
- Gestión de claves de traducción
- Sistema de reemplazo de texto
- Actualizaciones del DOM al cambiar el idioma

### Sistema de Puntuación (scores.js)
Maneja puntuaciones y logros:
- Cálculo de puntuación
- Gestión del Salón de la Fama
- Integración con almacenamiento local
- Validación de puntuaciones altas

## Contribuir Código

### Estilo de Código
- Usa características ES6+ apropiadamente
- Sigue las convenciones de nomenclatura existentes
- Comenta la lógica compleja
- Mantén las funciones enfocadas y pequeñas
- Usa nombres de variables significativos

### Proceso de Pull Request
1. Crea una rama de funcionalidad
2. Realiza tus cambios
3. Añade/actualiza tests
4. Actualiza la documentación
5. Ejecuta los tests (`npm test`)
6. Envía el PR con una descripción clara

### Mensajes de Commit

> **Importante**: Los mensajes de commit deben escribirse siempre en inglés, independientemente 
> del idioma de la documentación o los comentarios en el código. Esto facilita la 
> colaboración internacional y mantiene la consistencia en el histórico del proyecto.

Seguimos [Las Siete Reglas de un Gran Mensaje de Commit en Git](https://cbea.ms/git-commit/):

1. **Separar el asunto del cuerpo con una línea en blanco**
   ```
   Add spell combo multiplier system

   This system encourages players to chain successful spells by:
   - Increasing score multiplier with each hit (max 4x)
   - Resetting multiplier on spell failure
   - Adding visual feedback for current multiplier
   ```

2. **Limitar la línea de asunto a 50 caracteres**
   - Bien: "Add volume control to reference note"
   - Mal: "Added a new feature that lets users control the volume of the reference note when practicing"

3. **Capitalizar la línea de asunto**
   - Bien: "Fix audio latency in mobile browsers"
   - Mal: "fix audio latency in mobile browsers"

4. **No terminar la línea de asunto con un punto**
   - Bien: "Update enemy difficulty scaling"
   - Mal: "Update enemy difficulty scaling."

5. **Usar el modo imperativo en la línea de asunto**
   - Bien: "Add high score tracking"
   - Mal: "Added high score tracking"
   - Mal: "Adds high score tracking"

6. **Ajustar el cuerpo a 72 caracteres**
   Cada línea en el cuerpo del commit debe tener 72 caracteres o menos para una óptima 
   legibilidad en las herramientas de git.

7. **Usar el cuerpo para explicar qué y por qué vs. cómo**
   ```
   Refactor spell validation system

   The previous implementation mixed game logic with UI updates,
   making it hard to test and maintain. This change separates
   concerns by moving all spell validation to the Game class.

   The UI now listens for game events instead of handling
   validation directly.
   ```

Ejemplos de buenos mensajes de commit:
```
Add practice mode with infinite health

This allows players to practice spell patterns without the
pressure of combat. Key changes:
- New UI toggle for practice mode
- Disable damage calculation in practice
- Add visual indicator for practice mode
```

```
Fix incorrect score calculation for Master difficulty

Score multiplier was being applied twice for Master level
battles. This resulted in artificially inflated scores
that made the leaderboard unfair.
```

Recuerda:
- Cada commit debe representar un cambio lógico
- Escribe los commits como instrucciones al código base
- Explica los cambios no obvios en el cuerpo del commit
- Considera tus mensajes de commit como documentación
- Usa siempre el inglés para mantener la consistencia

## Directrices de Desarrollo

### Añadir Nuevas Funcionalidades
1. Comienza con una discusión en issues
2. Planifica el enfoque de implementación
3. Considera la compatibilidad hacia atrás
4. Añade los tests necesarios
5. Actualiza la documentación
6. Envía los cambios como PR

### Modificar Funcionalidades Existentes
1. Comprende la implementación actual
2. Mantén la compatibilidad hacia atrás
3. Actualiza los tests afectados
4. Documenta los cambios
5. Prueba exhaustivamente

### Calidad del Código
- Mantén la cobertura de tests
- Sigue los principios SOLID
- Mantén el código modular
- Considera el rendimiento
- Maneja los errores adecuadamente

## Obtener Ayuda

- Consulta los issues existentes
- Lee la documentación
- Pide aclaraciones
- Únete a las discusiones

## Proceso de Revisión

Los PRs se revisan para:
- Calidad del código
- Cobertura de tests
- Documentación
- Impacto en rendimiento
- Compatibilidad con navegadores

## Gestión de Deuda Técnica

Reporta la deuda técnica como issues con:
- Descripción clara del problema
- Evaluación del impacto
- Soluciones sugeridas
- Nivel de prioridad

## Proceso de Lanzamiento

1. Actualización de versión en:
   - package.json
   - js/config.js
2. Actualizar changelog
3. Ejecutar suite completa de tests
4. Crear tag de release
5. Desplegar a GitHub Pages

Recuerda: Calidad sobre cantidad. Tómate tu tiempo para escribir buen código que otros puedan mantener.