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

CREAR TAREA :
(bash)
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method POST -Body '{"title":"Hacer la cama"}' -ContentType "application/json"

LISTAR TAREAS:
(bash)
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method GET




