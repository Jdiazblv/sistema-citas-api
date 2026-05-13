// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelo de citas
const ModelCita = require('../models/cita.model');

// CRUD


    // CREATE -> POST

// Crear citas
router.post('/citas', async (req, res) => {
    try {

        const nuevaCita = new ModelCita(req.body);
        const respuesta = await nuevaCita.save();

        res.send(respuesta);

    } catch (error) {
        res.status(500).send(error);
    }
});


    // READ -> GET

// Obtener todas las citas
router.get('/citas', async (req, res) => {
    try {

        const citas = await ModelCita.find();

        res.send(citas);

    } catch (error) {
        res.status(500).send(error);
    }
});


// Obtener citas por ID
router.get('/citas/:id', async (req, res) => {
    try {

        const cita = await ModelCita.findById(req.params.id);

        res.send(cita);

    } catch (error) {
        res.status(500).send(error);
    }
});


    // UPDATE -> PUT

// Actualizar cita
router.put('/citas/:id', async (req, res) => {
    try {
        
        const citaActualizada = await ModelCita.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );

        res.send(citaActualizada);

    } catch (error) {
        res.status(500).send(error);
    }
});


    // DELETE -> DELETE

// Eliminar cita
router.delete('/citas/:id', async (req, res) => {
    try {

        const citaElimidada = await ModelCita.findByIdAndDelete(req.params.id);

        res.send(citaElimidada);

    } catch (error) {
        res.status(500).send(error);
    }
});

// Exportar la ruta
module.exports = router;

