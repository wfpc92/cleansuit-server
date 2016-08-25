var mongoose = require('mongoose');

var ConfiguracionesSchema   = new mongoose.Schema({
	versionInventario: {
		type: Number,
		required: true
	},
	domicilio: {
		type: Number,
		required: true
	}, 
	sobreEmpresa: {
		type: String,
		required: true
	}, 
	terminosCondiciones: {
		type: String,
		required: true
	}
},{
    timestamps: true
});

module.exports = mongoose.model('Configuraciones', ConfiguracionesSchema);