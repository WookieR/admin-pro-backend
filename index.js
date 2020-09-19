const express = require('express');
const cors = require('cors')
require('dotenv').config();

const { dbConnection } = require('./database/config')


// CREAR SERVIDOR EXPRESS
const app = express();

// CORS
app.use(cors());

// LECTURA Y  PARSEO DEL BODY
app.use(express.json())

// BASE DE DATOS
dbConnection();

// DIRECTORIO PUBLICO
app.use(express.static('public'));

//RUTAS
app.use('/api/usuario', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospital', require('./routes/hospitales'));
app.use('/api/medico', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/upload'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});