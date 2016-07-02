var Joi = require('joi');
 
module.exports = {
	body: {
		nombre: Joi.string().required(),
		correo: Joi.string().email().required(),
		constrasena: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
	}
};