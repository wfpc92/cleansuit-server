var EliminarServicioCtrl = function($scope, RecursosFactory, $state, $stateParams){
	
    console.log("EliminarServicioCtrl");
	
	RecursosFactory 
	.get("/servicios/"+$stateParams.id)
	.then(function(respuesta) {
            console.log("EliminarServicioCtrl: ", respuesta);
		$scope.servicio = respuesta.data;
	});

	$scope.eliminar = function(){
		RecursosFactory 
		.delete("/servicios/"+$stateParams.id, $scope.servicio)
		.then(function(respuesta) {
            console.log("EliminarServicioCtrl: eliminar(): ", respuesta);
			$state.go("app.servicios");
		});
	};
};

app.controller('EliminarServicioCtrl', EliminarServicioCtrl);
