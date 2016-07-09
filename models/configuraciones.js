var mongoose = require('mongoose');

var ConfiguracionesSchema   = new mongoose.Schema({
	domicilio: {
		type: Number,
		required: true
	}
},{
    timestamps: true
});

module.exports = mongoose.model('Configuraciones', ConfiguracionesSchema);