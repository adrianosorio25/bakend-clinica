var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var metricaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    simbolo: { type: String, required: [true, 'El simbolo es necesario'] }
});

module.exports = mongoose.model('Metrica', metricaSchema);