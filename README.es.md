# Musical Spells - El Duelo de Magos

## Descripción

Musical Spells es un juego musical de memoria y reflejos donde encarnas a un aprendiz de mago que debe enfrentarse a otros hechiceros en duelos musicales. Para vencer a tus rivales, deberás repetir correctamente las secuencias de notas musicales que escuches cuando tu oponente lance su conjuro.

Este juego combina elementos de memoria musical, reconocimiento de tonos y reflejos rápidos, todo envuelto en una temática mágica y divertida.

## Características

- **Sistema de duelos por turnos**: Escucha y repite la secuencia de notas para atacar a tu oponente.
- **Múltiples niveles de dificultad**: Desde Novato (2 notas) hasta Maestro (7 notas).
- **Cuatro magos rivales**: Cada uno con un nivel de dificultad progresiva.
- **Mapa de progreso**: Visualiza tu avance y los magos que has derrotado.
- **Escala musical completa**: Juega con las siete notas musicales (Do, Re, Mi, Fa, Sol, La, Si).
- **Controles dobles**: Juega usando botones o el teclado con notación americana (C, D, E, F, G, A, B).
- **Nota de referencia**: Opción para escuchar un Do de referencia antes de cada duelo.
- **Sistema de energía**: Cada hechizo exitoso reduce la energía de tu oponente. El primero en quedarse sin energía pierde.
- **Soporte multilenguaje**: Disponible en español e inglés, con posibilidad de añadir más idiomas.

## Requisitos previos

