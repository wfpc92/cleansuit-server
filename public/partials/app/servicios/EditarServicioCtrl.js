var EditarServicioCtrl = function($scope, RecursosFactory, $state, $stateParams){

	console.log("EditarServicioCtrl")

	RecursosFactory  
	.get("/servicios/"+$stateParams.id)
	.then(function(respuesta) {
		console.log(respuesta)
		$scope.servicio = respuesta.data;
	});

	$scope.guardar = function(){
		RecursosFactory 
		.put("/servicios/"+$stateParams.id, $scope.servicio)
		.then(function(respuesta) {
			console.log("EditarServicioCtrl: guardar(): ", respuesta)
			$scope.servicio = respuesta.data;
			$state.go("app.servicios");
		});
	}
}

app.controller('EditarServicioCtrl', EditarServicioCtrl);
