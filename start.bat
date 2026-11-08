@echo off
setlocal
cd /d "%~dp0"

echo ================================================
echo              AYNI - Inicio local
echo       Frontend disponible tambien sin backend
echo ================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js. Instala Node.js 22.12 o superior.
  pause
  exit /b 1
)
node -e "const [a,b]=process.versions.node.split('.').map(Number); process.exit(a>22||(a===22&&b>=12)?0:1)"
if errorlevel 1 (
  echo [ERROR] Se requiere Node.js 22.12 o superior. Version detectada:
  node -v
  pause
  exit /b 1
)

set "BACKEND_OK=0"
powershell -NoProfile -Command "$c=New-Object System.Net.Sockets.TcpClient; try {$c.Connect('127.0.0.1',3306); exit 0} catch {exit 1} finally {$c.Dispose()}" >nul 2>nul
if errorlevel 1 goto OFFLINE_MODE

where java >nul 2>nul
if errorlevel 1 goto BACKEND_UNAVAILABLE
where mvn >nul 2>nul
if errorlevel 1 goto BACKEND_UNAVAILABLE

for /f "tokens=3" %%v in ('java -version 2^>^&1 ^| findstr /i "version"') do set "JAVA_VERSION=%%~v"
for /f "tokens=1 delims=." %%a in ("%JAVA_VERSION%") do set "JAVA_MAJOR=%%a"
if not "%JAVA_MAJOR%"=="25" goto BACKEND_UNAVAILABLE

echo [INFO] Iniciando backend Spring Boot...
start "AYNI Backend" /D "%~dp0backend" cmd /k "mvn spring-boot:run"
echo Esperando al backend...
powershell -NoProfile -Command "$ok=$false; for($i=0;$i-lt 45;$i++){try{$r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:8080/api/v1/health' -TimeoutSec 2; if($r.StatusCode -eq 200){$ok=$true;break}}catch{}; Start-Sleep -Seconds 2}; if($ok){exit 0}else{exit 1}"
if errorlevel 1 goto BACKEND_DOWN
set "BACKEND_OK=1"
echo [OK] Backend disponible.
goto START_FRONTEND

:OFFLINE_MODE
echo [AVISO] MySQL no esta disponible. AYNI abrira en modo local/offline.
echo Los cambios quedaran guardados en este navegador y pendientes de sincronizacion.
goto START_FRONTEND

:BACKEND_UNAVAILABLE
echo [AVISO] Java 25 o Maven no estan disponibles. Se omitira el backend.
echo AYNI abrira con almacenamiento local.
goto START_FRONTEND

:BACKEND_DOWN
echo [AVISO] El backend no respondio. AYNI continuara con almacenamiento local.
goto START_FRONTEND

:START_FRONTEND
echo.
echo Iniciando frontend React...
start "AYNI Frontend" /D "%~dp0frontend" cmd /k "call iniciar-frontend.bat"

echo Esperando a que Vite este disponible...
powershell -NoProfile -Command "$ok=$false; for($i=0;$i-lt 45;$i++){try{$r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173' -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){$ok=$true;break}}catch{}; Start-Sleep -Seconds 1}; if($ok){Start-Process 'http://localhost:5173'; exit 0}else{exit 1}"
if errorlevel 1 echo [AVISO] Vite aun no responde. Revisa la ventana AYNI Frontend.

echo.
echo AYNI esta iniciando.
echo Frontend: http://localhost:5173
if "%BACKEND_OK%"=="1" (
  echo Backend:  http://localhost:8080/api/v1/health
) else (
  echo Backend:  no disponible - modo local/offline
)
echo.
echo Mantén abierta la ventana AYNI Frontend.
if "%BACKEND_OK%"=="1" echo Mantén abierta tambien la ventana AYNI Backend.
pause
