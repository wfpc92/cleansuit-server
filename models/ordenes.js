var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var OrdenesSchema = new mongoose.Schema({
	cliente_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuarios'
	},
	codigo: {
		type: Number
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

OrdenesSchema.plugin(autoIncrement.plugin, {
		model: 'Ordenes',
		field: 'codigo',
		startAt: 1,
		incrementBy: 1
});

// Export the Mongoose model
module.exports = mongoose.model('Ordenes', OrdenesSchema);
