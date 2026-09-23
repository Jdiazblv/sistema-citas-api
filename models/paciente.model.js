// MODELO QUE DEFINE LA ESTRUCTURA DE LOS DATOS EXCLUSIVOS DEL PACIENTE

// Importar librería mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');

// Creando esquema (estructura)
const pacienteModel = mongoose.Schema({

    // Relación con el usuario que tiene las credenciales y datos generales
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true,
        unique: true
    },

    // Datos exclusivos del paciente
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