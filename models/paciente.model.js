// MODELO QUE DEFINE LA ESTRUCTURA (nombres, cedula, telefono, correo)

// Importar libreria mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');
const ModelUser = require('./user.model');

// Creando esquema (estructura)
const pacienteModel = mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },
    
    cedula: {
        type: String,
        required: true
    },

    telefono: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
}
);

// Crear una colección llamada pacientes usando la estructura pacienteModel
const ModelPaciente = mongoose.model('pacientes', pacienteModel);

// Exportar el modelo
module.exports = ModelPaciente;