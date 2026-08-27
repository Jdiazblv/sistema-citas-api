// Libreria mongoose
const mongoose = require('mongoose');

// Metodo
const dbconnect = async () => {

    mongoose.set('strictQuery', true);

    // Conexion a la base de datos
    await mongoose.connect(
        'mongodb+srv://jdiazblv:Papito123@cluster0.t67o6c0.mongodb.net/sistemacitas?retryWrites=true&w=majority&appName=Cluster0'
    );

    console.log('✅ Conexion a la base de datos establecida');
}

// Exportar el modelo
module.exports = dbconnect;