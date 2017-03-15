var mongoose = require('mongoose');
var VersionApp = mongoose.model('VersionApp');

var SubserviciosSchema = new mongoose.Schema({
	_creator : { type: mongoose.Schema.Types.ObjectId, ref: 'Servicios' },
	nombre: String,
	descripcion: String,
	precio: Number,
	detalles: String,
	adicionales: {}
});

SubserviciosSchema.post('save', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	});
});

module.exports = mongoose.model('Subservicios', SubserviciosSchema);
