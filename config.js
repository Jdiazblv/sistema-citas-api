// Libreria mongoose
const mongoose = require('mongoose');

// Metodo
const dbconnect = async () => {

    mongoose.set('strictQuery', true);

    // Conexion a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);

    // Mensaje de conexion exitosa
    console.log('✅ Conexion a la base de datos establecida');
}

// Exportar el modelo
module.exports = dbconnect;