var express = require('express');

var mdAutentiacion = require('../middlewares/autenticacion');

var app = express();

var Especie = require('../models/especie');

// Obtener todos las especies
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Especie.find({})
        .skip(desde)
        .limit(7)
        .exec(
            (err, especies) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando especies',
                        errors: err
                    });
                }

                Especie.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        especies,
                        total: conteo
                    });
                });
            });

});

// Obtener especie por ID
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var body = req.body;

    Especie.findById(id, (err, especie) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar especie',
                errors: err
            });
        }

        if (!especie) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La especie con el id ' + id + ' no existe',
                errors: { message: 'No existe una especie con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            especie
        });
    });
});


// Actualizar especie
app.put('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Especie.findById(id, (err, especie) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar especie',
                errors: err
            });
        }

        if (!especie) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La especie con el id ' + id + ' no existe',
                errors: { message: 'No existe una especie con ese ID' }
            });
        }

        especie.especie = body.especie;

        especie.save((err, especieGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar especie',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                especie: especieGuardado
            });

        });

    });

});

// Crear una especie
app.post('/', mdAutentiacion.verificaToken, (req, res) => {

    var body = req.body;

    var especie = new Especie({
        especie: body.especie
    });

    especie.save((err, especieGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear especie',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            especie: especieGuardado
        });
    });

});

// Eliminar especie por el ID
app.delete('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Especie.findByIdAndRemove(id, (err, especieBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar especie',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una especie con ese ID',
                errors: { message: 'No existe una especie con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            especie: especieBorrado
        });

    });

});

module.exports = app;