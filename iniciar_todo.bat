@echo off
echo ==========================================
echo    INICIANDO SISTEMA DE INVENTARIO
echo ==========================================
echo.

:: 1. Iniciar Backend (Django)
echo [1/3] Iniciando Servidor Backend (Puerto 8000)...
start "Backend Inventario (Django)" cmd /k "python manage.py runserver 0.0.0.0:8000"

:: Esperar 5 segundos para dar tiempo al backend
timeout /t 5 /nobreak >nul

:: 2. Iniciar Frontend (Vite)
echo [2/3] Iniciando Servidor Frontend (Puerto 5173)...
cd frontend
start "Frontend Inventario (Vite)" cmd /k "npm run dev"

:: Volver al directorio raíz
cd ..

:: Esperar 3 segundos para que el frontend esté listo
timeout /t 3 /nobreak >nul

:: 3. Abrir Navegador
echo [3/3] Abriendo aplicacion en el navegador...
start http://localhost:5173

echo.
echo ==========================================
echo    SISTEMA INICIADO EXITOSAMENTE
echo ==========================================
echo.
echo NOTA: No cierres las ventanas de comandos (pantallas negras).
echo Para detener el sistema, simplemente cierralas.
echo.
pause
