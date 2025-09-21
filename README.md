# Mini-Backend
Practica con NODE y TS.

INICIALIZAR PROYECTO :
(bash)
npm init -y
npm install express typeorm reflect-metadata sqlite3
npm install typescript ts-node-dev @types/express -D


CONFIGURAR TS:
(bash)
npx tsc --init


PROBAR :
(bash)
npm run dev

CREAR ADMIN:
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Body '{"name":"adminX","role":"admin"}' -ContentType "application/json"

CREAR USER:
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Body '{"name":"Ramiro","role":"user"}' -ContentType "application/json"

CREAR TAREA :
(solo puede el admin)
(bash)
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method POST -Body '{"title":"Subir trabajo","userId":1}' -ContentType "application/json"


LISTAR TAREAS:
(bash)
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method GET

USUARIO MARCA COMO COMPLETA:
Invoke-RestMethod -Uri "http://localhost:3000/tasks/1/complete" -Method PUT






