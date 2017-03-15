var mongoose = require('mongoose');

var VersionAppSchema = new mongoose.Schema({
	inventario: {
		type: Number,
		required: true,
		default: 0
	},
	configuraciones: {
		type: Number,
		required: true,
		default: 0
	}
},{
    timestamps: true
});

VersionAppSchema.statics.singleton = function(cb) {
	var self = this;
	self.find(function(err, versionAppLst) {
		var versionApp;

		if(versionAppLst.length !== 0){
			versionApp = versionAppLst[0];
		} else {
			versionApp = new self();
		}

		if(cb) {
			cb(versionApp);
		}

		versionApp.save();
	});
};

module.exports = mongoose.model('VersionApp', VersionAppSchema);
