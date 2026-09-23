// Middleware para verificar el rol del usuario
const verificarRol = (...rolesPermitidos) => {

    return (req, res, next) => {

        // Verificar si el usuario tiene un rol permitido
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).send({
                mensaje: "No tienes permisos para realizar esta acción"
            });
        }

        // Continuar con la siguiente función
        next();

    };

};

// Exportar middleware
module.exports = verificarRol;