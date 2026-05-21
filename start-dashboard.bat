@echo off
title PowNed Dashboard
echo.
echo  Starten PowNed Redactie Dashboard...
echo  Open straks: http://localhost:3000
echo  Geen login vereist - direct toegankelijk
echo.

cd /d "%~dp0packages\dashboard"

set NEXT_BIN=..\..\node_modules\.pnpm\next@14.2.3_@babel+core@7.2_199cf0276dc96f6a8a24abb0fd3b0139\node_modules\next\dist\bin\next

if not exist "%NEXT_BIN%" (
    echo [INFO] Dependencies installeren...
    cd /d "%~dp0"
    npx pnpm@11 install --ignore-scripts
    cd /d "%~dp0packages\dashboard"
)

node %NEXT_BIN% dev
