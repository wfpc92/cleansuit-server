var mongoose = require('mongoose');
var VersionApp = require('./version-app');

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
	}
},{
    timestamps: true
});

ConfiguracionesSchema.methods.modificar = function(nuevaConfig) {
	this.domicilio = nuevaConfig.domicilio || this.domicilio;
	this.sobreEmpresa = nuevaConfig.sobreEmpresa || this.sobreEmpresa;
	this.terminosCondiciones = nuevaConfig.terminosCondiciones || this.terminosCondiciones;
	return this;
};

ConfiguracionesSchema.post('save', function (next) {
	VersionApp.singleton(function(v) {
		v.configuraciones += 1;
	})
});

ConfiguracionesSchema.statics.singleton = function(cb) {
	var self = this;
	self.find(function(err, configuracionesLst) {
		var configuraciones;

		if(configuracionesLst.length !== 0){
			configuraciones = configuracionesLst[0];
			if(cb) {
				cb(configuraciones);
			}	
		} else {
			configuraciones = new self();
			configuraciones.save(function(err) {
				if(cb) {
					cb(configuraciones);
				}	
			});
		}		
	});
};

module.exports = mongoose.model('Configuraciones', ConfiguracionesSchema);
