// MODELO DE USUARIO
// Define la información general de todas las personas que pueden acceder al sistema.

// Importar mongoose
const mongoose = require('mongoose');

// Crear esquema
const userModel = mongoose.Schema({

    // Nombres del usuario
    nombres: {
        type: String,
        required: true
    },

    // Apellidos del usuario
    apellidos: {
        type: String,
        required: true
    },

    // Tipo de documento
    tipoDocumento: {
        type: String,
        required: true
    },

    // Número de documento
    documento: {
        type: String,
        required: true,
        unique: true
    },

    // Correo electrónico
    correo: {
        type: String,
        required: true,
        unique: true
    },

    // Teléfono
    telefono: {
        type: String,
        required: true
    },

    // Fecha de nacimiento
    fechaNacimiento: {
        type: String,
        required: true
    },

    // Rol dentro del sistema
    rol: {
        type: String,
        required: true,
        enum: [
            "Administrador",
            "Recepcionista",
            "Medico",
            "Paciente"
        ]
    },

    // Contraseña
    password: {
        type: String,
        required: true,
        select: false
    },

    // Permite activar o desactivar el acceso del usuario
    activo: {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true,
    versionKey: false
});

// Crear colección usuarios
const ModelUser = mongoose.model('usuarios', userModel);

// Exportar modelo
module.exports = ModelUser;