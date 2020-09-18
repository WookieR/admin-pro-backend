const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // LEER DEL TOKEN
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            message: 'No hay token en la peticion'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.id = id;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'token invalido'
        });
    }

}

module.exports = {
    validarJWT
}