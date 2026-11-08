# AYNI API

Requiere JDK 25, Maven 3.9+ y MySQL Server local activo. Prepara `ayni_db` y el usuario `ayni` ejecutando `../database/01_setup_ayni.sql` desde MySQL Workbench.

Desde esta carpeta ejecuta `mvn spring-boot:run`.

- Health: http://localhost:8080/api/v1/health
- Swagger: http://localhost:8080/swagger-ui.html
- Estado demo: http://localhost:8080/api/v1/demo/state

La API es solo para demostración local; no tiene autenticación JWT ni aislamiento multiusuario.
