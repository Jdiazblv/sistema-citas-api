// MODELO QUE DEFINE LA ESTRUCTURA (nombres, cedula, telefono, correo)

// Importar libreria mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');

// Creando esquema (estructura)
const medicoModel = mongoose.Schema({

    rol: {
        type: String,
        required: true,
        enum: [
            "Administrador",
            "Paciente",
            "Medico"
        ]
    },

    especialidades: {
        type: [String],
        required: true,
        default: []
    },

    registroProfesional: {
        type: String,
        required: true,
        unique: true
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
        required: true,
        enum: [
            "Cedula de Ciudadania",
            "Cedula de Extranjeria",
            "Tarjeta de Identidad",
            "Registro Civil",
            "Pasaporte"
        ]
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
        required: true,
        enum: [
            "Masculino",
            "Femenino",
            "Otro"
        ]
    },

    direccion: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    activo: {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true,
    versionKey: false,
}
);

// rear una colección llamada medicos usando la estructura medicoModel
const ModelMedico = mongoose.model('medicos', medicoModel);

// Exportar el modelo
module.exports = ModelMedico;