# Contrato REST de integración (demo AYNI)

Base URL: `http://localhost:8080/api/v1`

## GET `/demo/state`

Obtiene el objeto de estado completo del frontend. Si es la primera ejecución y aún no hay datos guardados, devuelve `204 No Content`.

## PUT `/demo/state`

Guarda el estado actual del frontend. El cuerpo debe ser un objeto JSON que represente `AyniState` (sesión, perfil, retos, puntos, recompensas, servicios, favores, donaciones, intercambios, mensajes, publicaciones, emergencia, notificaciones, canjes y configuración).

Respuesta:

```json
{
  "success": true,
  "message": "Estado de AYNI guardado en MySQL",
  "updatedAt": "2026-11-08T06:00:00Z"
}
```

## GET `/health`

Comprueba la disponibilidad de la API y se utiliza como health check del contenedor.

## Nota de alcance

El endpoint de estado es un mecanismo de integración rápido para esta versión de demostración. No reemplaza un diseño de API de producción con recursos independientes, autorización y persistencia normalizada.
