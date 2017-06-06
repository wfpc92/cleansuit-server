// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
require('mongoose-type-email');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var config = require("../config/passport");

var ROLES = ['superadmin', 'gerente', 'admin_sede', 'recepcionista', 'trabajador', 'domiciliario', 'cliente'];

// set up a mongoose model
var UsuariosSchema = new mongoose.Schema({
	nombre: {
		type: String,
	},
	docId: {
		type: String,
	},
	correo: {
		type: String,
		unique: true
	},
	contrasena: {
		type: String,
	},
	pass_token: String,  // Recuperar contraseña: token
	pass_token_vence: Date,  // Recuperar contraseña: fecha y hora de vencimiento

	rol: {
		type: String,
		enum: ROLES,
		required: true
	},

	facebook: String,

	profile: {
		direccion: String,
		telefono: String,
		url_foto: String,
	}
}, {
	timestamps: true
});

UsuariosSchema.pre('save', function (next) {
	var usuario = this;

	if ((typeof usuario.contrasena != 'undefined') && (this.isModified('contrasena') || this.isNew)) {
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
	// console.log("Usuarios.comparePassword()")
	bcrypt.compare(contrasenaRecibida, this.contrasena, function (err, isMatch) {
		// console.log(err, isMatch)
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

UsuariosSchema.methods.getInfo = function() {
	var token = jwt.encode(this._id, config.jwtSecret);

	return {
		nombre: this.nombre || '',
		docId: this.docId || '',
		correo: this.correo || '',
		rol: this.rol || '',
		token: 'JWT ' + token,
		fb: this.facebook ? true : false,
		direccion: this.profile.direccion ? this.profile.direccion : '',
		telefono: this.profile.telefono ? this.profile.telefono : '',
		url_foto: this.profile.url_foto ? this.profile.url_foto : '',
	};
};

UsuariosSchema.statics.ROLES = ROLES;

module.exports = mongoose.model('Usuarios', UsuariosSchema);
