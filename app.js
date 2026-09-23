const express = require("express");
const cors = require("cors");
const dbconnect = require("./config");

const app = express();

// Habilitar cors
app.use(cors());

// Permite recibir JSON
app.use(express.json());

// Importar rutas
const userRoutes = require("./routes/user.routes");
const pacienteRoutes = require("./routes/paciente.routes");
const citaRoutes = require("./routes/citas.routes");
const medicoRoutes = require("./routes/medico.routes");
const historiaClinicaRoutes = require("./routes/historiaClinica.routes");

// Usar rutas
app.use("/api/", userRoutes);
app.use("/api/", pacienteRoutes);
app.use("/api/", citaRoutes);
app.use("/api/", medicoRoutes);
app.use("/api/", historiaClinicaRoutes);

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