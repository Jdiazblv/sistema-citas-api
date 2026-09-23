// Importar JWT
const jwt = require('jsonwebtoken');

// Clave secreta para JWT
const JWT_SECRET = "clave_secreta_sistema_citas";

// Middleware para verificar el token
const verificarToken = (req, res, next) => {

    try {

        // Obtener el encabezado Authorization
        const authHeader = req.headers.authorization;

        // Verificar si existe el encabezado
        if (!authHeader) {
            return res.status(401).send({
                mensaje: "Token no proporcionado"
            });
        }

        // Obtener solamente el token
        const token = authHeader.split(" ")[1];

        // Verificar el token
        const usuario = jwt.verify(token, JWT_SECRET);

        // Guardar los datos del usuario en la petición
        req.usuario = usuario;

        // Continuar con la siguiente función
        next();

    } catch (error) {

        res.status(401).send({
            mensaje: "Token inválido o expirado"
        });

    }

};

// Exportar middleware
module.exports = verificarToken;