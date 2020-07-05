var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var personalSchema = new Schema({
    nombres: { type: String, required: [true, 'Los nombres son necesarios'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    identificacion: { type: Number, required: [true, 'La identificación es necesaria'] },
    cargo: { type: String, required: [true, 'El cargo es necesario'] },
    especialidad: { type: String, required: [true, 'La especialidad es necesaria'] },
});

module.exports = mongoose.model('Personal', personalSchema);