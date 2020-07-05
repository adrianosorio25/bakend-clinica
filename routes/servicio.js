var express = require('express');

var mdAutentiacion = require('../middlewares/autenticacion');

var app = express();

var Servicio = require('../models/servicio');

// Obtener todos los Servicios
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Servicio.find({})
        .skip(desde)
        .limit(7)
        .exec(
            (err, servicios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando servicios',
                        errors: err
                    });
                }

                Servicio.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        servicios,
                        total: conteo
                    });
                });
            });

});

// Obtener cliente por ID
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var body = req.body;

    Servicio.findById(id, (err, servicio) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar servicio',
                errors: err
            });
        }

        if (!servicio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El servicio con el id ' + id + ' no existe',
                errors: { message: 'No existe un servicio con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            servicio
        });
    });
});


// Actualizar Servicio
app.put('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Servicio.findById(id, (err, servicio) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar servicio',
                errors: err
            });
        }

        if (!servicio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El servicio con el id ' + id + ' no existe',
                errors: { message: 'No existe un servicio con ese ID' }
            });
        }

        servicio.nombre = body.nombre;
        servicio.descripcion = body.descripcion;

        servicio.save((err, servicioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar servicio',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                servicio: servicioGuardado
            });

        });

    });

});

// Crear un servicio
app.post('/', mdAutentiacion.verificaToken, (req, res) => {

    var body = req.body;

    var servicio = new Servicio({
        nombre: body.nombre,
        descripcion: body.descripcion,
    });

    servicio.save((err, servicioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear servicio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            servicio: servicioGuardado
        });
    });

});

// Eliminar servicio por el ID
app.delete('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Servicio.findByIdAndRemove(id, (err, servicioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar servicio',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un servicio con ese ID',
                errors: { message: 'No existe un servicio con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            servicio: servicioBorrado
        });

    });

});

module.exports = app;