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

// Importar modelos de paciente y médico
const ModelPaciente = require('../models/paciente.model');
const ModelMedico = require('../models/medico.model');


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

        let filtro = {};

        // Médico: solamente sus citas
        if (req.usuario.rol === "Medico") {

            const medico = await ModelMedico.findOne({
                usuarioId: req.usuario.id
            });

            if (!medico) {
                return res.status(404).send({
                    mensaje: "Perfil de médico no encontrado"
                });
            }

            filtro.medicoId = medico._id;
        }

        // Paciente: solamente sus citas
        if (req.usuario.rol === "Paciente") {

            const paciente = await ModelPaciente.findOne({
                usuarioId: req.usuario.id
            });

            if (!paciente) {
                return res.status(404).send({
                    mensaje: "Perfil de paciente no encontrado"
                });
            }

            filtro.pacienteId = paciente._id;
        }

        const citas = await ModelCita
            .find(filtro)
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

        // Administrador y Recepcionista pueden consultar cualquier cita
        if (
            req.usuario.rol !== "Administrador" &&
            req.usuario.rol !== "Recepcionista"
        ) {

            // Médico: solamente puede consultar sus propias citas
            if (req.usuario.rol === "Medico") {

                if (
                    cita.medicoId.usuarioId._id.toString() !== req.usuario.id
                ) {

                    return res.status(403).send({
                        mensaje: "No tienes permiso para consultar esta cita"
                    });

                }

            }

            // Paciente: solamente puede consultar sus propias citas
            else if (req.usuario.rol === "Paciente") {

                if (
                    cita.pacienteId.usuarioId._id.toString() !== req.usuario.id
                ) {

                    return res.status(403).send({
                        mensaje: "No tienes permiso para consultar esta cita"
                    });

                }

            }

            // Cualquier otro rol no tiene permiso
            else {

                return res.status(403).send({
                    mensaje: "No tienes permiso para consultar esta cita"
                });

            }

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

            // Médico: solamente puede modificar sus propias citas
            if (req.usuario.rol === "Medico") {

                if (
                    cita.medicoId.usuarioId._id.toString() !== req.usuario.id
                ) {

                    return res.status(403).send({
                        mensaje: "No tienes permiso para modificar esta cita"
                    });

                }

            }

            // Paciente: solamente puede modificar sus propias citas
            if (req.usuario.rol === "Paciente") {

                if (
                    cita.pacienteId.usuarioId._id.toString() !== req.usuario.id
                ) {

                    return res.status(403).send({
                        mensaje: "No tienes permiso para modificar esta cita"
                    });

                }

            }

            const citaActualizada = await ModelCita.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

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

            // Médico: solamente puede eliminar sus propias citas
            if (req.usuario.rol === "Medico") {
                if (
                    cita.medicoId.usuarioId._id.toString() !== req.usuario.id
                ) {
                    return res.status(403).send({
                        mensaje: "No tienes permiso para eliminar esta cita"
                    });
                }
            }

            // Paciente: solamente puede eliminar sus propias citas
            if (req.usuario.rol === "Paciente") {
                if (
                    cita.pacienteId.usuarioId._id.toString() !== req.usuario.id
                ) {
                    return res.status(403).send({
                        mensaje: "No tienes permiso para eliminar esta cita"
                    });
                }
            }

            await ModelCita.findByIdAndDelete(req.params.id);

            res.send({
                mensaje: "Cita eliminada correctamente"
            });

        } catch (error) {

            res.status(500).send({
                mensaje: "Error al eliminar cita",
                error: error.message
            });

        }

    }
);


// Exportar la ruta
module.exports = router;