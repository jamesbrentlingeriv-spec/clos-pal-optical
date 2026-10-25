@echo off
title C.L.O.S. - Pal Optical
cd /d "%~dp0"
echo Starting C.L.O.S. (Contact Lens Ordering System)...
start http://localhost:5174/
npm run dev
pause
