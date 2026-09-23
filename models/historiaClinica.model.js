// MODELO QUE DEFINE LA ESTRUCTURA DE LA HISTORIA CLÍNICA

// Importar librería mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');

// Creando esquema (estructura)
const historiaClinicaModel = mongoose.Schema({

    // Paciente al que pertenece la historia clínica
    pacienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pacientes',
        required: true
    },

    // Cita relacionada con esta atención
    citaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'citas',
        required: true
    },

    // Médico que realizó la atención
    medicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medicos',
        required: true
    },

    // Motivo de la consulta
    motivoConsulta: {
        type: String,
        required: true
    },

    // Síntomas o descripción del estado del paciente
    sintomas: {
        type: String,
        default: ""
    },

    // Diagnóstico realizado por el médico
    diagnostico: {
        type: String,
        default: ""
    },

    // Tratamiento indicado
    tratamiento: {
        type: String,
        default: ""
    },

    // Observaciones adicionales del médico
    observaciones: {
        type: String,
        default: ""
    }

},
{
    timestamps: true,
    versionKey: false,
}
);

// Crear una colección llamada historiasclinicas
const ModelHistoriaClinica = mongoose.model(
    'historiasclinicas',
    historiaClinicaModel
);

// Exportar el modelo
module.exports = ModelHistoriaClinica;