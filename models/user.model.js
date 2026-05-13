// MODELO QUE DEFINE LA ESTRUCTURA (nomUser, passUser)

// Importar libreria mongoose para conectar Node.js con MongoDB
const mongoose = require('mongoose');

// Creando esquema (estructura)
const userModel = mongoose.Schema({

    nomUser: {              // Nombre del campo
        type: String,       // Sera texto
        required: true      // Es de requerimiento (obligatorio)
    },

    passUser: {             // Nombre del campo
        type: String,       // Sera texto
        required: true      // Es de requerimiento (obligatorio)
    }
},
{
    timestamps: true,
    versionKey: false,
}
);

// Crear una colección llamada usuarios usando la estructura userModel
const ModelUser = mongoose.model('usuarios', userModel);

// Exportar el modelo
module.exports = ModelUser;

/*
timestamps: true,
    Hace que mongoose agrege fechas
        - "createdAt": "Fecha"
        - "updatedAt": "Fecha":
        Es la fecha de la ultima actualizacion
        Para editar el "createdAt" con "updatedAt" en JSON
    
versionKey: false,
    Elimina el campo "__v": 0 que mongoose agrega automaticamente
*/