var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Veterinaria = require('../models/veterinaria');

// Obtener todos los veterinarias
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Veterinaria.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, veterinarias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando veterinarias',
                        errors: err
                    });
                }

                Veterinaria.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        veterinarias,
                        total: conteo
                    });
                });

            });
});


// Actualizar Veterinaria
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Veterinaria.findById(id, (err, veterinaria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar veterinarias',
                errors: err
            });
        }

        if (!veterinaria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El veterinaria con el id ' + id + ' no existe',
                errors: { message: 'No existe un veterinaria con ese ID' }
            });
        }

        veterinaria.nombre = body.nombre;
        veterinaria.usuario = req.usuario._id;

        veterinaria.save((err, veterinariaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar veterinaria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                veterinaria: veterinariaGuardado
            });

        });

    });

});


// Crear una nueva veterinaria
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var veterinaria = new Veterinaria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    veterinaria.save((err, veterinariaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear veterinarias',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            veterinaria: veterinariaGuardado
        });

    });
});


// Eliminar Veterinaria por el ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Veterinaria.findByIdAndRemove(id, (err, veterinariaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar veterinaria',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un veterinaria con ese ID',
                errors: { message: 'No existe un veterinaria con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            veterinaria: veterinariaBorrado
        });

    });

});


module.exports = app;