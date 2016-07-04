var AuthService = function($q, $http) {
	var LOCAL_TOKEN_KEY = 'CleanSuitTokenKey';
	var isAuthenticated = false;
	var authToken;
 
	function loadUserCredentials() {
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		console.log("----------token-----------")
		console.log("token: ",token)
			
		if (token) {
			useCredentials(token);
		}
	}
 
	function storeUserCredentials(token) {
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		useCredentials(token);
	}
 
	function useCredentials(token) {
		isAuthenticated = true;
		authToken = token;
 
		// Set the token as header for your requests!
		$http.defaults.headers.common.Authorization = authToken;
	}
 
	function destroyUserCredentials() {
		authToken = undefined;
		isAuthenticated = false;
		$http.defaults.headers.common.Authorization = undefined;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);
	}
 
	var registrar = function(user) {
		return $q(function(resolve, reject) {
			$http.post('/registrar', user).then(function(result) {
				console.log(result.data)
				if (result.data.success) {
					storeUserCredentials(result.data.usuario.token);
					resolve(result.data.mensaje);
				} else {
					reject(result.data.mensaje);
				}
			});
		});
	}; 
 
	var ingresar = function(user) {
		return $q(function(resolve, reject) {
			$http.post('/ingresar', user).then(function(result) {
				console.log(result.data)
				if (result.data.success) {
					storeUserCredentials(result.data.usuario.token);
					resolve(result.data.mensaje);
				} else {
					reject(result.data.mensaje);
				}
			});
		});
	};
 
	var logout = function() {
		destroyUserCredentials();
	};
 
	loadUserCredentials();
 
	return {
		ingresar: ingresar,
		registrar: registrar,
		logout: logout,
		isAuthenticated: function() {return isAuthenticated;},
	};
};

app.service('AuthService', AuthService);