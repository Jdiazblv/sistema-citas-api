// MODELO QUE DEFINE LA ESTRUCTURA DE LOS DATOS EXCLUSIVOS DEL MÉDICO

// Importar librería mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');

// Creando esquema (estructura)
const medicoModel = mongoose.Schema({

    // Relación con el usuario que tiene las credenciales y datos generales
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true,
        unique: true
    },

    // Especialidades que maneja el médico
    especialidades: {
        type: [String],
        required: true,
        default: []
    },

    // Registro profesional del médico
    registroProfesional: {
        type: String,
        required: true,
        unique: true
    }

},
{
    timestamps: true,
    versionKey: false,
}
);

// Crear una colección llamada medicos usando la estructura medicoModel
const ModelMedico = mongoose.model('medicos', medicoModel);

// Exportar el modelo
module.exports = ModelMedico;