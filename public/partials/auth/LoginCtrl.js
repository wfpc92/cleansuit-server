var LoginCtrl = function($scope, AuthService, $state) {
	
	$scope.error = null;
	$scope.usuario = {
		correo: "",
		contrasena: ""
	};

	$scope.ingresar = function() {
		AuthService
		.ingresar($scope.usuario)
		.then(function(msg) {
			$state.go('app.inicio');
		}, function(errMsg) {
			$scope.error = errMsg;
		}); 
	};
};

app.controller("LoginCtrl", LoginCtrl);
