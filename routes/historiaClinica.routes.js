// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelo de historia clínica
const ModelHistoriaClinica = require('../models/historiaClinica.model');

// Importar middlewares de autenticación y roles
const verificarToken = require("../middleware/auth.middleware");
const verificarRol = require("../middleware/role.middleware");


// ==============================
// CREATE -> POST
// ==============================

// Crear historia clínica
router.post(
    '/historias-clinicas',
    verificarToken,
    verificarRol("Medico"),
    async (req, res) => {

    try {

        const nuevaHistoria = new ModelHistoriaClinica(req.body);

        const respuesta = await nuevaHistoria.save();

        res.status(201).send(respuesta);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al crear historia clínica",
            error: error.message
        });

    }

});


// ==============================
// READ -> GET
// ==============================

// Obtener todas las historias clínicas
router.get(
    '/historias-clinicas',
    verificarToken,
    verificarRol("Administrador", "Recepcionista"),
    async (req, res) => {

    try {

        const historias = await ModelHistoriaClinica
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
            })
            .populate('citaId');

        res.send(historias);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al obtener historias clínicas",
            error: error.message
        });

    }

});


// Obtener historia clínica por ID
router.get(
    '/historias-clinicas/:id',
    verificarToken,
    async (req, res) => {

    try {

        const historia = await ModelHistoriaClinica
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
            })
            .populate('citaId');

        if (!historia) {

            return res.status(404).send({
                mensaje: "Historia clínica no encontrada"
            });

        }

        // Administrador y Recepcionista pueden consultar cualquier historia
        if (
            req.usuario.rol !== "Administrador" &&
            req.usuario.rol !== "Recepcionista"
        ) {

            // Médico: solamente puede consultar sus propias historias
            if (req.usuario.rol === "Medico") {

                if (
                    historia.medicoId.usuarioId._id.toString() !== req.usuario.id
                ) {

                    return res.status(403).send({
                        mensaje: "No tienes permiso para consultar esta historia clínica"
                    });

                }

            }

            // Paciente: solamente puede consultar su propia historia
            else if (req.usuario.rol === "Paciente") {

                if (
                    historia.pacienteId.usuarioId._id.toString() !== req.usuario.id
                ) {

                    return res.status(403).send({
                        mensaje: "No tienes permiso para consultar esta historia clínica"
                    });

                }

            }

            // Cualquier otro rol no tiene permiso
            else {

                return res.status(403).send({
                    mensaje: "No tienes permiso para consultar esta historia clínica"
                });

            }

        }

        res.send(historia);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al obtener historia clínica",
            error: error.message
        });

    }

});


// ==============================
// UPDATE -> PUT
// ==============================

// Actualizar historia clínica
router.put(
    '/historias-clinicas/:id',
    verificarToken,
    verificarRol("Medico"),
    async (req, res) => {

    try {

        const historiaActualizada = await ModelHistoriaClinica.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!historiaActualizada) {

            return res.status(404).send({
                mensaje: "Historia clínica no encontrada"
            });

        }

        res.send(historiaActualizada);

    } catch (error) {

        res.status(500).send({
            mensaje: "Error al actualizar historia clínica",
            error: error.message
        });

    }

});


// ==============================
// DELETE -> DELETE
// ==============================

// Eliminar historia clínica
router.delete(
    '/historias-clinicas/:id',
    verificarToken,
    async (req, res) => {

    return res.status(403).send({
        mensaje: "Las historias clínicas no pueden eliminarse"
    });

});


// Exportar la ruta
module.exports = router;