// Libreria mongoose
const mongoose = require('mongoose');

// Metodo
const dbconnect = async () => {

    mongoose.set('strictQuery', true);

    // Conexion a la base de datos
    await mongoose.connect(
        'mongodb+srv://jdiazblv:Papito2005@cluster0.t67o6c0.mongodb.net/?appName=Cluster0'
    )
    .then(() => console.log('Conexion a la base de datos establecida'))
    .catch((error) =>
        console.error('Error al conectar a la base de datos:', error)
    );
}

// Exportar
module.exports = dbconnect;