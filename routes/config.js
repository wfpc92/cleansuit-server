
module.exports = function(app, passport) {
	var usuariosRouter = require('./usuarios')(app, passport);
	var productosRouter = require('./productos')(app, passport);
	var serviciosRouter = require('./servicios')(app, passport);
	var ordenesRouter = require('./ordenes')(app, passport);

	app.use('/', usuariosRouter);
	app.use('/productos', productosRouter);
	app.use('/servicios', serviciosRouter);
	app.use('/ordenes', ordenesRouter);
};
