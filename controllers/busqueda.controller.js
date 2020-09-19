const { response } = require('express');
const Usuario = require('../models/usuario.model');
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');

const getTodo = async(req, res = response) => {

    const termino = req.params.termino;
    const regEx = new RegExp(termino, 'i');

    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({ nombre: regEx }),
        Hospital.find({ nombre: regEx }),
        Medico.find({ nombre: regEx })
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    });
}

const getColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const termino = req.params.termino;
    const regEx = new RegExp(termino, 'i');

    let data;

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({ nombre: regEx });
            break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regEx }).populate('usuario', 'nombre img');
            break;

        case 'medicos':
            data = await Medico.find({ nombre: regEx }).populate('hospital', 'nombre img').populate('usuario', 'nombre img');
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Cualquiera esa tabla'
            })
    }

    res.json({
        ok: true,
        resultados: data
    });
}

module.exports = {
    getTodo,
    getColeccion
}