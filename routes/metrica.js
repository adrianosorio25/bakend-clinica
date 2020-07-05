var express = require('express');

var app = express();

var Metrica = require('../models/metrica');

// Obtener todos las metrica
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Metrica.find({})
        .skip(desde)
        .limit(3)
        .exec(
            (err, metricas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando metricas',
                        errors: err
                    });
                }

                Metrica.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        metricas,
                        total: conteo
                    });
                });
            });

});

// Obtener metrica por ID
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var body = req.body;

    Metrica.findById(id, (err, metrica) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar metrica',
                errors: err
            });
        }

        if (!metrica) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La metrica con el id ' + id + ' no existe',
                errors: { message: 'No existe una metrica con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            metrica
        });
    });
});


// Actualizar metrica
app.put('/:id', (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Metrica.findById(id, (err, metrica) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar metrica',
                errors: err
            });
        }

        if (!metrica) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La metrica con el id ' + id + ' no existe',
                errors: { message: 'No existe una metrica con ese ID' }
            });
        }

        metrica.nombre = body.nombre;
        metrica.simbolo = body.simbolo;

        metrica.save((err, metricaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar metrica',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                metrica: metricaGuardado
            });

        });

    });

});

// Crear una metrica
app.post('/', (req, res) => {

    var body = req.body;

    var metrica = new Metrica({
        nombre: body.nombre,
        simbolo: body.simbolo
    });

    metrica.save((err, metricaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear metrica',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            metrica: metricaGuardado
        });
    });

});

// Eliminar metrica por el ID
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Metrica.findByIdAndRemove(id, (err, metricaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar metrica',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una metrica con ese ID',
                errors: { message: 'No existe una metrica con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            metrica: metricaBorrado
        });

    });

});

module.exports = app;