- Node.js instalado en tu sistema (puedes descargarlo desde [nodejs.org](https://nodejs.org/))

## Cómo ejecutar el juego

1. Clona este repositorio o descarga los archivos:
   ```bash
   git clone https://github.com/tuusuario/MusicalSpells.git
   cd MusicalSpells
   ```

2. Inicia el servidor local:
   ```bash
   node server.js
   ```

3. Abre tu navegador web y visita:
   ```
   http://localhost:3000
   ```

El juego se ejecutará en tu navegador y podrás comenzar a jugar inmediatamente.

## Cómo jugar

1. **Pantalla de inicio**:
   - Selecciona tu nivel de dificultad:
     - **Novato**: Solo 2 notas (Do, Re)
     - **Aprendiz**: 3 notas (Do, Re, Mi)
     - **Adepto**: 5 notas (Do, Re, Mi, Fa, Sol)
     - **Maestro**: 7 notas (Do, Re, Mi, Fa, Sol, La, Si)
   - Activa/desactiva la opción de escuchar una nota de referencia antes de cada duelo.
   - Haz clic en "¡Comenzar Aventura!" para iniciar el juego.

2. **Mapa de progreso**:
   - Visualiza a todos los magos rivales y tu progreso actual.
   - Haz clic en un mago disponible para comenzar un duelo.

3. **Durante el duelo**:
   - El mago rival lanzará un hechizo musical (una secuencia de notas).
   - Deberás repetir exactamente la misma secuencia para contraatacar.
   - Si repites la secuencia correctamente, el mago rival perderá energía.
   - Si te equivocas, tú perderás energía.
   - El primero en quedarse sin energía pierde el duelo.

4. **Controles**:
   - **Botones en pantalla**: Haz clic en los botones de colores para tocar las notas.
   - **Teclado**: Usa las teclas C (Do), D (Re), E (Mi), F (Fa), G (Sol), A (La), B (Si).

## Magos rivales

1. **Aprendiz Melodioso** - Nivel 1
   - El primer rival, perfecto para practicar tus habilidades básicas.

2. **Hechicero de las Octavas** - Nivel 2
   - Un mago con más experiencia que pone a prueba tu memoria musical.

3. **Maga Armónica** - Nivel 3
   - Una hechicera experta que utiliza complejas secuencias musicales.

4. **Archimago Sinfónico** - Nivel 4
   - El mago más poderoso, con las secuencias más largas y difíciles.

## Sistema de Puntuación

El juego cuenta con un sistema de puntuación dinámico que tiene en cuenta varios factores:

- **Puntos base**: 1000 puntos por cada nivel completado
- **Bonus por salud**: 10 puntos adicionales por cada punto de vida restante
- **Multiplicadores por dificultad**:
  - Novato: x1
  - Aprendiz: x1.5
  - Adepto: x2
  - Maestro: x3
- **Modificador de referencia**: Si juegas con la nota de referencia activada, se aplica un multiplicador de 0.8 a la puntuación final

La puntuación se guarda en el Salón de la Fama en dos casos:
1. Al completar todos los niveles y derrotar al Archimago Sinfónico
2. Al ser derrotado, pero solo si has conseguido más de 0 puntos y tu puntuación es lo suficientemente alta para entrar en el top 10

Durante el juego, puedes ver tu puntuación actual en el mapa de progreso, lo que te permite decidir si quieres repetir duelos anteriores para mejorar tu puntuación antes de enfrentarte a magos más poderosos.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Web Audio API
- Node.js (servidor local)

## Compatibilidad

Musical Spells es compatible con los navegadores modernos como:
- Google Chrome (recomendado)
- Mozilla Firefox
- Safari
- Microsoft Edge

Para una mejor experiencia, se recomienda utilizar la última versión de estos navegadores.

## Estructura del proyecto

```
MusicalSpells/
│
├── index.html          # Página principal del juego
├── styles.css         # Estilos CSS
├── server.js         # Servidor local para desarrollo
├── js/              # Módulos JavaScript
│   ├── main.js      # Punto de entrada principal
│   ├── game.js      # Lógica principal del juego
│   ├── audio.js     # Gestión de audio y notas musicales
│   ├── ui.js        # Gestión de la interfaz de usuario
│   ├── i18n.js      # Sistema de internacionalización
│   └── enemies.js   # Configuración de enemigos
│
├── i18n/            # Archivos de traducción
│   ├── en.json     # Traducciones al inglés
│   └── es.json     # Traducciones al español
│
├── LICENSE          # Licencia GPL v3
├── TRANSLATIONS.md  # Guía para añadir nuevas traducciones
├── README.md        # Archivo en inglés
└── README.es.md     # Este archivo (español)
```

## Contribuir con Traducciones

Musical Spells soporta múltiples idiomas a través de su sistema de internacionalización. Si quieres añadir soporte para un nuevo idioma, por favor consulta nuestra [Guía de Traducción](TRANSLATIONS.md) para instrucciones detalladas (en inglés).

## Posibles mejoras futuras

- ¿Eliminar la posibilidad de repetir un combate?
- Añadir bonificación o penalización por tiempo
- Añadir más niveles y magos rivales
- Implementar efectos visuales avanzados
- Incluir un modo de dos jugadores
- Añadir hechizos especiales que generen diferentes efectos
- Crear un sistema de progresión con nuevas habilidades desbloqueables
- Opciones de personalización para el personaje del jugador
- Soporte para idiomas adicionales

## Licencia

Este proyecto está licenciado bajo la GNU General Public License v3.0 - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Créditos

Este proyecto fue desarrollado principalmente con asistencia de IA:

- **Claude 3.5 (también 3.7) Sonnet**: Utilizado para la mayoría del desarrollo del código, incluyendo la lógica del juego, mecánicas y estructura. Ambas versiones contribuyeron a diferentes aspectos de la implementación del proyecto.
- **GitHub Copilot**: Utilizado para completar código, sugerencias y asistencia en la programación en pareja durante el proceso de desarrollo.

El proyecto demuestra las capacidades de los modelos de lenguaje de IA modernos en el desarrollo de software, con casi todo el código siendo generado por Claude Sonnet. La supervisión humana se mantuvo para el diseño del proyecto, las mecánicas de juego y toma de decisiones final.

---

Desarrollado como un proyecto educativo y de entretenimiento. ¡Disfruta del juego y conviértete en el mejor mago musical!