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
	descripcion: {
		type: String
	},
	items: {},//referencias a los productos y subservicios a los se aplica la promocion.
});

// Export the Mongoose model
module.exports = mongoose.model('Promociones', PromocionesSchema);