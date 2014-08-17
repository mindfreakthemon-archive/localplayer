@echo off
taskkill /F /IM nginx.exe 1>NUL 2>&1
taskkill /F /IM php-cgi.exe 1>NUL 2>&1
for /F "tokens=*" %%a in ('cd') do @set csa=%%a
echo root %csa:~0,-4%; > root.conf
rhc php/php-cgi.exe -b 127.0.0.1:9000
rhc nginx/nginx -p nginx/