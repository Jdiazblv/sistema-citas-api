// MODELO QUE DEFINE LA ESTRUCTURA (pacienteId, fecha, hora, doctor, especialidad, estado)

// Importar libreria mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');

// Creando esquema (estructura)
const citaModel = mongoose.Schema ({

    pacienteId: {
        type: String,
        required: true
    },

    fecha: {
        type: String,
        required: true
    },

    hora: {
        type: String,
        required: true
    },

    doctor: {
        type: String,
        required: true
    },

    especialidad: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        required: true
    },
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