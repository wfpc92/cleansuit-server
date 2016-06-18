var SignupCtrl = function($scope) {
	$scope.error = "";
	$scope.user = {
		name: "",
		email: "",
		password: ""
	};

	$scope.signup = function() {
		
	};
};

app.controller("SignupCtrl", SignupCtrl);