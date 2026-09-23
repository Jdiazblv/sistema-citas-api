// MODELO QUE DEFINE LA ESTRUCTURA DE LAS CITAS MÉDICAS

// Importar librería mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');

// Creando esquema (estructura)
const citaModel = mongoose.Schema({

    // Paciente que tiene la cita
    pacienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pacientes',
        required: true
    },

    // Médico encargado de la cita
    medicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medicos',
        required: true
    },

    // Fecha de la cita
    fecha: {
        type: String,
        required: true
    },

    // Hora de la cita
    hora: {
        type: String,
        required: true
    },

    // Motivo de la consulta
    motivo: {
        type: String,
        required: true
    },

    // Estado actual de la cita
    estado: {
        type: String,
        enum: [
            "Pendiente",
            "Confirmada",
            "Atendida",
            "Cancelada"
        ],
        default: "Pendiente"
    }

},
{
    timestamps: true,
    versionKey: false,
}
);

// Crear una colección llamada citas usando la estructura citaModel
const ModelCita = mongoose.model('citas', citaModel);

// Exportar el modelo
module.exports = ModelCita;