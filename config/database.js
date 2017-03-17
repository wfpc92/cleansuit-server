var autoIncrement = require('mongoose-auto-increment');
var chalk = require('chalk');

module.exports = function(mongoose, next) {
	mongoose.Promise = global.Promise;

    var dbs = [
        'mongodb://localhost:27017/Cleansuit',
        'mongodb://uclean:limpiaropa0@localhost:17551/Cleansuit',
    ];

    var dbURI = dbs.pop();

	function conectar(dbURI) {
		try {
			intentos++;
			console.log(`  Intentando conexión a MongoDB, esperando respuesta...`);
			mongoose.connect(dbURI)
				.then(() => {
					autoIncrement.initialize(mongoose.connection);
					process.env.MONGODB_URI = dbURI;
					console.log(`%s Conectado a: %s`, chalk.green('✓'), chalk.green(dbURI));
					return next();
				})
				.catch((err) => {
					console.log(`%s No se pudo conectar a: %s`, chalk.red('✗'), chalk.red(dbURI));
					dbURI = dbs.pop();
		          	if (!dbURI) {
		          		throw err;
		          	}
		          	conectar(dbURI);
				});
		} catch(err) {
			console.log(`  Falló al conectar a: ${dbURI}`, err.message);
		}
	}

	conectar(dbURI);
};
