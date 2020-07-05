// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var veterinariaRoutes = require('./routes/veterinaria');
var medicoRoutes = require('./routes/medico');
var clienteRoutes = require('./routes/cliente');
var servicioRoutes = require('./routes/servicio');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var especieRoutes = require('./routes/especie');
var razaRoutes = require('./routes/raza');
var personalRoutes = require('./routes/personal');
var metricaRoutes = require('./routes/metrica');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/happypetsDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/metrica', metricaRoutes);
app.use('/personal', personalRoutes);
app.use('/raza', razaRoutes);
app.use('/especie', especieRoutes);
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/servicio', servicioRoutes);
app.use('/cliente', clienteRoutes);
app.use('/veterinaria', veterinariaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});