const { response } = require('express');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

const getMedico = async(req, res = response) => {

    try {

        const medicos = await Medico.find().populate('hospital', 'nombre').populate('usuario', 'nombre email')

        res.json({
            ok: true,
            medicos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }


}

const crearMedico = async(req, res = response) => {
    let id = req.id;

    try {

        const hospital = await Hospital.findById(req.body.hospital);

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontro el hospital especificado'
            });
        }

        const medico = new Medico({
            nombre: req.body.nombre,
            usuario: id,
            hospital: req.body.hospital
        });

        const medicoDb = await medico.save();

        res.json({
            ok: true,
            medico: medicoDb
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });

    }

}

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        message: 'PUT'
    })
}

const eliminarMedico = (req, res = response) => {
    res.json({
        ok: true,
        message: 'DELETE'
    })
}

module.exports = {
    getMedico,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}