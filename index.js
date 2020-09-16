const express = require('express');
const cors = require('cors')
require('dotenv').config();

const { dbConnection } = require('./database/config')


// CREAR SERVIDOR EXPRESS
const app = express();

// CORS
app.use(cors());

// BASE DE DATOS
dbConnection();

//RUTAS
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Hola Wachin!!!'
    });
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});