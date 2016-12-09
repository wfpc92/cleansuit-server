
module.exports = function(app, passport) {
	var usuariosRouter = require('./usuarios')(app, passport);
	var promocionesRouter = require('./promociones')(app, passport);
	var productosRouter = require('./productos')(app, passport);
	var serviciosRouter = require('./servicios')(app, passport);
	var ordenesRouter = require('./ordenes')(app, passport);
	var configuracionesRouter = require('./configuraciones')(app, passport);
	var domiciliariosRouter = require('./domiciliarios')(app, passport);


	app.use('/', usuariosRouter);
	app.use('/promociones', promocionesRouter);
	app.use('/productos', productosRouter);
	app.use('/servicios', serviciosRouter);
	app.use('/ordenes', ordenesRouter);
	app.use('/domiciliarios', domiciliariosRouter);

	app.use('/configuraciones', configuracionesRouter);
};
