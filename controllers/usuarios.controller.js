const Usuario = require('../models/usuario.model');
const jwt = require('../helpers/jwt');

const bcrypt = require('bcryptjs');

const { response } = require('express');

const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    // const usuarios = await Usuario.find({}, 'nombre email role google').skip(desde).limit(5);

    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img').skip(desde).limit(5),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios: usuarios,
        total: total
    });
}

const crearUsuarios = async(req, res = response) => {
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                error: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario(
            req.body
        );

        //ENCRIPTAR CONTRASEÑA
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password, salt);

        //GUARDAR USUARIO
        await usuario.save();

        //GENERAR TOKEN
        const token = await jwt.generarJWT(usuario._id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });

    }
}

const actualizarUsuarios = async(req, res = response) => {
    const id = req.params.id;

    try {
        const usuarioDb = await Usuario.findById(id)

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                error: 'No se encontró el usuario especificado'
            })
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDb.email === email) {
            delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne({ email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    error: 'Ya existe un usuario con ese email'
                })
            }

        }

        campos.email = email;

        // VALIDACION DE TOKEN Y MISMO USUARIO

        // ACTUALIZACIONES

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, campos, { new: true })

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
}

const borrarUsuarios = async(req, res = response) => {
    const id = req.params.id;

    try {

        const usuarioDb = await Usuario.findById(id)

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                error: 'No se encontró el usuario especificado'
            })
        }

        await Usuario.findByIdAndDelete(id);

        res.json({
            ok: true,
            message: 'Usuario Eliminado'
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    borrarUsuarios
}