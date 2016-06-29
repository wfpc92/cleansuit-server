var mongoose = require('mongoose');

// Define our beer schema
var OrdenesSchema = new mongoose.Schema({
	cliente_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  	fecha: {
  		type: Date
  	},
  	estado: {
  		type: String, 
  		enum: ['nueva','rutaRecoleccion','recolectada', 'procesando', 'rutaEntrega', 'entregada', 'cancelada']
  	},
	orden: {},
	items: {},
	
});

// Export the Mongoose model
module.exports = mongoose.model('Ordenes', OrdenesSchema);