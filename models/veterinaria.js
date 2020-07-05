var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var veterinariaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'veterinarias' });

module.exports = mongoose.model('Veterinaria', veterinariaSchema);