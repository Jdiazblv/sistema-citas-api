// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelo de usuario
const ModelUser = require("../modes");


// CRUD

// CREATE -> POST
// Crear usuario
router.post("/users", async (req, res) => {

    try {
        const nuevoUsuario = new ModelUser(req.body);
        const respuesta = await nuevoUsuario.save();

        res.send(respuesta);

    } catch (error) {

        res.status(500).send(error);

    }

});

// Registro de usuario
router.post("/users/register", async (req, res) => {
    try {
        const {nomUser, passUser} = req.body;

        // Crear usuario
        const nuevoUsuario = new ModelUser({
            nomUser,
            passUser
        });

        const usuarioGuardado = await nuevoUsuario.save();

        res.send({
            mensaje: "Usuario registrado correctamente",
            usuario: usuarioGuardado
        });

    } catch (error) {
        res.status(500).send({
            mensajes: "Error al registrar usuario"
        });
    }
});

// Login de usuario
router.post("/users/login", async (req, res) => {
    try{
        const {nomUser, passUser} = req.body;

        // Buscar usuario
        const usuario = await ModelUser.findOne({
            nomUser: nomUser,
            passUser: passUser
        });

        // Confirmar si existe
        if (usuario) {
            res.send ({
                mensaje: "Autenticacion satisfactoria"
            });

        } else {
            res.status(401).send({
                mensaje: "Error en la autentificacion"
            });
        }

    } catch (error) {
        res.status(500).send({
            mensaje: "Error en el servidor"
        });
    }
});

// READ -> GET
// Obtener usuarios
router.get("/users", async (req, res) => {

    try {
        const usuarios = await ModelUser.find();
        res.send(usuarios);

    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtener usuario por ID
router.get("/users/:id", async (req, res) => {
    try {
        const usuario = await ModelUser.findById(req.params.id);
        res.send(usuario);

    } catch (error) {
        res.status(500).send(error);
    }
});

// UPDATE -> PUT
// Actualizar usuario
router.put("/users/:id", async (req, res) => {
    try {
        const usuarioActualizado = await ModelUser.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.send(usuarioActualizado);

    } catch (error) {
        res.status(500).send(error);
    }
});

// DELETE -> DELETE
// Eliminar usuario
router.delete("/users/:id", async (req, res) => {
    try {
        const usuarioEliminado = await ModelUser.findByIdAndDelete(req.params.id);
        res.send(usuarioEliminado);

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

/* 

- async: funcion que recibe: req, res

- req (request/peticion): contiene lo que el cliente envia: 
    req.body
    req.params
    req.query

- res (responsive/respuesta): para responder al cliente
    res.send("hola")

- const respuesta = await nuevoUsuario.save();: Guardar en la base de datos

- await: esperar a que termine

- try y catch: manejar errores (500)
- send(): enviar datos
- status(): enviar código HTTP

200 ->      OK
401 ->      No autorizado
404 ->      No encontrado
500 ->      Error servidor

*/