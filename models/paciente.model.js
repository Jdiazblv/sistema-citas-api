// MODELO QUE DEFINE LA ESTRUCTURA (nombres, cedula, telefono, correo)

// Importar libreria mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');
const ModelUser = require('./user.model');

// Creando esquema (estructura)
const pacienteModel = mongoose.Schema({

    rol: {
        type: String,
        enum: ["Administrador", "Paciente", "Medico"],
        default: "Paciente"
    },

    nombres: {
        type: String,
        required: true
    },
    
    apellidos: {
        type: String,
        required: true
    },

    tipoDocumento: {
        type: String,
        required: true
    },

    documento: {
        type: String,
        required: true,
        unique: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    telefono: {
        type: String,
        required: true
    },

    fechaNacimiento: {
        type: String,
        required: true
    },

    sexo: {
        type: String,
        required: true
    },

    eps: {
        type: String,
        default: ""
    },

    direccion: {
        type: String,
        required: true
    },

    password: {
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