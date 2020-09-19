const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitales = async(req, res = response) => {

    try {
        const hospitales = await Hospital.find().populate('usuario', 'nombre email');

        res.json({
            ok: true,
            hospitales
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
}

const crearHospital = async(req, res = response) => {

    const id = req.id;

    const hospital = new Hospital(req.body);

    hospital.usuario = id;

    try {

        const hospitalDb = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDb
        });

    } catch (error) {

        res.status(500).json({
            ok: true,
            error
        });

    }
}

const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        message: 'PUT'
    })
}

const eliminarHospital = (req, res = response) => {
    res.json({
        ok: true,
        message: 'DELETE'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}