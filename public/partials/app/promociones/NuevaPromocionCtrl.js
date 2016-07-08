var NuevaPromocionCtrl = function($scope,
								RecursosFactory,
								$state){
	
	console.log("NuevaPromocionCtrl");

	$scope.mensaje = "Crear una promoción";
	
    $scope.guardar = function(){
        RecursosFactory
		.post('/promociones', $scope.promocion)
		.then(function(respuesta) {
			console.log("NuevoPromocionCtrl: ", respuesta);
			$state.go('app.promociones');
		});
    };
};

app.controller('NuevaPromocionCtrl', NuevaPromocionCtrl);
