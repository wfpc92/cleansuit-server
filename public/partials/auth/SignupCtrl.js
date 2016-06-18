var SignupCtrl = function($scope, AuthService, $state) {
	$scope.error = "";
	$scope.user = {
		name: "",
		email: "",
		password: ""
	};

	$scope.signup = function() {
		AuthService.register($scope.user).then(function(msg) {
			$state.go('app.inicio');
		}, function(errMsg) {
			alert(errMsg)
		});
	};
};

app.controller("SignupCtrl", SignupCtrl);