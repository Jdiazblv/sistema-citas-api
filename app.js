const express = require("express");
const dbconnect = require("./config");

const app = express();

// Permite recibir JSON
app.use(express.json());

// Importar rutas
const userRoutes = require("./routes/user.routes");
const pacienteRoutes = require("./routes/paciente.routes");
const citaRoutes = require("./routes/citas.routes");

// Usar rutas
app.use(userRoutes);
app.use(pacienteRoutes);
app.use(citaRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

// Puerto
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});

dbconnect();

/* 

Una forma profesional de ejecutar el proyecto:
Ingresar a: (package.json) y agregar:

    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon app.js"

Terminal:
> npm run dev

*/