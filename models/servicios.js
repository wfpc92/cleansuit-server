var mongoose = require('mongoose');
var VersionApp = mongoose.model('VersionApp');

var ServiciosSchema = new mongoose.Schema({
	nombre: String,
	descripcion: String,
	subservicios: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subservicios'}]
});

ServiciosSchema.post('save', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	});
});

module.exports = mongoose.model('Servicios', ServiciosSchema);
