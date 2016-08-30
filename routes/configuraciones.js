var express = require('express');
var router = express.Router();

var Configuraciones = require('../models/configuraciones');
var VersionApp = require('../models/version-app');
var VersionesOrdenes = require('../models/versiones-ordenes');

module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));
	
	router.get('/', function(req, res) {
		Configuraciones.singleton(function(c) {
			res.json({
				success: true,
				configuraciones: c,
				mensaje: 'configuraciones de la aplicación.'
			});
		});
	}); 

	router.get('/versiones', function(req, res) {
		VersionApp.singleton(function(v) {
			VersionesOrdenes.getVersion(req.user._id, function(vo) {
				res.json({
					success: true,
					versiones: {
						inventario: v.inventario,
						configuraciones: v.configuraciones,
						ordenes: vo.version
					},
					mensaje: 'versiones de informacion actual del API.'
				});	
			})
			
		});
	});

	router.post('/',	function(req, res){
		Configuraciones.singleton(function(c) {
			c.modificar(req.body)
			.save(function(err){
				if (err) return res.json({success: false, mensaje: err.errmsg, error: err});
				
				res.json({
					success: true,
					configuraciones: c,
					mensaje: "Configuraciones del sistema."
				});
			});
		});
	});

	return router;
};
