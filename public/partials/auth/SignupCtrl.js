var SignupCtrl = function($scope, AuthService, $state) {
	$scope.error = "";
	$scope.usuario = {
		nombre: "",
		correo: "",
		contrasena: ""
	};

	$scope.registrar = function() {
		AuthService
		.registrar($scope.usuario)
		.then(function(msg) {
			$state.go('app.inicio');
		}, function(errMsg) {
			$scope.error = errMsg;
		});
	};
};

app.controller("SignupCtrl", SignupCtrl);