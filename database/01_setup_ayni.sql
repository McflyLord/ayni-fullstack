-- Ejecuta este script en MySQL Workbench usando una conexión con permisos de administrador (por ejemplo, root).
-- Crea la base de datos y un usuario local exclusivo para la aplicación AYNI.

CREATE DATABASE IF NOT EXISTS ayni_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'ayni'@'localhost' IDENTIFIED BY 'ayni_local_2026';
CREATE USER IF NOT EXISTS 'ayni'@'127.0.0.1' IDENTIFIED BY 'ayni_local_2026';

ALTER USER 'ayni'@'localhost' IDENTIFIED BY 'ayni_local_2026';
ALTER USER 'ayni'@'127.0.0.1' IDENTIFIED BY 'ayni_local_2026';

GRANT ALL PRIVILEGES ON ayni_db.* TO 'ayni'@'localhost';
GRANT ALL PRIVILEGES ON ayni_db.* TO 'ayni'@'127.0.0.1';

FLUSH PRIVILEGES;

-- La tabla ayni_demo_state será creada automáticamente por Spring Boot al iniciar.
