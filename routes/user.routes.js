// RUTAS - ACCIONES DEL CRUD (Create, read, update, delete)

// Importar express
const express = require('express');
// Crear router
const router = express.Router();


// Importar modelos

    // Importar modelo de usuario
    const ModelUser = require("../models/user.model");
    // Importar middleware de autenticación
    const verificarToken = require("../middleware/auth.middleware");
    // Importar middleware de roles
    const verificarRol = require("../middleware/role.middleware");


// Agregar bcrypt y jwt

    // Agregar bcrypt para encriptar la contraseña
    const bcrypt = require('bcrypt');
    // Agregar jsonwebtoken para generar tokens
    const jwt = require('jsonwebtoken');


// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET;


// ==============================
// CREATE -> POST
// ==============================

// Crear usuario
router.post(
    "/users",
    verificarToken,
    verificarRol("Administrador"),
    async (req, res) => {


        // Validar campos obligatorios y formato de correo
        try {

            // Desestructurar los campos del cuerpo de la solicitud
            const {
                nombres,
                apellidos,
                tipoDocumento,
                documento,
                correo,
                telefono,
                fechaNacimiento,
                rol,
                password
            } = req.body;

            // Validar campos obligatorios
            if (
                !nombres?.trim() ||
                !apellidos?.trim() ||
                !tipoDocumento?.trim() ||
                !documento?.trim() ||
                !correo?.trim() ||
                !telefono?.trim() ||
                !fechaNacimiento?.trim() ||
                !rol ||
                !password
            ) {
                return res.status(400).send({
                    mensaje: "Todos los campos son obligatorios."
                });
            }

            // Validar el formato básico del documento
            if (!/^\d+$/.test(documento.trim())) {
                return res.status(400).send({
                    mensaje: "El documento debe contener solo números."
                });
            }

            // Validar el formato básico del correo
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
                return res.status(400).send({
                    mensaje: "Ingresa un correo electrónico válido."
                });
            }

            // Validar el rol permitido
            const rolesPermitidos = [
                "Administrador",
                "Recepcionista",
                "Medico",
                "Paciente"
            ];

            if (!rolesPermitidos.includes(rol)) {
                return res.status(400).send({
                    mensaje: "El rol seleccionado no es válido."
                });
            }

            // Encriptar la contraseña
            const passwordEncriptada = await bcrypt.hash(password, 10);

            // Crear un nuevo usuario con los datos proporcionados
            const nuevoUsuario = new ModelUser({
                nombres: nombres.trim(),
                apellidos: apellidos.trim(),
                tipoDocumento: tipoDocumento.trim(),
                documento: documento.trim(),
                correo: correo.trim().toLowerCase(),
                telefono: telefono.trim(),
                fechaNacimiento: fechaNacimiento.trim(),
                rol,
                password: passwordEncriptada
            });

            const usuarioGuardado = await nuevoUsuario.save();

            const usuarioRespuesta = usuarioGuardado.toObject();
            delete usuarioRespuesta.password;

            res.status(201).send({
                mensaje: "Usuario creado correctamente",
                usuario: usuarioRespuesta
            });

        } catch (error) {

            // Manejar errores de clave duplicada (documento o correo)
            if (error.code === 11000) {
                if (error.keyPattern?.documento) {
                    return res.status(409).send({
                    mensaje: "Ya existe un usuario con ese documento."
                    });
                }

                if (error.keyPattern?.correo) {
                    return res.status(409).send({
                    mensaje: "Ya existe un usuario con ese correo electrónico."
                    });
                }

                return res.status(409).send({
                    mensaje: "Ya existe un usuario con esos datos."
                });
            }


            // Manejar errores de validación de Mongoose
            console.error("Error al crear usuario:", error);

            res.status(500).send({
                mensaje: "No fue posible crear el usuario."
            });
        }
    }
);

// ==============================
// LOGIN -> POST
// ==============================

