var mongoose = require('mongoose');

// Define our beer schema
var OrdenesSchema = new mongoose.Schema({
	cliente_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	orden: {},
	items: {},
	
});

// Export the Mongoose model
module.exports = mongoose.model('Ordenes', OrdenesSchema);