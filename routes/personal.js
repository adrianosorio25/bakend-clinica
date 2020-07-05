var express = require('express');

var app = express();

var Personal = require('../models/personal');

// Obtener todo el personal
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Personal.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, personal) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando personal',
                        errors: err
                    });
                }

                Personal.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        personal,
                        total: conteo
                    });
                });

            });

});

// Obtener personal por ID
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var body = req.body;

    Personal.findById(id, (err, personal) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar personal',
                errors: err
            });
        }

        if (!personal) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El personal con el id ' + id + ' no existe',
                errors: { message: 'No existe un personal con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            personal
        });
    });
});

// Actualizar Personal
app.put('/:id', (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Personal.findById(id, (err, personal) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar personal',
                errors: err
            });
        }

        if (!personal) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El personal con el id ' + id + ' no existe',
                errors: { message: 'No existe un personal con ese ID' }
            });
        }

        personal.nombres = body.nombres;
        personal.apellidos = body.apellidos;
        personal.identificacion = body.identificacion;
        personal.cargo = body.cargo;
        personal.especialidad = body.especialidad;

        personal.save((err, personalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar personal',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                personal: personalGuardado
            });

        });

    });

});

// Crear un personal de la veterinaria
app.post('/', (req, res) => {

    var body = req.body;

    var personal = new Personal({
        nombres: body.nombres,
        apellidos: body.apellidos,
        identificacion: body.identificacion,
        cargo: body.cargo,
        especialidad: body.especialidad
    });

    personal.save((err, personalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear personal',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            personal: personalGuardado
        });
    });

});

// Eliminar Personal por el ID
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Personal.findByIdAndRemove(id, (err, personalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar personal',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un personal con ese ID',
                errors: { message: 'No existe un personal con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            personal: personalBorrado
        });

    });

});

module.exports = app;