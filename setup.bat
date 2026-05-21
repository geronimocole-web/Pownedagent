@echo off
setlocal EnableDelayedExpansion
title PowNed Agent — Setup

echo.
echo  ██████╗  ██████╗ ██╗    ██╗███╗   ██╗███████╗██████╗
echo  ██╔══██╗██╔═══██╗██║    ██║████╗  ██║██╔════╝██╔══██╗
echo  ██████╔╝██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ██║  ██║
echo  ██╔═══╝ ██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ██║  ██║
echo  ██║     ╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗██████╔╝
echo  ╚═╝      ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═════╝
echo.
echo  Redactie Agent — Setup
echo  ════════════════════════════════════════
echo.

REM ── Controleer Node.js ──────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo [FOUT] Node.js niet gevonden. Installeer via https://nodejs.org
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo [OK] Node.js %%v

REM ── Controleer / installeer pnpm ────────────────────────
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] pnpm niet gevonden, installeren via npm...
    npm install -g pnpm
    if errorlevel 1 (
        echo [FOUT] pnpm installeren mislukt
        pause & exit /b 1
    )
)
for /f "tokens=*" %%v in ('pnpm --version') do echo [OK] pnpm %%v

REM ── Controleer / installeer Claude Code ─────────────────
claude --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Claude Code niet gevonden, installeren...
    npm install -g @anthropic-ai/claude-code
    if errorlevel 1 (
        echo [FOUT] Claude Code installeren mislukt
        pause & exit /b 1
    )
)
for /f "tokens=*" %%v in ('claude --version') do echo [OK] Claude Code %%v

REM ── Git initialiseren ────────────────────────────────────
if not exist ".git" (
    git init -b main
    git add -A
    git commit -m "feat: initiële PowNed Redactie Agent codebase"
    echo [OK] Git repository aangemaakt
) else (
    echo [OK] Git al geïnitialiseerd
)

REM ── .env aanmaken ────────────────────────────────────────
if not exist ".env" (
    copy .env.example .env
    echo [OK] .env aangemaakt vanuit .env.example
    echo.
    echo  ┌─────────────────────────────────────────────────────┐
    echo  │  BELANGRIJK: Vul je API keys in in het .env bestand  │
    echo  │  voordat je de app start!                            │
    echo  │                                                      │
    echo  │  - ANTHROPIC_API_KEY  (van console.anthropic.com)   │
    echo  │  - SUPABASE_URL       (van supabase.com project)    │
    echo  │  - SUPABASE_ANON_KEY  (van supabase.com project)    │
    echo  │  - CRON_SECRET        (verzin een sterk wachtwoord) │
    echo  └─────────────────────────────────────────────────────┘
    echo.
) else (
    echo [OK] .env bestaat al
)

REM ── Dependencies installeren ─────────────────────────────
echo.
echo [INFO] Dependencies installeren (dit duurt ~1 minuut)...
pnpm install
if errorlevel 1 (
    echo [FOUT] pnpm install mislukt
    pause & exit /b 1
)
echo [OK] Dependencies geïnstalleerd

REM ── Klaar ────────────────────────────────────────────────
echo.
echo  ════════════════════════════════════════
echo  Setup klaar! Volgende stappen:
echo.
echo  1. Vul je keys in: notepad .env
echo  2. Maak je Supabase database aan (zie README.md)
echo  3. Start Claude Code in dit project: claude
echo  ════════════════════════════════════════
echo.

set /p OPEN="Claude Code nu starten? (j/n): "
if /i "!OPEN!"=="j" (
    claude
)

pause
