var mongoose = require('mongoose');

// Define our beer schema
var PromocionesSchema   = new mongoose.Schema({
	url_imagen: {
		type: String,
		required: true
	}, 
	descuento: {
		type: Number,
	}, 
	codigo: {
		type: String,
		unique: true,
		required: true
	},
	fecha_inicio: {
		type: Date,
		required: true
	},
	fecha_fin: {
		type: Date,
		required: true
	},
	descripcion: {
		type: String
	},
	items: {},//referencias a los productos y subservicios a los se aplica la promocion.
});

PromocionesSchema.methods.vigente = function() {
	var ahora = Date.now();
	console.log(ahora, this.fecha_inicio, this.fecha_fin);
	return ahora >= this.fecha_inicio && ahora <= this.fecha_fin;
};

module.exports = mongoose.model('Promociones', PromocionesSchema);
