@echo off
title Belihuloya XVI Scoreboard Server
cd /d "%~dp0"
echo.
echo  BELIHULOYA XVI - Scoreboard server
echo  Control panel : http://127.0.0.1:4173/control.html
echo  OBS overlay   : http://127.0.0.1:4173/overlay.html
echo  Keep this window open during the match. Close it to stop.
echo.
if not exist node_modules (
  echo Installing packages for the first time...
  call npm install || goto :fail
)
call npm run event
goto :eof
:fail
echo Something went wrong. See the messages above.
pause
