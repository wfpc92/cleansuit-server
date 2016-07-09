var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var config = {
	dbRemote: {
		uri: 'mongodb://uclean:limpiaropa0@localhost:17551/Cleansuit'
	},
	dbLocal: {
		uri: 'mongodb://localhost:27017/Cleansuit'
	}
};

var dbURI = config.dbRemote.uri;
var intentos = 0; 

mongoose.connection.on("open", function(ref) {
	return console.log("Conectado a: " + dbURI);
});

mongoose.connection.on("error", function(err) {
	if (intentos == 2) {
		throw err;
	}
	console.log("No se pudo conectar a: " + dbURI);
	dbURI = config.dbLocal.uri;
	conectar(dbURI);
	
});


function conectar() {
	try { 
		intentos++;
		mongoose.connect(dbURI);
		db = mongoose.connection;
		autoIncrement.initialize(db);
		console.log("Intentando conexión a " + dbURI + ", esperando respuesta...");	
	} catch( err ) {
		console.log("Falló al conectar a: " + dbURI, err.message);
	}
}

conectar(dbURI);	

module.exports = config;