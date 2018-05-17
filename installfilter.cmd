@echo off
if exist "%ProgramFiles%\Git\Bin\bash.exe" (
    "%ProgramFiles%\Git\Bin\bash.exe" "%~dp0installfilter.sh"
) else if exist "%ProgramFiles(x86)%\Git\Bin\bash.exe" (
    "%ProgramFiles(x86)%\Git\Bin\bash.exe" "%~dp0installfilter.sh"
) else (
    echo "Git bash not found!"
)