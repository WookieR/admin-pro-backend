const { response } = require('express');
const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');

const { googleVerify } = require('../helpers/google-verify');

const bcrypt = require('bcryptjs');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // VERIFICAR CONTRASEÑA

        const usuarioDb = await Usuario.findOne({ email });

        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                message: 'Los datos no coinciden con ningún usuario registrado'
            });
        }

        // VERIFICAR CONTRASEÑA

        const validPassword = bcrypt.compareSync(password, usuarioDb.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Los datos no coinciden con ningún usuario registrado'
            });
        }

        // GENERAR TOKEN

        const token = await generarJWT(usuarioDb._id);

        res.json({
            ok: true,
            token
        });

    } catch (err) {
        res.json(500).json({
            ok: false,
            err
        });
    }
}

const googleSignIn = async(req, res = response) => {
    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDb = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDb) {
            //SI NO EXISTE USUARIO
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDb;
            usuario.google = true;
        }

        // GUARDAR EN DB
        await usuario.save();

        // GENERAR EL TOKEN
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            message: 'token incorrecto'
        });
    }


}

module.exports = {
    login,
    googleSignIn
}