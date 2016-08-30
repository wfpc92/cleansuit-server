var mongoose = require('mongoose');
var VersionApp = require('./version-app');

var ServiciosSchema = new mongoose.Schema({
	nombre: String,
	descripcion: String,
	subservicios: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subservicios'}]
});

ServiciosSchema.post('save', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	})
});

module.exports = mongoose.model('Servicios', ServiciosSchema);
