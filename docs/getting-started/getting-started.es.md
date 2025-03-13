# Primeros Pasos con Musical Spells

Esta guía te ayudará a empezar con Musical Spells, ya sea que quieras jugar online o ejecutarlo localmente.

## Jugar Online

La forma más fácil de empezar a jugar Musical Spells es a través de nuestra versión online:

🎮 [Jugar a Musical Spells](https://alpgarcia.github.io/MusicalSpells/)

## Ejecutar Localmente

### Requisitos Previos

- Node.js instalado en tu sistema (descárgalo desde [nodejs.org](https://nodejs.org/))

### Instalación

1. Clona este repositorio o descarga los archivos:
   ```bash
   git clone https://github.com/alpgarcia/MusicalSpells.git
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

El juego se ejecutará en tu navegador y podrás empezar a jugar inmediatamente.

## Compatibilidad con Navegadores

Musical Spells es compatible con navegadores modernos:

### Navegadores Recomendados
- **Google Chrome** (recomendado) - Mejor rendimiento y manejo de audio
- **Mozilla Firefox** - Compatibilidad completa
- **Safari** - Compatibilidad completa
- **Microsoft Edge** - Compatibilidad completa

### Requisitos
- JavaScript habilitado
- Soporte para Web Audio API
- Navegador moderno con soporte para Módulos ES6

Para una mejor experiencia, recomendamos:
- Usar la última versión de tu navegador elegido
- Tener el sonido habilitado
- Usar un dispositivo con teclado para un control óptimo (aunque se admiten controles táctiles)

### Problemas Conocidos
- Algunos navegadores móviles pueden tener problemas de latencia de audio
- Los navegadores antiguos sin soporte para Web Audio API no funcionarán
- Internet Explorer no es compatible

## Solución de Problemas

### Problemas Comunes

1. **Sin Sonido**
   - Asegúrate de que tu navegador admite Web Audio API
   - Comprueba que el sonido de tu sistema está habilitado y funcionando
   - Asegúrate de que el sitio tiene permiso para reproducir audio

2. **Problemas de Rendimiento**
   - Cierra otras pestañas o aplicaciones que consuman muchos recursos
   - Comprueba si tu navegador está actualizado
   - Prueba usar Google Chrome para un rendimiento óptimo

3. **El Juego No Inicia**
   - Asegúrate de que JavaScript está habilitado en tu navegador
   - Limpia la caché de tu navegador y recarga
   - Comprueba si estás usando un navegador compatible

### Obtener Ayuda

Si encuentras algún problema no cubierto aquí:
1. Consulta nuestros [Issues de GitHub](https://github.com/alpgarcia/MusicalSpells/issues) para problemas similares
2. Abre un nuevo issue si tu problema no ha sido reportado
3. Incluye la versión de tu navegador y sistema operativo en cualquier reporte de errores