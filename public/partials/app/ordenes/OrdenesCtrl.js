var OrdenesCtrl = function($scope, RecursosFactory) {
	console.log("OrdenesCtrl");

	RecursosFactory 
    .get("/ordenes")
    .then(function(respuesta) {
    	console.log("OrdenesCtrl: ", respuesta);
    	$scope.ordenes = respuesta.data.ordenes;
    });
};

app.controller('OrdenesCtrl', OrdenesCtrl);
