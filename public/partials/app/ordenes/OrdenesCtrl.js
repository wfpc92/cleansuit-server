var OrdenesCtrl = function($scope, RecursosFactory) {
	console.log("OrdenesCtrl");    	

	$scope.adignarDomiciliariosEnabled = false;

	RecursosFactory 
    .get("/ordenes")
    .then(function(respuesta) {
    	console.log("OrdenesCtrl: ", respuesta);
    	
    	$scope.domiciliarios = [
    	{
    		_id: "asdasd324sdfsd3",
    		nombre: "wilian"
    	},{
    		_id: "2asdasd324sdfsd3",
    		nombre: "2wilian"
    	}];

    	$scope.ordenes = respuesta.data.ordenes;
    	$scope.ordenes[0].domiciliario_id = $scope.domiciliarios[0];

    	for (var i = 0; i < $scope.ordenes.length; i++) {
    		for (var j = 0; j < $scope.domiciliarios.length; j++) {
	    		if ($scope.ordenes[i].domiciliario_id == $scope.domiciliarios[j]._id) {
	    			$scope.ordenes[i].domiciliario_id = $scope.domiciliarios[j];
	    		}
	    	}	
    	}

    	$scope.adignarDomiciliariosEnabled = true;
    });

   

    $scope.cambio = function(orden) {
    	console.log(orden.domiciliario_id)
    }
};

app.controller('OrdenesCtrl', OrdenesCtrl);
