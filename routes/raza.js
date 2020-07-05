var express = require('express');

var mdAutentiacion = require('../middlewares/autenticacion');

var app = express();

var Raza = require('../models/raza');


// Obtener todos los medicos

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Raza.find({})
        .skip(desde)
        .limit(7)
        .populate('especie')
        .exec(
            (err, razas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando raza',
                        errors: err
                    });
                }

                Raza.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        razas,
                        total: conteo
                    });
                });
            });

});

// Obtener raza por ID
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var body = req.body;

    Raza.findById(id, (err, raza) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar raza',
                errors: err
            });
        }

        if (!raza) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La raza con el id ' + id + ' no existe',
                errors: { message: 'No existe una raza con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            raza
        });
    });
});

// Actualizar Raza 

app.put('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Raza.findById(id, (err, raza) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar raza',
                errors: err
            });
        }

        if (!raza) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La raza con el id ' + id + ' no existe',
                errors: { message: 'No existe una raza con ese ID' }
            });
        }

        raza.nombre = body.nombre;
        raza.especie = body.especie;

        raza.save((err, razaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar raza',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                raza: razaGuardado
            });
        });
    });
});

// Crear Raza

app.post('/', mdAutentiacion.verificaToken, (req, res) => {

    var body = req.body;

    var raza = new Raza({
        nombre: body.nombre,
        especie: body.especie
    });

    raza.save((err, razaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear raza',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            raza: razaGuardado
        });
    });

});

// Eliminar Raza por el ID

app.delete('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Raza.findByIdAndRemove(id, (err, razaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar raza',
                errors: err
            });
        }

        if (!razaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una raza con ese ID',
                errors: { message: 'No existe una raza con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            raza: razaBorrado
        });
    });
});

module.exports = app;