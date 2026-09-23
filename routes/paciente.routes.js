// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelos
const ModelPaciente = require('../models/paciente.model');
const ModelUser = require('../models/user.model');

// Agregar bcrypt para encriptar la contraseña
const bcrypt = require('bcrypt');

// Importar middlewares de autenticación y roles
const verificarToken = require("../middleware/auth.middleware");
const verificarRol = require("../middleware/role.middleware");


// ==============================
// CREATE -> POST
// ==============================

// Crear paciente
router.post('/pacientes', 
    verificarToken, 
    verificarRol("Administrador", "Recepcionista"),
    async (req, res) => {

    try {

        // Datos generales del usuario
        const {
            nombres,
            apellidos,
            tipoDocumento,
            documento,
            correo,
            telefono,
            fechaNacimiento,
            password,

            // Datos exclusivos del paciente
            sexo,
            eps,
            direccion
        } = req.body;

        // Encriptar la contraseña
        const passwordEncriptada = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = new ModelUser({

            nombres,
            apellidos,
            tipoDocumento,
            documento,
            correo,
            telefono,
            fechaNacimiento,

            // El rol se establece automáticamente
            rol: "Paciente",

            password: passwordEncriptada
        });


        // Guardar usuario en MongoDB
        const usuarioGuardado = await nuevoUsuario.save();

        // Crear una copia del usuario sin la contraseña
        const usuarioRespuesta = usuarioGuardado.toObject();
        delete usuarioRespuesta.password;

        // Crear perfil del paciente
        const nuevoPaciente = new ModelPaciente({

            usuarioId: usuarioGuardado._id,

            sexo,
            eps,
            direccion

        });


        // Guardar paciente en MongoDB
        const pacienteGuardado = await nuevoPaciente.save();


        // Responder al frontend
        res.status(201).send({

            mensaje: "Paciente registrado correctamente",

            usuario: usuarioRespuesta,

            paciente: pacienteGuardado

        });

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al registrar paciente",

            error: error.message

        });

    }

});


// ==============================
// READ -> GET
// ==============================

// Obtener todos los pacientes
router.get('/pacientes',
    verificarToken,
    verificarRol("Administrador", "Recepcionista"),
        async (req, res) => {

    try {

        const pacientes = await ModelPaciente
            .find()
            .populate('usuarioId');

        res.send(pacientes);

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al obtener pacientes",

            error: error.message

        });

    }

});


// Obtener paciente por ID
router.get(
    '/pacientes/:id',
    verificarToken,
    async (req, res) => {

    try {

        const paciente = await ModelPaciente
            .findById(req.params.id)
            .populate('usuarioId');


        if (!paciente) {

            return res.status(404).send({

                mensaje: "Paciente no encontrado"

            });

        }


        // Administrador y Recepcionista pueden consultar cualquier paciente
        if (
            req.usuario.rol !== "Administrador" &&
            req.usuario.rol !== "Recepcionista"
        ) {

            // Si es paciente, solamente puede consultar su propio perfil
            if (
                req.usuario.rol === "Paciente" &&
                paciente.usuarioId._id.toString() !== req.usuario.id
            ) {

                return res.status(403).send({
                    mensaje: "No tienes permiso para consultar este paciente"
                });

            }

            // Otros roles no tienen permiso
            if (req.usuario.rol !== "Paciente") {

                return res.status(403).send({
                    mensaje: "No tienes permiso para consultar este paciente"
                });

            }

        }


        res.send(paciente);

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al obtener paciente",

            error: error.message

        });

    }

});


// ==============================
// UPDATE -> PUT
// ==============================

// Actualizar paciente
router.put(
    '/pacientes/:id',
    verificarToken,
    verificarRol("Administrador", "Recepcionista"),
    async (req, res) => {

    try {

        const {
            nombres,
            apellidos,
            tipoDocumento,
            documento,
            correo,
            telefono,
            fechaNacimiento,
            sexo,
            eps,
            direccion
        } = req.body;


        // Buscar paciente
        const paciente = await ModelPaciente.findById(req.params.id);


        if (!paciente) {

            return res.status(404).send({

                mensaje: "Paciente no encontrado"

            });

        }


        // Actualizar datos exclusivos del paciente
        paciente.sexo = sexo;
        paciente.eps = eps;
        paciente.direccion = direccion;

        await paciente.save();


        // Actualizar datos generales del usuario
        const usuarioActualizado = await ModelUser.findByIdAndUpdate(

            paciente.usuarioId,

            {
                nombres,
                apellidos,
                tipoDocumento,
                documento,
                correo,
                telefono,
                fechaNacimiento
            },

            {
                new: true,
                runValidators: true
            }

        );


        res.send({

            mensaje: "Paciente actualizado correctamente",

            usuario: usuarioActualizado,

            paciente

        });

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al actualizar paciente",

            error: error.message

        });

    }

});


// ==============================
// DELETE -> DELETE
// ==============================

// Eliminar paciente
router.delete(
    '/pacientes/:id',
    verificarToken,
    verificarRol("Administrador", "Recepcionista"),
    async (req, res) => {

    try {

        // Buscar paciente
        const paciente = await ModelPaciente.findById(req.params.id);


        if (!paciente) {

            return res.status(404).send({

                mensaje: "Paciente no encontrado"

            });

        }


        // Eliminar perfil del paciente
        await ModelPaciente.findByIdAndDelete(req.params.id);


        // Eliminar usuario relacionado
        await ModelUser.findByIdAndDelete(paciente.usuarioId);


        res.send({

            mensaje: "Paciente eliminado correctamente"

        });

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al eliminar paciente",

            error: error.message

        });

    }

});


// Exportar la ruta
module.exports = router;