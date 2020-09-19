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

const actualizarHospital = async(req, res = response) => {
    const id = req.params.id;
    const usuId = req.id;

    try {

        const hospitalDb = await Hospital.findById(id);

        if (!hospitalDb) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el hospital especificado'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: usuId
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Se hizo choto'
        })
    }
}

const eliminarHospital = async(req, res = response) => {
    const id = req.params.id;

    try {

        const hospitalDb = await Hospital.findById(id);

        if (!hospitalDb) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el hospital especificado'
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            message: 'Hospital eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Se hizo choto'
        })
    }


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