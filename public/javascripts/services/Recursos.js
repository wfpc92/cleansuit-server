var RecursosFactory = function($log, $http) {
	var self = this;
	this.$log = $log;
	this.$http = $http;
	this._apiUrl = "";

	$log.debug("Contructor de RecursosApi");

	this.solicitud = function(metodo, recurso, getParams, postParams) {
		console.log("solicitud para consumir servicio de api cleansuit");

		var requestConfig = {
			url: self._apiUrl + recurso, 
			method: metodo,
			params: getParams,
			data: postParams
		};

		console.log("requestConfig: ", JSON.stringify(requestConfig))
		return $http(requestConfig);
	}

	return {
		get: function(recursos, params) {
			return self.solicitud("GET", recursos, params, null);	
		},
		post: function(recursos, params) {
			return self.solicitud("POST", recursos, null, params);	
		},
		put: function(recursos, params) {
			return self.solicitud("PUT", recursos, null, params);	
		},
		delete: function(recursos, params) {
			return self.solicitud("DELETE", recursos, null, params);	
		}
	};
};


app.factory("RecursosFactory", RecursosFactory);
