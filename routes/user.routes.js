// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');
// Crear router
const router = express.Router();


// Importar modelos

    // Importar modelo de usuario
    const ModelUser = require("../models/user.model");
    // Importar middleware de autenticación
    const verificarToken = require("../middleware/auth.middleware");
    // Importar middleware de roles
    const verificarRol = require("../middleware/role.middleware");


// Agregar bcrypt y jwt

    // Agregar bcrypt para encriptar la contraseña
    const bcrypt = require('bcrypt');
    // Agregar jsonwebtoken para generar tokens
    const jwt = require('jsonwebtoken');


// Clave secreta para JWT
const JWT_SECRET = "clave_secreta_sistema_citas";


// ==============================
// CREATE -> POST
// ==============================

// Crear usuario
router.post("/users", async (req, res) => {

    try {

        // Encriptar la contraseña
        const passwordEncriptada = await bcrypt.hash(req.body.password, 10);

        // Crear usuario con la contraseña encriptada
        const nuevoUsuario = new ModelUser({
            ...req.body,
            password: passwordEncriptada
        });

        // Guardar usuario
        const respuesta = await nuevoUsuario.save();

        res.status(201).send(respuesta);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al crear usuario",
            error: error.message
        });

    }

});

// ==============================
// LOGIN -> POST
// ==============================

// Iniciar sesión
router.post("/login", async (req, res) => {

    try {

        // Obtener documento y contraseña enviados
        const { documento, password } = req.body;

        // Buscar usuario por documento
        const usuario = await ModelUser.findOne({ documento }).select('+password');

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).send({
                mensaje: "Documento o contraseña incorrectos"
            });
        }

        // Comparar contraseña ingresada con la contraseña encriptada
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        // Verificar si la contraseña es correcta
        if (!passwordCorrecta) {
            return res.status(401).send({
                mensaje: "Documento o contraseña incorrectos"
            });
        }

        // Crear token JWT
        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol
            },
            JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        // Login correcto
        res.send({
            mensaje: "Inicio de sesión correcto",
            token: token,
            usuario: {
                _id: usuario._id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                documento: usuario.documento,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });                         

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al iniciar sesión",
            error: error.message
        });

    }

});


// ==============================
// READ -> GET
// ==============================

// Obtener todos los usuarios
router.get("/users", verificarToken, verificarRol("Administrador"), async (req, res) => {

    try {

        const usuarios = await ModelUser.find();

        res.send(usuarios);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al obtener usuarios",
            error: error.message
        });

    }

});


// Obtener usuario por ID
router.get("/users/:id", async (req, res) => {

    try {

        const usuario = await ModelUser.findById(req.params.id);

        if (!usuario) {
            return res.status(404).send({
                mensaje: "Usuario no encontrado"
            });
        }

        res.send(usuario);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al obtener usuario",
            error: error.message
        });

    }

});


// ==============================
// UPDATE -> PUT
// ==============================

// Actualizar usuario
router.put("/users/:id", async (req, res) => {

    try {

        const usuarioActualizado = await ModelUser.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!usuarioActualizado) {
            return res.status(404).send({
                mensaje: "Usuario no encontrado"
            });
        }

        res.send(usuarioActualizado);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al actualizar usuario",
            error: error.message
        });

    }

});


// ==============================
// DELETE -> DELETE
// ==============================

// Eliminar usuario
router.delete("/users/:id", async (req, res) => {

    try {

        const usuarioEliminado = await ModelUser.findByIdAndDelete(
            req.params.id
        );

        if (!usuarioEliminado) {
            return res.status(404).send({
                mensaje: "Usuario no encontrado"
            });
        }

        res.send({
            mensaje: "Usuario eliminado correctamente",
            usuario: usuarioEliminado
        });

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al eliminar usuario",
            error: error.message
        });

    }

});

// Exportar la ruta
module.exports = router;