var fs = require('fs');

module.exports = function() {
	var path = "./public/updates";

	if (!fs.existsSync(path)) {
	    fs.mkdirSync(path, 0744);
	}	
};
