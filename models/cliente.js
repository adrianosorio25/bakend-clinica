var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var clienteSchema = new Schema({
    identificacion: { type: Number, required: [true, 'La identificación es necesaria'] },
    nombres: { type: String, required: [true, 'Los nombres son necesarios'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    email: { type: String, unique: true, required: false },
    telefono: { type: Number, required: [true, 'El telefono necesario'] },
    direccion: { type: String, required: false }
});

clienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Cliente', clienteSchema);