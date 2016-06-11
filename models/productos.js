var mongoose = require('mongoose');

// Define our beer schema
var ProductosSchema   = new mongoose.Schema({
	nombre: String,
	precio: Number,
	desc_corta: String,
	desc_larga: String,
	foto: String
});

// Export the Mongoose model
module.exports = mongoose.model('Productos', ProductosSchema);