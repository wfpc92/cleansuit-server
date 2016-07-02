var mongoose = require('mongoose');

var ClienteSchema = new mongoose.Schema({
	usuario_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuario'
	},
	direccion: {
		type: String
	},
	telefono: {
		type: String
	}	
});

// Export the Mongoose model
module.exports = mongoose.model('Cliente', ClienteSchema);