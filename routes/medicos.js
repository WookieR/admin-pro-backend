const { Router } = require('express');

const {
    getMedico,
    crearMedico,
    actualizarMedico,
    eliminarMedico
} = require('../controllers/medicos.controller');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT
], getMedico);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital debe ser valido').isMongoId(),
    validarCampos
], crearMedico);

router.put('/:id', [

], actualizarMedico);

router.delete('/:id', [

], eliminarMedico);



module.exports = router;