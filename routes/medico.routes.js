// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelo de medico
const ModelMedico = require('../models/medico.model');

// CRUD


    // CREATE -> POST

// Crear medicos
router.post('/medicos', async (req, res) => {

    try {

        const nuevoMedico = new ModelMedico(req.body);
        const respuesta = await nuevoMedico.save();
        res.send(respuesta);

    } catch (error) {
        res.status(500).send(error);
    }
});


    // READ -> GET

// Obtener todos los medicos
router.get('/medicos', async (req, res) => {

    try {

        const medicos = await ModelMedico.find();
        res.send(medicos);

    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtener medico por id
router.get("/medicos/:id", async (req, res) => {

    try {

        const medico = await ModelMedico.findById(req.params.id);
        res.send(medico);

    } catch (error) {
        res.status(500).send(error);
    }
})


    // UPDATE -> PUT

// Actualizar medico
router.put('/medicos/:id', async (req, res) => {

    try {

        const medicoActualizado = await ModelMedico.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.send(medicoActualizado);

    } catch (error) {
        res.status(500).send(error);
    }
});


    // DELETE -> DELETE

// Eliminar medico
router.delete('/medicos/:id', async (req, res) => {

    try {

        const medicoEliminado = await ModelMedico.findByIdAndDelete(req.params.id);
        res.send(medicoEliminado);

    } catch (error) {
        res.status(500).send(error);
    }
});

// Exportar la ruta
module.exports = router;