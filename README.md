# AYNI — frontend + backend integrado (sin Docker)

> **Demo en línea:** https://frontend-production-f6b0.up.railway.app
> **API:** https://backend-production-1033.up.railway.app/api/v1
> Instrucciones de despliegue: [DEPLOY.md](DEPLOY.md)

Esta versión conecta el frontend React de AYNI con una API REST en Spring Boot y una base de datos MySQL local. No usa Docker, XAMPP ni MariaDB. Puedes administrar la base con MySQL Workbench.

## Importante: Workbench y MySQL Server son distintos

MySQL Workbench es la interfaz gráfica para conectarte y ejecutar consultas. La aplicación Java se conecta al servicio **MySQL Server**, que debe estar instalado y ejecutándose en tu PC.

Si ya abres MySQL Workbench y puedes conectarte a una instancia local (normalmente `127.0.0.1`, puerto `3306`), probablemente ya tienes MySQL Server. Si Workbench no tiene una conexión local activa, instala también MySQL Server.

## Requisitos

- JDK 25 (no solo Java Runtime).
- Apache Maven 3.9 o superior, disponible como comando `mvn`.
- Node.js 22.12 o superior y npm.
- MySQL Server 8.x iniciado en `127.0.0.1:3306`.
- MySQL Workbench para ejecutar el script SQL y revisar las tablas.

## Paso 1. Preparar MySQL desde Workbench

1. Inicia el servicio **MySQL Server** desde Windows (puedes buscar `Servicios` y arrancar `MySQL80`, si ese es el nombre instalado).
2. Abre MySQL Workbench y entra a tu conexión local con un usuario administrador, por ejemplo `root`.
3. Abre `database/01_setup_ayni.sql` desde Workbench.
4. Ejecuta todo el script con el botón del rayo.
5. El script crea `ayni_db` y el usuario de aplicación `ayni`. La contraseña local de demostración es `ayni_local_2026`.

La tabla `ayni_demo_state` se crea automáticamente cuando Spring Boot inicia por primera vez. Puedes comprobarlo ejecutando después `database/02_verify_ayni.sql`.

## Paso 2. Iniciar AYNI

1. Descomprime la carpeta del proyecto en una ruta sencilla, por ejemplo `C:\AYNI-Fullstack`.
2. Asegúrate de que MySQL Server siga ejecutándose.
3. Haz doble clic en `start.bat`.
4. Se abrirán dos ventanas: una para Spring Boot y otra para React/Vite. La primera instalación puede tardar mientras Maven y npm descargan dependencias. Necesitas conexión a Internet en ese primer inicio.
5. Abre `http://localhost:5173`.
6. En el acceso, selecciona **Entrar con usuario de demostración**.

## Direcciones

| Servicio | Dirección |
|---|---|
| Frontend AYNI | http://localhost:5173 |
| API REST | http://localhost:8080/api/v1 |
| Swagger | http://localhost:8080/swagger-ui.html |
| OpenAPI JSON | http://localhost:8080/v3/api-docs |
| Health check | http://localhost:8080/api/v1/health |
| Estado guardado | http://localhost:8080/api/v1/demo/state |

## Conexión de Workbench a la base AYNI

Puedes crear una conexión en Workbench con estos datos:

- Hostname: `127.0.0.1`
- Port: `3306`
- Username: `ayni`
- Password: `ayni_local_2026`
- Default schema: `ayni_db`

También puedes seguir usando tu conexión administrativa habitual para revisar la base.

## Cómo comprobar que frontend y backend están conectados

1. Entra al frontend con el acceso de demostración.
2. Realiza algún cambio dentro de los módulos.
3. Recarga la página.
4. Los cambios deben persistir: el frontend sincroniza el estado con Spring Boot y este lo guarda en MySQL.
5. En Workbench, actualiza el panel Schemas y revisa `ayni_db` → Tables → `ayni_demo_state`.

Si abres la web antes de que Spring Boot termine de iniciar, espera a que la ventana del backend indique que arrancó y recarga el frontend.

## Detener AYNI

Cierra las ventanas de terminal llamadas **AYNI Backend** y **AYNI Frontend**. No necesitas detener MySQL Server.


## Correcciones de interfaz incluidas

Esta edición también corrige tres problemas de navegación reportados al probar la aplicación:

