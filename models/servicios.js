var mongoose = require('mongoose');

// Define our beer schema
var ServiciosSchema = new mongoose.Schema({
	nombre: String,
	descripcion: String,
	subservicios: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subservicios'}]
});

// Export the Mongoose model
module.exports = mongoose.model('Servicios', ServiciosSchema);