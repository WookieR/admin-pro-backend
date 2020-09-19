const { Router } = require('express');
const { getTodo, getColeccion } = require('../controllers/busqueda.controller');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:termino', [validarJWT], getTodo);
router.get('/coleccion/:tabla/:termino', [validarJWT], getColeccion)

module.exports = router;