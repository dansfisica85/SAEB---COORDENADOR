@echo off
echo ========================================
echo  SISTEMA DE PESQUISA SAEB 2025
echo  Script de Instalacao Automatica
echo ========================================
echo.

echo [1/5] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo OK - Dependencias instaladas
echo.

echo [2/5] Criando estrutura de pastas...
if not exist "data" mkdir data
if not exist "data\documents" mkdir data\documents
if not exist "data\processed" mkdir data\processed
echo OK - Pastas criadas
echo.

echo [3/5] Verificando documentos...
set /a count=0
if exist "SAEB2025_Apresentação_2_Ano_VF.pptx" (
    copy "SAEB2025_Apresentação_2_Ano_VF.pptx" "data\documents\" >nul 2>&1
    set /a count+=1
)
if exist "SAEB2025_Apresentação_Aplicadores_5_9_3_VF.pptx" (
    copy "SAEB2025_Apresentação_Aplicadores_5_9_3_VF.pptx" "data\documents\" >nul 2>&1
    set /a count+=1
)
if exist "SCAN0000.PDF" (
    copy "SCAN0000.PDF" "data\documents\" >nul 2>&1
    set /a count+=1
)
if exist "SCAN0001.PDF" (
    copy "SCAN0001.PDF" "data\documents\" >nul 2>&1
    set /a count+=1
)
echo OK - %count% documentos copiados
echo.

echo [4/5] Verificando arquivo .env.local...
if not exist ".env.local" (
    echo AVISO: Arquivo .env.local nao encontrado!
    echo Por favor, crie o arquivo .env.local e adicione sua chave API do Gemini.
    echo.
    echo Exemplo:
    echo NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
    echo AUTH_USERNAME=COORDENADOR
    echo AUTH_PASSWORD=SAEB2025FGV
    echo.
    pause
)
echo.

echo [5/5] Processando documentos (isso pode levar alguns minutos)...
call npm run process-docs
if errorlevel 1 (
    echo AVISO: Erro ao processar documentos
    echo Verifique se os arquivos estao em data\documents\
) else (
    echo OK - Documentos processados com sucesso
)
echo.

echo ========================================
echo  INSTALACAO CONCLUIDA!
echo ========================================
echo.
echo Para iniciar o sistema, execute:
echo   npm run dev
echo.
echo Depois acesse: http://localhost:3000
echo.
echo Credenciais:
echo   Usuario: COORDENADOR
echo   Senha: SAEB2025FGV
echo.
pause
