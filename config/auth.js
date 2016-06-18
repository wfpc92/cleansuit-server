var passportJWT = require('passport-jwt');
var User = require('../models/user');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var config = require("./passport")
 
module.exports = function(passport) {
	var params = {
		secretOrKey: config.jwtSecret,
		jwtFromRequest: ExtractJwt.fromAuthHeader()
	};
	
	var strategy = new Strategy(params, function(jwt_payload, done) {
		User.findOne({id: jwt_payload.id}, function(err, user) {
			  if (err) {
					return done(err, false);
			  }
			  if (user) {
					return done(null, user);
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