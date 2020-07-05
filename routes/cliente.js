var express = require('express');

var app = express();

var Cliente = require('../models/cliente');

// Obtener todos los clientes
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cliente.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, clientes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando clientes',
                        errors: err
                    });
                }

                Cliente.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        clientes,
                        total: conteo
                    });
                });

            });

});

// Obtener cliente por ID
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var body = req.body;

    Cliente.findById(id, (err, cliente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            cliente
        });
    });
});

// Actualizar Cliente
app.put('/:id', (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Cliente.findById(id, (err, cliente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }

        cliente.identificacion = body.identificacion;
        cliente.nombres = body.nombres;
        cliente.apellidos = body.apellidos;
        cliente.email = body.email;
        cliente.telefono = body.telefono;
        cliente.direccion = body.direccion;

        cliente.save((err, clienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cliente: clienteGuardado
            });

        });

    });

});

// Crear un cliente
app.post('/', (req, res) => {

    var body = req.body;

    var cliente = new Cliente({
        identificacion: body.identificacion,
        nombres: body.nombres,
        apellidos: body.apellidos,
        email: body.email,
        telefono: body.telefono,
        direccion: body.direccion
    });

    cliente.save((err, clienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            cliente: clienteGuardado
        });
    });

});

// Eliminar Cliente por el ID
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cliente',
                errors: err
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un cliente con ese ID',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            cliente: clienteBorrado
        });

    });

});

module.exports = app;