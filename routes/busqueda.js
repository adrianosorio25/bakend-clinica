var express = require('express');

var app = express();

var Veterinaria = require('../models/veterinaria');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Servicio = require('../models/servicio');
var Cliente = require('../models/cliente');
var Especie = require('../models/especie');
var Raza = require('../models/raza');
var Personal = require('../models/personal');


// Busqueda por coleccion
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedico(busqueda, regex);
            break;
        case 'veterinarias':
            promesa = buscarVeterinaria(busqueda, regex);
            break;
        case 'servicios':
            promesa = buscarServicio(busqueda, regex);
            break;
        case 'clientes':
            promesa = buscarCliente(busqueda, regex);
            break;
        case 'especies':
            promesa = buscarEspecie(busqueda, regex);
            break;
        case 'razas':
            promesa = buscarRaza(busqueda, regex);
            break;
        case 'personal':
            promesa = buscarPersonal(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios, medicos y veterinarias',
                error: { message: 'Tipo de tabla/coleccion no valida' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

// Busqueda general
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarVeterinaria(busqueda, regex),
            buscarMedico(busqueda, regex),
            buscarUsuario(busqueda, regex),
            buscarServicio(busqueda, regex),
            buscarCliente(busqueda, regex),
            buscarEspecie(busqueda, regex),
            buscarRaza(busqueda, regex),
            buscarPersonal(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                veterinarias: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
                servicios: respuestas[3],
                clientes: respuestas[4],
                especies: respuestas[5],
                razas: respuestas[6],
                perosnal: respuestas[7]
            });
        });
});

function buscarCliente(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Cliente.find({ nombres: regex }, (err, clientes) => {
            if (err) {
                reject('Error al buscar cliente', err);
            } else {
                resolve(clientes);
            }
        });
    });
}

function buscarPersonal(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Personal.find({ nombres: regex }, (err, personal) => {
            if (err) {
                reject('Error al buscar personal', err);
            } else {
                resolve(personal);
            }
        });
    });
}

function buscarServicio(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Servicio.find({ nombre: regex }, (err, servicios) => {
            if (err) {
                reject('Error al buscar servicios', err);
            } else {
                resolve(servicios);
            }
        });
    });
}

function buscarRaza(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Raza.find({ nombre: regex }, (err, razas) => {
            if (err) {
                reject('Error al buscar razas', err);
            } else {
                resolve(razas);
            }
        });
    });
}

function buscarEspecie(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Especie.find({ especie: regex }, (err, especies) => {
            if (err) {
                reject('Error al buscar especies', err);
            } else {
                resolve(especies);
            }
        });
    });
}

function buscarMedico(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al buscar medico', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar usuario', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;