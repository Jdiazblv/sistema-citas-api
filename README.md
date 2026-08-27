# API Sistema de Citas - Registro y Login

API desarrollada con Node.js y Express para registro e inicio de sesión de usuarios.

## Tecnologías
- Node.js
- Express
- MongoDB
- Mongoose

## Instalación

1. Clonar repositorio
2. Instalar dependencias:

npm install

3. Ejecutar servidor:

node app.js

## Endpoints

### Registro
POST /users/register

Body:
{
  "nomUser": "usuario",
  "passUser": "1234"
}

### Login
POST /users/login

Body:
{
  "nomUser": "usuario",
  "passUser": "1234"
}

### Obtener usuarios
GET /users

### Obtener usuario por ID
GET /users/:id

### Actualizar usuario
PUT /users/:id

### Eliminar usuario
DELETE /users/:id
