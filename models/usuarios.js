// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
require('mongoose-type-email');
var bcrypt   = require('bcrypt');
var jwt         = require('jwt-simple');
var config = require("../config/passport");

// set up a mongoose model
var UsuariosSchema = new mongoose.Schema({
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
  	fb_uid: {
  		type: String
  	}
});

UsuariosSchema.pre('save', function (next) {
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
 
UsuariosSchema.methods.comparePassword = function (contrasenaRecibida, cb) {
	console.log("Usuarios.comparePassword()")
	bcrypt.compare(contrasenaRecibida, this.contrasena, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

UsuariosSchema.methods.getInfo = function(info) {
	var token = jwt.encode(this._id, config.jwtSecret);

	var usuario = {
		nombre: this.nombre, 
		correo: this.correo,
		rol: this.rol,
		token: 'JWT ' + token,
		fb: this.fb_uid ? true : false
	};

	switch(this.rol) {
		case "cliente":
			if (info) {
				usuario.direccion = (info.direccion) ? info.direccion : "";
				usuario.telefono = (info.telefono) ? info.telefono : "";
				usuario.url_foto = (info.url_foto) ? info.url_foto : "";
			} else {
				usuario.direccion = "";
				usuario.telefono = "";
				usuario.url_foto = "";
			}
			break;
	}

	return usuario;
};



module.exports = mongoose.model('Usuarios', UsuariosSchema);
