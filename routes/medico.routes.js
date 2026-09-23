// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelos
const ModelMedico = require('../models/medico.model');
const ModelUser = require('../models/user.model');

// Importar middlewares de autenticación y roles
const verificarToken = require("../middleware/auth.middleware");
const verificarRol = require("../middleware/role.middleware");

// Agregar bcrypt para encriptar la contraseña
const bcrypt = require('bcrypt');


// ==============================
// CREATE -> POST
// ==============================

// Crear médico
router.post(
    '/medicos',
    verificarToken,
    verificarRol("Administrador"),
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

            // Datos exclusivos del médico
            especialidades,
            registroProfesional
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
            rol: "Medico",

            password: passwordEncriptada

        });


        // Guardar usuario
        const usuarioGuardado = await nuevoUsuario.save();


        // Crear perfil del médico
        const nuevoMedico = new ModelMedico({

            usuarioId: usuarioGuardado._id,

            especialidades,
            registroProfesional

        });


        // Guardar médico
        const medicoGuardado = await nuevoMedico.save();


        // Responder al frontend
        res.status(201).send({

            mensaje: "Médico registrado correctamente",

            usuario: usuarioGuardado,

            medico: medicoGuardado

        });

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al registrar médico",

            error: error.message

        });

    }

});


// ==============================
// READ -> GET
// ==============================

// Obtener todos los médicos
router.get(
    '/medicos',
    verificarToken,
    verificarRol("Administrador", "Recepcionista"),
    async (req, res) => {
    try {

        const medicos = await ModelMedico
            .find()
            .populate('usuarioId');

        res.send(medicos);

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al obtener médicos",

            error: error.message

        });

    }

});


// Obtener médico por ID
router.get(
    '/medicos/:id',
    verificarToken,
    async (req, res) => {

    try {

        const medico = await ModelMedico
            .findById(req.params.id)
            .populate('usuarioId');


        if (!medico) {

            return res.status(404).send({

                mensaje: "Médico no encontrado"

            });

        }


        res.send(medico);

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al obtener médico",

            error: error.message

        });

    }

});


// ==============================
// UPDATE -> PUT
// ==============================

// Actualizar médico
router.put(
    '/medicos/:id',
    verificarToken,
    verificarRol("Administrador"),
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
            especialidades,
            registroProfesional
        } = req.body;


        // Buscar médico
        const medico = await ModelMedico.findById(req.params.id);


        if (!medico) {

            return res.status(404).send({

                mensaje: "Médico no encontrado"

            });

        }


        // Actualizar datos exclusivos del médico
        medico.especialidades = especialidades;
        medico.registroProfesional = registroProfesional;

        await medico.save();


        // Actualizar datos generales del usuario
        const usuarioActualizado = await ModelUser.findByIdAndUpdate(

            medico.usuarioId,

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

            mensaje: "Médico actualizado correctamente",

            usuario: usuarioActualizado,

            medico

        });

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al actualizar médico",

            error: error.message

        });

    }

});


// ==============================
// DELETE -> DELETE
// ==============================

// Eliminar médico
router.delete(
    '/medicos/:id',
    verificarToken,
    verificarRol("Administrador"),
    async (req, res) => {
    try {

        // Buscar médico
        const medico = await ModelMedico.findById(req.params.id);


        if (!medico) {

            return res.status(404).send({

                mensaje: "Médico no encontrado"

            });

        }


        // Eliminar perfil del médico
        await ModelMedico.findByIdAndDelete(req.params.id);


        // Eliminar usuario relacionado
        await ModelUser.findByIdAndDelete(medico.usuarioId);


        res.send({

            mensaje: "Médico eliminado correctamente"

        });

    } catch (error) {

        res.status(500).send({

            mensaje: "Error al eliminar médico",

            error: error.message

        });

    }

});


// Exportar la ruta
module.exports = router;