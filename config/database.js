var autoIncrement = require('mongoose-auto-increment');
var chalk = require('chalk');

module.exports = function(mongoose, next) {
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
		console.log(`%s Conectado a: %s`, chalk.green('✓'), chalk.green(dbURI));
		return next();
	});

	mongoose.connection.on("error", function(err) {
		if (intentos == 2) {
			throw err;
		}
		console.log(`%s No se pudo conectar a: %s`, chalk.red('✗'), chalk.red(dbURI));
		dbURI = config.dbLocal.uri;
		conectar(dbURI);
	});


	function conectar() {
		try {
			intentos++;
			mongoose.connect(dbURI);
			autoIncrement.initialize(mongoose.connection);
			console.log(`  Intentando conexión a MongoDB, esperando respuesta...`);
		} catch( err ) {
			console.log(`  Falló al conectar a: ${dbURI}`, err.message);
		}
	}

	conectar(dbURI);

	return config;
};
