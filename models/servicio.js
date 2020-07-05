var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var servicioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] }
});

module.exports = mongoose.model('Servicio', servicioSchema);