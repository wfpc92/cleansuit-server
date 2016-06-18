var AppLayoutCtrl = function($scope, AuthService, $state) {
	console.log("AppLayoutCtrl")
    
    if(!AuthService.isAuthenticated()) {
    	$state.go("home.login")
    }

    $scope.logout = function() {
    	AuthService.logout();
    	$state.go("home.inicio");
    };
};

app.controller('AppLayoutCtrl', AppLayoutCtrl);
