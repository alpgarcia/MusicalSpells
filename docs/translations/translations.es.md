# Añadir Nuevas Traducciones a Musical Spells

## Introducción

Musical Spells utiliza un sistema de internacionalización flexible que facilita la adición de nuevos idiomas. Esta guía te ayudará en el proceso de añadir traducciones al juego.

## Estructura de Archivos

Las traducciones se gestionan mediante módulos JavaScript ubicados en la carpeta `js/translations`:
```
js/translations/
├── index.js     # Exporta todas las traducciones
├── en.js        # Traducciones al inglés
├── es.js        # Traducciones al español
└── [idioma].js  # Tu nuevo archivo de idioma
```

## Añadir un Nuevo Idioma

1. Crea un nuevo archivo `js/translations/[idioma].js` (ej: `fr.js` para francés)
2. Copia la estructura de un archivo de traducción existente
3. Traduce todas las cadenas
4. Añade tu idioma a `js/translations/index.js`
5. Añade el botón de idioma a index.html

### Plantilla de Archivo de Traducción

```javascript
export default {
    enemies: {
        melodicApprentice: {
            name: "Nombre traducido"
        },
        // ... más enemigos
    },
    battle: {
        prepare: "Mensaje traducido",
        // ... más mensajes de batalla
    },
    // ... más secciones
};
```

## Claves de Traducción

### Sección de Enemigos
- `enemies.[enemyId].name`: Nombres de enemigos mostrados en batalla y mapa

### Mensajes de Batalla
- `battle.prepare`: Mensaje inicial de batalla
- `battle.enemyTurn`: Mensaje de turno enemigo
- `battle.playerTurn`: Mensaje de turno del jugador
- `battle.spellHit`: Mensaje de hechizo exitoso
- `battle.spellFail`: Mensaje de hechizo fallido
- `battle.victory`: Mensaje de victoria
- `battle.defeat`: Mensaje de derrota

### Mensajes del Mapa
- `map.nextDuel`: Mensaje de próximo duelo
- `map.allDefeated`: Mensaje de todos los enemigos derrotados
- `map.level`: Indicador de nivel
- `map.currentScore`: Visualización de puntuación

### Elementos de Interfaz
- `buttons.continue`: Botón continuar
- `buttons.startGame`: Botón iniciar juego
- `difficulty.[level]`: Nombres de niveles de dificultad
- `hallOfFame.title`: Título del Salón de la Fama
- `hallOfFame.enterName`: Prompt de entrada de nombre

## Probar tu Traducción

1. Inicia el juego: `node server.js`
2. Prueba todas las pantallas y mensajes
3. Verifica que el texto cabe en los elementos de UI
4. Comprueba que los caracteres especiales se muestran correctamente
5. Prueba con diferentes niveles de zoom del navegador

## Adaptaciones Culturales

Considera estos aspectos al traducir:
- Mantén consistente el tema mágico/fantasía
- Mantén un nivel apropiado de formalidad
- Adapta expresiones idiomáticas
- Considera sensibilidades culturales
- Preserva la claridad del juego

## Directrices Técnicas

### Longitud del Texto
- Mantén las traducciones concisas
- Prueba en elementos de UI
- Considera pantallas móviles
- Usa abreviaturas si es necesario

### Caracteres Especiales
- Usa codificación UTF-8
- Prueba con las fuentes objetivo
- Considera fuentes de respaldo
- Verifica la visualización de caracteres

### Marcadores de Posición
Los mensajes pueden contener marcadores:
- `{enemy}`: Nombre del enemigo
- `{damage}`: Cantidad de daño
- `{score}`: Puntuación del jugador
- `{level}`: Número de nivel
- `{difficulty}`: Estrellas de dificultad

Ejemplo:
```javascript
{
    battle: {
        spellHit: "¡{enemy} recibe {damage} de daño!"
    }
}
```

## Enviar Traducciones

1. Haz fork del repositorio
2. Crea tu módulo de traducción
3. Actualiza el índice de traducciones
4. Prueba exhaustivamente
5. Envía un pull request con:
   - Tu módulo de traducción
   - `index.js` actualizado
   - Documentación actualizada si es necesario
   - Cualquier adaptación cultural necesaria

## Lista de Verificación de Calidad

- [ ] Todas las cadenas traducidas
- [ ] Marcadores de posición preservados
- [ ] Caracteres especiales funcionando
- [ ] Texto cabe en elementos de UI
- [ ] Adaptaciones culturales realizadas
- [ ] Documentación actualizada
- [ ] Tests pasando

## Obtener Ayuda

Si necesitas ayuda con:
- Contexto de traducción
- Implementación técnica
- Adaptaciones culturales
- Restricciones de UI

Por favor:
1. Revisa las traducciones existentes
2. Consulta la documentación
3. Abre un issue si es necesario

## Actualizaciones de Traducción

Cuando el juego se actualiza:
1. Se añadirán nuevas cadenas a `en.js`
2. Actualiza tu archivo de idioma
3. Prueba el nuevo contenido
4. Envía actualizaciones vía PR

Recuerda mantener:
- Estilo consistente
- Significado preciso
- Relevancia cultural
- Corrección técnica