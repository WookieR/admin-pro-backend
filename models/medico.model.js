const { Schema, model } = require('mongoose');

let medicoSchema = Schema({
    nombre: { type: String, required: true },
    img: { type: String },
    usuario: { required: true, type: Schema.Types.ObjectId, ref: 'Usuario' },
    hospital: { required: true, type: Schema.Types.ObjectId, ref: 'Hospital' }
}, { collection: 'medicos' });

medicoSchema.method('toJSON', function() {
    const { _v, ...object } = this.toObject();
    return object;
});

module.exports = model('Medico', medicoSchema);