var mongoose = require('mongoose');
var VersionApp = mongoose.model('VersionApp');

var PromocionesSchema = new mongoose.Schema({
	url_imagen: {
		type: String,
		required: true
	},
	descuento: {
		type: Number,
	},
	codigo: {
		type: String,
		unique: true,
		required: true
	},
	fecha_inicio: {
		type: Date,
		required: true
	},
	fecha_fin: {
		type: Date,
		required: true
	},
	descripcion: {
		type: String
	},
	etiquetaDescuentos: {
		type: String
	},
	productos: [],
	servicios: []
});

PromocionesSchema.methods.vigente = function() {
	var ahora = Date.now();
	// console.log(ahora, this.fecha_inicio, this.fecha_fin);
	return ahora >= this.fecha_inicio && ahora <= this.fecha_fin;
};

PromocionesSchema.methods.etiquetar = function() {
	var i, arr = [], etiqueta, cadena;
	console.log("etiquetar:", this.productos, this.servicios);
	
	var buscarYAgregarEnArr = function(items) {
		for (i in items) {
			if(items[i].descuento) {
				var desc = parseInt(items[i].descuento);
				var noExisteEnArr = (arr.indexOf(desc) == -1);

				if (noExisteEnArr) {
					arr.push(desc);
				}
			}
		}
	}

	buscarYAgregarEnArr(this.productos);
	buscarYAgregarEnArr(this.servicios);

  	arr = arr.sort(function(a, b) { return a-b; });

  	if (arr.length === 0){
  		etiqueta = "";
	} else if (arr.length == 1) {
		etiqueta = `Descuento del ${arr[0]}%`;
	} else {
		cadena = "";
		for (i in arr) {
			cadena += arr[i];
			if (i < arr.length - 2) {
				cadena += ", ";
			}
			if (i == arr.length - 2) {
			 	cadena += " y ";
			}
		}
		etiqueta = `Descuentos del ${cadena}%`;
	}

	console.log(etiqueta);
	this.etiquetaDescuentos = etiqueta;
};

PromocionesSchema.post('save', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	});
});

PromocionesSchema.post('findOneAndRemove', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	});
});

PromocionesSchema.post('remove', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	});
});

PromocionesSchema.post('update', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	});
});
module.exports = mongoose.model('Promociones', PromocionesSchema);
