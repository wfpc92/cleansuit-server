var mongoose = require('mongoose');

var ConfiguracionesSchema   = new mongoose.Schema({
	domicilio: {
		type: Number,
		required: true,
		default: 0
	}, 
	sobreEmpresa: {
		type: String,
		required: true,
		default: "Informacion sobre Empresa no editada"
	}, 
	terminosCondiciones: {
		type: String,
		required: true,
		default: "Terminos y condiciones no editadas"
	},
	versiones: {
		inventario: {
			type: Number,
			required: true,
			default: 0
		},
		configuraciones: {
			type: Number,
			required: true,
			default: 0
		}
	},
},{
    timestamps: true
});

ConfiguracionesSchema.methods.modificar = function(nuevaConfig) {
	this.domicilio = nuevaConfig.domicilio || this.domicilio;
	this.versionInventario = nuevaConfig.versionInventario || this.versionInventario;
	this.sobreEmpresa = nuevaConfig.sobreEmpresa || this.sobreEmpresa;
	this.terminosCondiciones = nuevaConfig.terminosCondiciones || this.terminosCondiciones;
};

module.exports = mongoose.model('Configuraciones', ConfiguracionesSchema);
