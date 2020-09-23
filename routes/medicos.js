const { Router } = require('express');

const {
    getMedico,
    crearMedico,
    actualizarMedico,
    eliminarMedico,
    getMedicoById
} = require('../controllers/medicos.controller');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT
], getMedico);

router.get('/:id', [
    validarJWT
], getMedicoById);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital debe ser valido').isMongoId(),
    validarCampos
], crearMedico);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital debe ser valido').isMongoId(),
    validarCampos
], actualizarMedico);

router.delete('/:id', [
    validarJWT
], eliminarMedico);



module.exports = router;