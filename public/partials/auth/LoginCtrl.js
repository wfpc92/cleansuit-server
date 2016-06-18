var LoginCtrl = function($scope, AuthService, $state) {
	$scope.error = "";
	$scope.user = {
		email: "",
		password: ""
	};

	$scope.login = function() {
		AuthService.login($scope.user).then(function(msg) {
			$state.go('app.inicio');
		}, function(errMsg) {
			console.log(errMsg)
		}); 
	};
};

app.controller("LoginCtrl", LoginCtrl);
