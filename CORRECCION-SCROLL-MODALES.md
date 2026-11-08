# Corrección del desplazamiento en ventanas emergentes

Se corrigió el problema que se observa al abrir detalles de Retos Ayni, Puntos y Servicios.

## Qué pasaba

El modal permitía que su contenido determinara la altura del cuadro y mezclaba el desplazamiento del fondo con el del propio modal. En pantallas de poca altura, el final del contenido quedaba fuera del área visible y no había una región interior fiable para recorrerlo.

## Qué cambió

- El fondo del modal ocupa la ventana y ya no se desplaza.
- El cuadro modal queda limitado a la altura disponible del navegador.
- El contenido interior tiene su propio `overflow-y: auto`, `min-height: 0` y desplazamiento táctil.
- El encabezado, título y botón de cerrar se mantienen visibles mientras se desplaza el contenido.
- La corrección se aplica al componente Modal compartido por los detalles de retos, puntos y servicios.

## Archivos

- `frontend/src/App.tsx`
- `frontend/src/index.css`

No se modifica la base de datos ni el backend. No es necesario volver a ejecutar el script SQL.
