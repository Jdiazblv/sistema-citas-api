// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');

// Crear router
const router = express.Router();

// Importar modelo de paciente
const ModelPaciente = require('../models/paciente.model');

// CRUD


    // CREATE -> POST

// Crear pacientes
router.post('/pacientes', async (req, res) => {
    try {

        const nuevoPaciente = new ModelPaciente(req.body);
        const respuesta = await nuevoPaciente.save();
        res.send(respuesta);

    } catch (error) {
        res.status(500).send(error);
    }
});


    // READ -> GET

// Obtener todos los pacientes
router.get('/pacientes', async (req, res) => {
    try {

        const pacientes = await ModelPaciente.find();
        res.send(pacientes);

    } catch (error){
        res.status(500).send(error);
    }
});

// Obtener paciente por id
router.get('/pacientes/:id', async (req, res) => {
    try {

        const paciente = await ModelPaciente.findById(req.params.id);
        res.send(paciente);

    } catch (error) { 
        res.status(500).send(error);
    }
});


    // UPDATE -> PUT

// Actualizar pacientes
router.put('/pacientes/:id', async (req, res) => {
    try {

        const pacienteActualizado = await ModelPaciente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.send(pacienteActualizado);

    } catch (error) {
        res.status(500).send(error);
    }
});


    // DELETE -> DELETE

// Eliminar pacientes
router.delete('/pacientes/:id', async (req, res) => {
    try {
        const pacienteEliminado = await ModelPaciente.findByIdAndDelete(req.params.id);
        res.send(pacienteEliminado);

    } catch (error) {
        res.status(500).send(error);
    }
});

// Exportar la ruta
module.exports = router;

