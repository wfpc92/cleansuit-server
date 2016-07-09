var express = require('express');
var router = express.Router();

var Configuraciones = require('../models/configuraciones');


module.exports = function(app, passport) {
	router.use(passport.authenticate('jwt', { session: false}));
	
	router.get('/', function(req, res) {
		Configuraciones.find(function(err, configuracionesLst) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var configuraciones = {
				domicilio: 0
			};
			if(configuracionesLst.length !== 0){
				configuraciones = configuracionesLst[0];
			}

			res.json({
				success: true,
				configuraciones: configuraciones,
				mensaje: 'configuraciones de la aplicación.'
			});
		});
	});


	router.post('/domicilio',	function(req, res){
		Configuraciones.find(function(err, configuracionesLst) {
			if (err) return res.json({success: false, mensaje: err.errmsg, error: err});

			var configuraciones = null;

			//si no existe una configuraciones se inicializa.
			if(configuracionesLst.length == 0){
				configuraciones = Configuraciones({
					domicilio: req.body.domicilio
				});
				mensaje = "configuraciones creada"
			} else {
				//si existe tomar la primera
				configuraciones = configuracionesLst[0];
				configuraciones.domicilio = req.body.domicilio;
				mensaje = "configuraciones actualizada"
			}
			configuraciones.save(function(err){
				res.json({
					success: true,
					configuraciones: configuraciones,
					mensaje: mensaje
				});
			});

			
		});
	});

	return router;
};
