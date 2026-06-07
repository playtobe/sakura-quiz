@echo off
cd /d "C:\Users\Admin\.gemini\antigravity\scratch\japanese-quiz-app"
start "" /min powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "server.ps1"
exit
