var HomeLayoutCtrl = function($scope, AuthService, $state) {
	console.log("HomeLayoutCtrl")
	
	if(AuthService.isAuthenticated()) {
		$state.go("app.inicio")
	}
};

app.controller('HomeLayoutCtrl', HomeLayoutCtrl);
