var mongoose = require('mongoose');

var ClientesSchema = new mongoose.Schema({
	usuario_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuarios',
		unique: true,
	},
	url_foto: {
		type: String
	},
	direccion: {
		type: String
	},
	telefono: {
		type: String
	}	
});

// Export the Mongoose model
module.exports = mongoose.model('Clientes', ClientesSchema);