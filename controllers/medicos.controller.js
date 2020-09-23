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

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const usuId = req.id;

    try {

        const hospitalDb = await Medico.findById(id);

        if (!hospitalDb) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el medico especificado'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: usuId
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: 'Se hizo pingo'
        });
    }
}

const eliminarMedico = async(req, res = response) => {

    const id = req.params.id;

    try {

        const medicoDb = await Medico.findById(id);

        if (!medicoDb) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el medico especificado'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            message: 'medico eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Se hizo choto'
        })
    }
}

const getMedicoById = async(req, res = response) => {
    const id = req.params.id;

    try {
        const medicoDb = await Medico.findById(id).populate('hospital', 'nombre img')
            .populate('usuario', 'nombre email img');

        if (!medicoDb) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el medico especificado'
            });
        }

        res.json({
            ok: true,
            medico: medicoDb
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: 'Se hizo choto'
        })
    }
}

module.exports = {
    getMedico,
    crearMedico,
    actualizarMedico,
    eliminarMedico,
    getMedicoById
}