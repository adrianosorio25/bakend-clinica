var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var especieSchema = new Schema({
    especie: { type: String, required: [true, 'La especie es necesaria'] }
});

module.exports = mongoose.model('Especie', especieSchema);