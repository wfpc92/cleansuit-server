var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var ESTADOS = [
	'nueva',
	'rutaRecoleccion',
	'recolectada',
	'procesando',
	'rutaEntrega',
	'entregada',
	'cancelada'
];

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
		enum: ESTADOS
	},
	orden: {},
	items: {},
	domiciliario_recoleccion_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuarios'
	},
	domiciliario_entrega_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuarios'
	},	
});

OrdenesSchema.plugin(autoIncrement.plugin, {
		model: 'Ordenes',
		field: 'codigo',
		startAt: 1,
		incrementBy: 1
});

OrdenesSchema.statics.ESTADOS = ESTADOS;

OrdenesSchema.statics.ESTADOSENPROCESO = [
	ESTADOS[0],//nueva
	ESTADOS[1],//rutaRecoleccion
	ESTADOS[2],//recolectada
	ESTADOS[3],//procesando
	ESTADOS[4]//rutaEntrega
];

OrdenesSchema.statics.ESTADORUTARECOLECCION = [
	ESTADOS[1],//rutaRecoleccion
];

OrdenesSchema.statics.ESTADORUTAENTREGA = [
	ESTADOS[4]//rutaEntrega
];

// Export the Mongoose model
module.exports = mongoose.model('Ordenes', OrdenesSchema);
