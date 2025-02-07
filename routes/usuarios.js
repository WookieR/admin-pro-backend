const { Router } = require('express');
const { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuarios } = require('../controllers/usuarios.controller')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT, validarAdminRole, validarAdminRole_o_mismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], crearUsuarios);

router.put('/:id', [
    validarJWT,
    validarAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], actualizarUsuarios);

router.delete('/:id', [
    validarJWT,
    validarAdminRole_o_mismoUsuario
], borrarUsuarios);



module.exports = router;