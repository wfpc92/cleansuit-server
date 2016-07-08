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
	}
});

// Export the Mongoose model
module.exports = mongoose.model('Promociones', PromocionesSchema);