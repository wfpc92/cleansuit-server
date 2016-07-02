var passportJWT = require('passport-jwt');
var Usuarios = require('../models/usuarios');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var config = require("./passport")
 
module.exports = function(passport) {
	var params = {
		secretOrKey: config.jwtSecret,
		jwtFromRequest: ExtractJwt.fromAuthHeader()
	};
	
	var strategy = new Strategy(params, function(jwt_payload, done) {
		console.log("config/auth/strategy/jwt_payload", jwt_payload)
		Usuarios.findOne({_id: jwt_payload._id}, function(err, usuario) {
			  if (err) {
					return done(err, false);
			  }
			  console.log("strategy, user, ", usuario)
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
		}
	};
};