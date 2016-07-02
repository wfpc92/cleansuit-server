// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
require('mongoose-type-email');
var bcrypt   = require('bcrypt');

// set up a mongoose model
var UsuarioSchema = new mongoose.Schema({
	nombre: {
		type: String,
		required: true
	},
	correo: {
		type: mongoose.SchemaTypes.Email,
		unique: true,
		required: true
	},
	contrasena: {
		type: String,
		required: true
	},
  	rol: {
  		type: String, 
  		enum: ['gerente', 'admin_sede', 'recepcionista', 'procesos', 'domiciliario', 'cliente']
  	},
});

UsuarioSchema.pre('save', function (next) {
	var usuario = this;
	if (this.isModified('contrasena') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(usuario.contrasena, salt, function (err, hash) {
				if (err) {
					return next(err);
				}
				usuario.contrasena = hash;
				next();
			});
		});
	} else {
		return next();
	}
});
 
UsuarioSchema.methods.comparePassword = function (contrasenaRecibida, cb) {
	bcrypt.compare(contrasenaRecibida, this.contrasena, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
