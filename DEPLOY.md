# Despliegue en Railway

Este proyecto está desplegado en Railway con tres recursos dentro del proyecto `ayni-fullstack`:

| Recurso | URL |
|---|---|
| Frontend (React + nginx) | https://frontend-production-f6b0.up.railway.app |
| Backend (Spring Boot) | https://backend-production-1033.up.railway.app |
| API REST | https://backend-production-1033.up.railway.app/api/v1 |
| Swagger | https://backend-production-1033.up.railway.app/swagger-ui.html |
| Health check | https://backend-production-1033.up.railway.app/api/v1/health |
| Base de datos | MySQL (servicio `MySQL` de Railway, red privada) |

## Arquitectura

```
Navegador
   │
   ▼
frontend (nginx :8080)
   ├── /            → build estático de Vite
   └── /api/*       → proxy a http://backend.railway.internal:8080
                            │
                            ▼
                    backend (Spring Boot :8080)
                            │
                            ▼
                    MySQL (mysql.railway.internal:3306)
```

El frontend llama a `/api/v1` en el mismo origen gracias al proxy de nginx. Por eso no hay problemas de CORS en producción.

## Variables de entorno

### Servicio `backend`

| Variable | Valor |
|---|---|
| `DB_URL` | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Lima` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

### Servicio `frontend`

| Variable | Valor |
|---|---|
| `BACKEND_URL` | `http://backend.railway.internal:8080` |

El build del frontend usa `VITE_API_URL=/api/v1` (definido en `frontend/Dockerfile`).

## Redespliegue manual

Desde la raíz del repositorio:

```powershell
railway up ./backend  --path-as-root --service backend  --ci
railway up ./frontend --path-as-root --service frontend --ci
```

## Notas importantes

- `spring.jpa.hibernate.ddl-auto=update` crea la tabla `ayni_demo_state` automáticamente en el primer arranque.
- El plan gratuito de Railway puede suspender los servicios por inactividad; la primera petición puede tardar unos segundos.
- Esta versión sigue siendo una **demo**: el login es simulado, no hay JWT ni cuentas por usuario y la API está abierta. No guardes datos personales reales.
