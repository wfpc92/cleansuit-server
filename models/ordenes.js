var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var ESTADOS = [
	'nueva',			//0
	'rutaRecoleccion',	//1
	'recolectada',		//2
	'procesando',		//3
	'rutaEntrega',		//4
	'entregada',		//5
	'cancelada'			//6
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
	recoleccion: {},
	entrega: {},
	cancelacion: {},
	domiciliario_recoleccion_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuarios'
	},
	domiciliario_entrega_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuarios'
	},	
	servicioDirecto: {
		type: Boolean
	}
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

OrdenesSchema.statics.ESTADORECOLECTADA = [
	ESTADOS[2],//rutaEntrega
];

OrdenesSchema.statics.ESTADORUTAENTREGA = [
	ESTADOS[4]//rutaEntrega
];

OrdenesSchema.statics.ESTADOENTREGADA = [
	ESTADOS[5]//rutaEntrega
];

OrdenesSchema.statics.ESTADOCANCELADA = [
	ESTADOS[6],//cancelada
];

// Export the Mongoose model
module.exports = mongoose.model('Ordenes', OrdenesSchema);
