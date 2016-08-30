var mongoose = require('mongoose');

var VersionesOrdenesSchema   = new mongoose.Schema({
	usuario_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuarios',
		unique: true,
	},
	version: {
		type: Number,
		required: true,
		default: 0
	}
},{
    timestamps: true
});

VersionesOrdenesSchema.statics.actualizar = function(usuario_id, cb) {
	var self = this;

	self.findOne({usuario_id: usuario_id}, function(err, v) {
		if(err) {console.log("error"); return;}

		if(!v) {
			v = new self();
			v.usuario_id = usuario_id;
			v.version = 0;
		} else {
			v.version += 1;
		}

		v.save(function(err) {
			if(cb) {
				cb(v);
			}
		});
	});
};

VersionesOrdenesSchema.statics.getVersion = function(usuario_id, cb) {
	var self = this;

	self.findOne({usuario_id: usuario_id}, function(err, v) {
		if(err) {console.log("error"); return;}

		if(!v) {
			v = new self();
			v.usuario_id = usuario_id;
			v.version = 0;
			v.save(function(err) {
				if(cb) {
					cb(v);
				}
			});
		} 

		if(cb) {
			cb(v);
		}
	});
};

module.exports = mongoose.model('VersionesOrdenes', VersionesOrdenesSchema);
