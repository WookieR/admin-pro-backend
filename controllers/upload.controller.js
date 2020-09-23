const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-image");
const fs = require('fs');

const path = require('path');
const { fstat } = require("fs");

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospital', 'medico', 'usuario'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            message: 'El tipo es invalido'
        });
    }

    // VALIDACION: EXISTEN ARCHIVOS
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No se subieron archivos'
        });
    }

    // PROCESAR IMAGEN
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // VALIDAR EXTENSION
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            message: 'No es es una extension permitida'
        });
    }

    // GENERAR NOMBRE
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // PATH PARA GUARDAR IMAGEN
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // MOVER IMAGEN
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // ACTUALIZAR BASE DE DATOS
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            message: 'Archivo subido',
            nombreArchivo
        });
    })
}

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${img}`)

    // IMAGEN POR DEFECTO
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.png`)
        res.sendFile(pathImg);
    }


}

module.exports = {
    fileUpload,
    retornaImagen
}