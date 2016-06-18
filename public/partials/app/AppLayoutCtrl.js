var AppLayoutCtrl = function($scope, AuthService, $state) {
	console.log("AppLayoutCtrl")
    
    if(!AuthService.isAuthenticated()) {
    	$state.go("home.login")
    }
};

app.controller('AppLayoutCtrl', AppLayoutCtrl);
