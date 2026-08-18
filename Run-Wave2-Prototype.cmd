@echo off
REM Double-click this to run the Wave 2 scoring prototype and see the 15-case table.
REM It uses the portable Node in AppData (Node is not on this machine's PATH).
pushd "%~dp0"
set NODE_EXE=%LOCALAPPDATA%\nodejs-portable\node-v22.12.0-win-x64\node.exe
if not exist "%NODE_EXE%" (
  echo Could not find Node at:
  echo   %NODE_EXE%
  echo Edit NODE_EXE in this file to point at your node.exe.
  echo.
  pause
  popd
  exit /b 1
)
"%NODE_EXE%" "Session-Sketch-wave2-prototype.js"
echo.
echo ---- done. Close this window when finished. ----
pause
popd
