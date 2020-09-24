const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const validarJWT = (req, res, next) => {

    // LEER DEL TOKEN
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'No hay token en la peticion'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.id = id;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'token invalido'
        });
    }

}

const validarAdminRole = async(req, res, next) => {
    const id = req.id;

    try {
        const usuarioDb = await Usuario.findById(id);

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario inexistente'
            })
        }

        if (usuarioDb.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                message: 'No tiene privilegios para eso'
            })
        }

        next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }
}

const validarAdminRole_o_mismoUsuario = async(req, res, next) => {
    const id = req.id;
    const idModificar = req.params.id;



    try {
        const usuarioDb = await Usuario.findById(id);

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario inexistente'
            })
        }

        if (usuarioDb.role === 'ADMIN_ROLE' || id === idModificar) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                message: 'No tiene privilegios para eso'
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }
}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRole_o_mismoUsuario
}