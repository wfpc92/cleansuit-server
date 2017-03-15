var mongoose = require('mongoose');
var VersionApp = mongoose.model('VersionApp');

var ProductosSchema   = new mongoose.Schema({
	nombre: String,
	precio: Number,
	desc_corta: String,
	desc_larga: String,
	url_imagen: String
});

ProductosSchema.post('save', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	});
});

module.exports = mongoose.model('Productos', ProductosSchema);
