@echo off
setlocal EnableExtensions
set "CONFIG_FILE=restaurant-config.json"

if not exist "%CONFIG_FILE%" (
    echo Error: %CONFIG_FILE% not found.
    pause
    exit /b 1
)

echo Select Layout:
echo 1. grid
echo 2. sidebar
choice /c 12 /n /m "Enter choice (1-2): "
if errorlevel 2 (set "LAYOUT=sidebar") else (set "LAYOUT=grid")

echo.
echo Select Theme Color:
echo 1. yellow
echo 2. red
echo 3. green
echo 4. blue
echo 5. purple
choice /c 12345 /n /m "Enter choice (1-5): "
if errorlevel 5 (set "COLOR=purple") else (
if errorlevel 4 (set "COLOR=blue") else (
if errorlevel 3 (set "COLOR=green") else (
if errorlevel 2 (set "COLOR=red") else (
set "COLOR=yellow"
))))

powershell -NoProfile -Command "$f='%CONFIG_FILE%'; (Get-Content $f) -replace '(\"themeColor\":\s*\")[a-zA-Z]+', ('$1%COLOR%') -replace '(\"layout\":\s*\")[a-zA-Z]+', ('$1%LAYOUT%') | Set-Content $f -Encoding UTF8"

echo.
echo Configuration updated successfully!
pause