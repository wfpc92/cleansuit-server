var passportJWT = require('passport-jwt');
var mongoose = require('mongoose');
var Usuarios = mongoose.model('Usuarios');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var config = require("./passport");

module.exports = function(passport) {
	var params = {
		secretOrKey: config.jwtSecret,
		jwtFromRequest: ExtractJwt.fromAuthHeader()
	};

	var strategy = new Strategy(params, function(jwt_payload, done) {

		Usuarios.findOne({_id: jwt_payload}, function(err, usuario) {
			  if (err) {
			  		return done(err, false);
			  }
			//   console.log("strategy, usuario, ", usuario)
			  if (usuario) {
					return done(null, usuario);
			  } else {
			  		return done(null, false);
			  }
		  });
	});

	passport.use(strategy);

	return {
		initialize: function() {
			return passport.initialize();
		},

		authenticate: function() {
			return passport.authenticate("jwt", config.jwtSession);
		},
	};
};
