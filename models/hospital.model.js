const { Schema, model } = require('mongoose');

let hospitalSchema = Schema({
    nombre: { type: String, required: true },
    img: { type: String },
    usuario: { required: true, type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

hospitalSchema.method('toJSON', function() {
    const { _v, ...object } = this.toObject();
    return object;
});

module.exports = model('Hospital', hospitalSchema);