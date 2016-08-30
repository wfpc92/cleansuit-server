var mongoose = require('mongoose');
var VersionApp = require('./version-app');

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
	items: {},//referencias a los productos y subservicios a los se aplica la promocion.
});

PromocionesSchema.methods.vigente = function() {
	var ahora = Date.now();
	console.log(ahora, this.fecha_inicio, this.fecha_fin);
	return ahora >= this.fecha_inicio && ahora <= this.fecha_fin;
};

PromocionesSchema.methods.etiquetar = function() {
	var arr = [], etiqueta, cadena;
	
	for(var i in this.items){
		if (this.items 
			&& arr.indexOf(this.items[i].descuento) == -1 
			&& this.items[i].descuento) {
		    arr.push(parseInt(this.items[i].descuento));
		}
	}
	
	arr = arr.sort(function(a, b){return a-b});
	
	if(arr.length == 0){
		etiqueta = "Descuento del " + this.descuento + "%";
	} else if(arr.length == 1) {
		etiqueta = "Descuento del " + arr[0] + "%";
	} else {
		cadena = "";

		for (var i in arr) {
			cadena += arr[i];
			if(i < arr.length - 2) {
				cadena += ", ";
			}
			if(i == arr.length - 2) {
			 	cadena += " y "
			}
		}

		etiqueta = "Descuentos del " + cadena + "%";
	}
	console.log(etiqueta)
	this.etiquetaDescuentos = etiqueta;
};

PromocionesSchema.post('save', function (next) {
	VersionApp.singleton(function(v) {
		v.inventario += 1;
	})
});

module.exports = mongoose.model('Promociones', PromocionesSchema);
