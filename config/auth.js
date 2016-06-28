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
		console.log("config/auth/strategy/jwt_payload", jwt_payload)
		User.findOne({_id: jwt_payload._id}, function(err, user) {
			  if (err) {
					return done(err, false);
			  }
			  console.log("strategy, user, ", user)
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