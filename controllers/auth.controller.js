const { response } = require('express');
const Usuario = require('../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');

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

module.exports = {
    login
}