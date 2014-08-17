@echo off
taskkill /F /IM nginx.exe 1>NUL 2>&1
taskkill /F /IM php-cgi.exe 1>NUL 2>&1
echo Done