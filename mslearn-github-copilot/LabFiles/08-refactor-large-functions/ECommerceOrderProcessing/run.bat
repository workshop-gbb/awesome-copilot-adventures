@echo off
setlocal
pushd "%~dp0"
echo Building and running E-Commerce Order Processing System...
echo.

dotnet build src\ECommerce.Console\ECommerce.Console.csproj -m:1 -p:UseSharedCompilation=false
if %ERRORLEVEL% neq 0 (
    echo Build failed! Please check for errors.
    popd
    exit /b 1
)

echo.
echo Build successful! Running application...
echo.

dotnet run --no-build --project src\ECommerce.Console\ECommerce.Console.csproj
set "result=%ERRORLEVEL%"
if "%result%"=="0" echo Application completed. Check order_audit_log.txt for detailed logs.
popd
exit /b %result%
