# Registro de cambios
Todos los cambios notables en Musical Spells serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/lang/es/).

> **Nota**: Al actualizar el número de versión, recuerda actualizarlo en ambos:
> - `package.json`: Utilizado por npm para la gestión de dependencias y scripts
> - `js/config.js`: Utilizado por el juego para mostrar la versión en la interfaz y asegurar que la versión se muestra correctamente tanto en entorno local como online
>
> Esta doble ubicación es necesaria porque `package.json` no es accesible en el navegador cuando se despliega en GitHub Pages, mientras que `config.js` asegura que la versión siempre sea visible para los usuarios independientemente del entorno de despliegue.

## [0.6.0-beta] - 2025-03-14
### Añadido
- Cobertura completa de tests unitarios para todos los componentes principales:
  - Cobertura general: 95.4% sentencias, 92.43% ramas, 94.93% funciones
  - Cobertura total (100%) alcanzada en audio.js, config.js, scores.js y traducciones
  - Alta cobertura en componentes core: game.js (94.28%), i18n.js (97.67%), ui.js (94.05%)
- Organización de la documentación en guías especializadas:
  - Guías de usuario: documentación de primeros pasos y jugabilidad
  - Guías de desarrollo: guías de contribución y testing
  - Guía de traducción con instrucciones detalladas

### Cambiado
- Mejorada la estructura y organización de la documentación:
  - Movida la mayoría de la documentación al directorio `docs/`
  - Simplificado el README para ser más enfocado y conciso
  - Separada la documentación de usuario y desarrollo
  - Mejoradas las directrices de mensajes de commit en git
- Actualizada la documentación de desarrollo con instrucciones detalladas de testing
- Añadido enlace a la versión online en la documentación

## [0.5.2-beta] - 2025-03-08
### Cambiado
- Aumentado el tiempo de visualización de los mensajes de daño durante el combate.
- Mejorada la presentación de las traducciones en el Muro de la Hechicería.

### Corregido
- Solucionados errores en sistema de traducciones:
    - Corregidos múltiples errores en las pantallas de mapa y combate cuando
      se cambiaba de idioma.
    - Corregido error que mostraba placeholders incorrectos en la pantalla de
      puntuaciones.
    - Solucionados errores en las traducciones de los botones.
- Cambiada la posición del botón 'Continuar' en la pantalla de combate.
- Corregidos los controles táctiles en dispositivos móviles (no se detectaban las
  pulsaciones en las notas).

## [0.5.0-beta] - 2025-03-08
### Añadido
- Sistema básico de duelos musicales.
- Cuatro niveles de dificultad: Novato, Aprendiz, Adepto y Maestro.
- Soporte para múltiples idiomas (Español e Inglés).
- Opción para escuchar nota de referencia antes de cada duelo.
- Sistema de efectos de sonido y retroalimentación visual.
- Soporte para controles por teclado y ratón.
- Sistema de puntuación con tabla de clasificación (Muro de la Hechicería).