@echo off
setlocal
cd /d "%~dp0"

echo ================================================
echo          AYNI - Inicio del frontend
echo ================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js en el PATH.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro npm en el PATH.
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo [INFO] Instalando dependencias del frontend...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install fallo. Revisa el mensaje anterior y tu conexion a Internet.
    pause
    exit /b 1
  )
)

set "VITE_API_URL=http://localhost:8080/api/v1"
echo [INFO] Iniciando Vite en http://localhost:5173 ...
call npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
if errorlevel 1 (
  echo.
  echo [ERROR] No se pudo iniciar el frontend.
  echo Comprueba si el puerto 5173 esta ocupado o si hubo un error de dependencias.
  pause
  exit /b 1
)
