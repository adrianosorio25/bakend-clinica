var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var razaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre de la raza es necesaria'] },
    especie: { type: Schema.Types.ObjectId, ref: 'Especie', required: [true, 'La especie es un campo obligatorio'] }
});

module.exports = mongoose.model('Raza', razaSchema);