// Iniciar sesión
router.post("/login", async (req, res) => {

    try {

        // Obtener documento y contraseña enviados
        const { documento, password } = req.body;

        // Buscar usuario por documento
        const usuario = await ModelUser.findOne({ documento }).select('+password');

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).send({
                mensaje: "Documento o contraseña incorrectos"
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return res.status(403).send({
                mensaje: "Esta cuenta está desactivada. Contacta al administrador."
            });
        }

        // Comparar contraseña ingresada con la contraseña encriptada
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        // Verificar si la contraseña es correcta
        if (!passwordCorrecta) {
            return res.status(401).send({
                mensaje: "Documento o contraseña incorrectos"
            });
        }

        // Crear token JWT
        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol
            },
            JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        // Login correcto
        res.send({
            mensaje: "Inicio de sesión correcto",
            token: token,
            usuario: {
                _id: usuario._id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                documento: usuario.documento,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });                         

    } catch (error) {
        
        console.error("Error interno al iniciar sesión.", error);

        res.status(500).send({
        mensaje: "No fue posible iniciar sesión",

        });

    }

});


// ==============================
// READ -> GET
// ==============================

// Obtener todos los usuarios
router.get("/users", verificarToken, verificarRol("Administrador"), async (req, res) => {

    try {

        const usuarios = await ModelUser.find().select("-password");

        res.send(usuarios);

    } catch (error) {

        console.error("Error al obtener usuarios:", error);

        res.status(500).send({
            mensaje: "No fue posible obtener los usuarios.",
        });

    }

});


// Obtener usuario por ID
router.get(
    "/users/:id",
    verificarToken,
    async (req, res) => {
        try {
            // Solo el administrador puede consultar otros usuarios
            if (
                req.usuario.rol !== "Administrador" &&
                req.usuario.id !== req.params.id
            ) {
                return res.status(403).send({
                    mensaje: "No tienes permiso para consultar este usuario"
                });
            }

            const usuario = await ModelUser.findById(req.params.id).select("-password");

            if (!usuario) {
                return res.status(404).send({
                    mensaje: "Usuario no encontrado"
                });
            }

            res.send(usuario);

        } catch (error) {

            console.error("Error al obtener usuario:", error);

            res.status(500).send({
                mensaje: "No fue posible obtener al usuario",
            });
        }
    }
);

// ==============================
// UPDATE -> PUT
// ==============================

// Actualizar usuario
router.put(
    "/users/:id",
    verificarToken,
    verificarRol("Administrador"),
    async (req, res) => {
        
        try {

            const datosActualizados = { ...req.body };

            // No permitir modificar el identificador
            delete datosActualizados._id;

            // Encriptar la contraseña si se proporciona una nueva
            if (datosActualizados.password !== undefined) {
                if (!datosActualizados.password) {
                    return res.status(400).send({
                        mensaje: "La contraseña no puede estar vacía"
                    });
                }

                datosActualizados.password = await bcrypt.hash(
                    datosActualizados.password,
                    10
                );
            }

            const usuarioActualizado = await ModelUser.findByIdAndUpdate(
                req.params.id,
                datosActualizados,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!usuarioActualizado) {
                return res.status(404).send({
                    mensaje: "Usuario no encontrado"
                });
            }

            // Eliminar la contraseña del objeto de respuesta
            const usuarioRespuesta = usuarioActualizado.toObject();
            delete usuarioRespuesta.password;

            // Responder con el usuario actualizado
            res.send({
                mensaje: "Usuario actualizado correctamente",
                usuario: usuarioRespuesta
            });

        
        } catch (error) {

            // Manejar errores de documento o correo duplicado
            if (error.code === 11000) {

                if (error.keyPattern?.documento) {
                    return res.status(409).send({
                        mensaje: "Ya existe otro usuario con ese documento."
                    });
                }

                if (error.keyPattern?.correo) {
                    return res.status(409).send({
                        mensaje: "Ya existe otro usuario con ese correo electrónico."
                    });
                }

                return res.status(409).send({
                    mensaje: "Ya existe otro usuario con esos datos."
                });
            }

            console.error("Error al actualizar usuario:", error);

            res.status(500).send({
                mensaje: "No fue posible actualizar al usuario"
            });
        }

    }
);


// ==============================
// DELETE -> DELETE
// ==============================

// Eliminar usuario
router.delete(
    "/users/:id",
    verificarToken,
    verificarRol("Administrador"),
    async (req, res) => {
        try {
            const usuarioEliminado = await ModelUser.findByIdAndDelete(
                req.params.id
            );

            if (!usuarioEliminado) {
                return res.status(404).send({
                    mensaje: "Usuario no encontrado"
                });
            }

            res.send({
                mensaje: "Usuario eliminado correctamente"
            });

        } catch (error) {

            console.error("Error al eliminar usuario:", error);

            res.status(500).send({
                mensaje: "No fue posible eliminar al usuario",
            });
        }
    }
);

// Exportar la ruta
module.exports = router;