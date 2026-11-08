# AYNI — Correcciones de interfaz

## 1. Desplazamiento de actividades
- Los cuadros modales ahora tienen una altura máxima relativa a la pantalla y desplazamiento vertical propio.
- Se añadió desplazamiento táctil y contención del gesto para pantallas móviles.
- El bloqueo del desplazamiento del documento utiliza un contador compartido para evitar que el cierre de un modal reabra el fondo mientras otro sigue abierto.

## 2. Flujo de publicaciones
- Cerrar, cancelar o completar una publicación limpia el tipo, el texto y los errores anteriores.
- Se puede regresar al paso de selección del tipo sin conservar un borrador anterior.
- Se añadió una acción explícita de cancelación en el paso de detalle.

## 3. Selección de zona
- El botón que cambiaba de zona en secuencia se sustituyó por un desplegable que permite seleccionar directamente una de las zonas de AYNI.

## Archivos modificados
- `frontend/src/App.tsx`
- `frontend/src/index.css`

## Verificación
- TypeScript: comprobado con `tsc --noEmit -p tsconfig.json` sin errores.
- No se pudo completar `vite build` en este entorno porque falta el paquete de enlace nativo opcional de Rolldown para Linux en el `node_modules` suministrado. No es un error detectado en el código TypeScript; la compilación final debe comprobarse en el equipo local después de `npm install`.
