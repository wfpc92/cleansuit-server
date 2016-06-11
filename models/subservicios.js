var mongoose = require('mongoose');

// Define our beer schema
var SubserviciosSchema = new mongoose.Schema({
	_creator : { type: mongoose.Schema.Types.ObjectId, ref: 'Servicios' },
	nombre: String,
	descripcion: String,
	precio: Number, 
	detalles: String
});

// Export the Mongoose model
module.exports = mongoose.model('Subservicios', SubserviciosSchema);