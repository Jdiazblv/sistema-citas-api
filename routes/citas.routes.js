// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelo de citas
const ModelCita = require('../models/cita.model');

// Importar middlewares de autenticación y roles
const verificarToken = require("../middleware/auth.middleware");
const verificarRol = require("../middleware/role.middleware");


// ==============================
// CREATE -> POST
// ==============================

// Crear cita
router.post(
    '/citas',
    verificarToken,
    verificarRol(
        "Administrador",
        "Recepcionista",
        "Medico",
        "Paciente"
    ),
    async (req, res) => {

    try {

        const nuevaCita = new ModelCita(req.body);

        const respuesta = await nuevaCita.save();

        res.status(201).send(respuesta);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al crear cita",
            error: error.message
        });

    }

});


// ==============================
// READ -> GET
// ==============================

// Obtener todas las citas
router.get(
    '/citas',
    verificarToken,
    async (req, res) => {

    try {

        const citas = await ModelCita
            .find()
            .populate({
                path: 'pacienteId',
                populate: {
                    path: 'usuarioId'
                }
            })
            .populate({
                path: 'medicoId',
                populate: {
                    path: 'usuarioId'
                }
            });

        res.send(citas);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al obtener citas",
            error: error.message
        });

    }

});


// Obtener cita por ID
router.get(
    '/citas/:id',
    verificarToken,
    async (req, res) => {

    try {

        const cita = await ModelCita
            .findById(req.params.id)
            .populate({
                path: 'pacienteId',
                populate: {
                    path: 'usuarioId'
                }
            })
            .populate({
                path: 'medicoId',
                populate: {
                    path: 'usuarioId'
                }
            });


        if (!cita) {

            return res.status(404).send({
                mensaje: "Cita no encontrada"
            });

        }

        res.send(cita);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al obtener cita",
            error: error.message
        });

    }

});


// ==============================
// UPDATE -> PUT
// ==============================

// Actualizar cita
router.put(
    '/citas/:id',
    verificarToken,
    verificarRol(
        "Administrador",
        "Recepcionista",
        "Medico",
        "Paciente"
    ),
    async (req, res) => {

    try {

        const citaActualizada = await ModelCita.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!citaActualizada) {

            return res.status(404).send({
                mensaje: "Cita no encontrada"
            });

        }


        res.send(citaActualizada);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al actualizar cita",
            error: error.message
        });

    }

});


// ==============================
// DELETE -> DELETE
// ==============================

// Eliminar cita
router.delete(
    '/citas/:id',
    verificarToken,
    verificarRol(
        "Administrador",
        "Recepcionista",
        "Medico",
        "Paciente"
    ),
    async (req, res) => {
        
    try {

        const citaEliminada = await ModelCita.findByIdAndDelete(
            req.params.id
        );


        if (!citaEliminada) {

            return res.status(404).send({
                mensaje: "Cita no encontrada"
            });

        }


        res.send({
            mensaje: "Cita eliminada correctamente",
            cita: citaEliminada
        });

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al eliminar cita",
            error: error.message
        });

    }

});


// Exportar la ruta
module.exports = router;