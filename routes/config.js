
module.exports = function(app, passport) {
	var users = require('./users')(app, passport);
	var productosRouter = require('./productos')(app, passport);
	var serviciosRouter = require('./servicios')(app, passport);

	app.use('/', users);
	app.use('/productos', productosRouter);
	app.use('/servicios', serviciosRouter);
};
