var mongoose = require('mongoose');
// var VersionApp = mongoose.model('VersionApp');

var PrendasSchema = new mongoose.Schema({
	_creator : { type: mongoose.Schema.Types.ObjectId, ref: 'Ordenes' },
	codigo: String,
	subservicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Subservicios' },
	fotos: [],
	marca: String,
});

module.exports = mongoose.model('Prendas', PrendasSchema);