- **Desplazamiento en actividades:** las ventanas de Retos, Puntos y solicitudes de Servicios ahora permiten desplazarse verticalmente por todo su contenido. El bloqueo del desplazamiento de fondo también se controla correctamente cuando una ventana abre otra.
- **Publicaciones:** cerrar o cancelar el flujo de publicación restablece el formulario. Puedes cambiar el tipo de publicación o cancelar sin tener que completar el envío.
- **Ubicación:** el selector de zona del encabezado ahora es una lista desplegable con todas las zonas disponibles, en lugar de avanzar una por una con cada clic.

Los cambios están en `frontend/src/App.tsx` y `frontend/src/index.css`.

### Corrección adicional: contenido cortado en ventanas emergentes

Se ajustó la estructura común de las ventanas emergentes (Modal): el fondo deja de desplazarse mientras está abierto, el cuadro se limita a la altura visible de la pantalla y el área interior del contenido adquiere su propio desplazamiento vertical. El encabezado con el título y el botón de cerrar permanece visible. Este arreglo aplica también a los detalles de retos, puntos y servicios que utilizan el componente Modal compartido.

## Qué incluye esta entrega

- Frontend React 19 + TypeScript + Vite.
- Backend Java 25 + Spring Boot 4.1.2.
- MySQL Server local, administrado con Workbench.
- API REST para recuperar y guardar el estado completo que usa el frontend.
- Swagger/OpenAPI.
- Script SQL para preparar la base y el usuario.
- Inicio local por ventanas de Windows, sin Docker.

## Alcance y limitaciones de esta versión

El frontend conserva sus pantallas e interacciones. La persistencia se conecta mediante `GET /api/v1/demo/state` y `PUT /api/v1/demo/state`, que guardan el estado de demostración en una fila JSON de MySQL. Esto permite probar el flujo integrado, pero **no es todavía un sistema multiusuario de producción**: el inicio de sesión es simulado, no hay JWT ni cuentas independientes y todas las sesiones comparten el estado de demostración. La API está abierta para facilitar pruebas locales.

No publiques esta versión en Internet ni guardes datos personales reales. Para producción habría que implementar autenticación, permisos por usuario, endpoints y tablas por módulo, validaciones y pruebas.

## Solución de problemas

- **No conecta con MySQL:** comprueba que MySQL Server esté iniciado y escuche en el puerto `3306`; Workbench solo es el cliente.
- **Access denied para `ayni`:** vuelve a ejecutar `database/01_setup_ayni.sql` desde Workbench con un usuario administrador.
- **Java incorrecto:** esta entrega requiere JDK 25 y Maven 3.9+. Comprueba con `java -version` y `mvn -version`.
- **Node incorrecto:** requiere Node.js 22.12+. Comprueba con `node -v`.
- **El frontend no carga datos de MySQL:** revisa la ventana AYNI Backend y confirma que `http://localhost:8080/api/v1/health` responda antes de recargar la web.


## Modo Faro sin conexión

Esta versión incorpora una caché del frontend (Service Worker) y persistencia local para las acciones del Modo Faro.

### Preparación obligatoria mientras hay internet

1. Inicia AYNI normalmente al menos una vez con internet.
2. Abre `http://localhost:5173` y espera a que termine de cargar.
3. Recarga la página una vez. Esta segunda carga permite que el Service Worker controle la pestaña y guarde los módulos de Vite en caché.
4. Entra a **Modo Faro** y comprueba que aparece el indicador de conexión.

### Uso sin internet

- Mantén el servidor frontend de Vite abierto en tu PC (`start.bat` puede iniciarlo aunque MySQL o el backend no estén disponibles).
- Abre AYNI en la misma dirección `http://localhost:5173`.
- El Modo Faro y sus acciones registran cambios en el almacenamiento local del navegador.
- Los avisos y cambios permanecen guardados al recargar o cerrar el navegador, siempre que no se borren los datos del sitio.
- Al recuperar conexión, AYNI vuelve a intentar guardar el estado local en la API.

### Límites importantes

- El aviso offline queda guardado en el dispositivo; **no se transmite a los vecinos hasta que exista conexión y el backend vuelva a estar disponible**.
- AYNI no llama automáticamente a Policía, Bomberos, SAMU ni INDECI. Ante una emergencia real, llama directamente a los números oficiales.
- La caché necesita una primera carga con internet. Si nunca se abrió AYNI online en ese navegador, no existe una copia local que pueda abrirse offline.
- No borres los datos del sitio ni el almacenamiento del navegador si necesitas conservar avisos pendientes.
- Para que otros dispositivos reciban el aviso, el backend debe estar operativo y completar la sincronización.
