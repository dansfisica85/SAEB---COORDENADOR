@echo off
echo ========================================
echo  INICIANDO SISTEMA SAEB 2025
echo ========================================
echo.
echo Aguarde enquanto o servidor inicia...
echo.
echo O navegador abrira automaticamente em alguns segundos.
echo.
echo Credenciais de acesso:
echo   Usuario: COORDENADOR
echo   Senha: SAEB2025FGV
echo.
echo Para parar o servidor, pressione Ctrl+C
echo ========================================
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

npm run dev
