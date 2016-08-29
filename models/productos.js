var mongoose = require('mongoose');
var Configuraciones = require('./configuraciones');

// Define our beer schema
var ProductosSchema   = new mongoose.Schema({
	nombre: String,
	precio: Number,
	desc_corta: String,
	desc_larga: String,
	url_imagen: String
});

ProductosSchema.post('save', function (next) {
	Configuraciones.find(function(err, configuracionesLst) {
		var configuraciones;

		if(configuracionesLst.length !== 0){
			configuraciones = configuracionesLst[0];
			configuraciones.versiones.inventario += 1;
		} else {
			configuraciones = new Configuraciones();
		}
		console.log(configuraciones)

		configuraciones.save();
	});
});

// Export the Mongoose model
module.exports = mongoose.model('Productos', ProductosSchema);