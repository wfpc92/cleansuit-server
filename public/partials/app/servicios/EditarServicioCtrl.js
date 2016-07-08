var EditarServicioCtrl = function($scope, RecursosFactory, $state, $stateParams){

	console.log("EditarServicioCtrl")

	RecursosFactory  
	.get("/servicios/"+$stateParams.idServicio)
	.then(function(respuesta) {
		console.log(respuesta)
		$scope.servicio = respuesta.data.servicio;
	});

	$scope.guardar = function(){
		RecursosFactory 
		.put("/servicios/"+$stateParams.idServicio, $scope.servicio)
		.then(function(respuesta) {
			console.log("EditarServicioCtrl: guardar(): ", respuesta)
			$state.go("app.servicios");
		});
	}
}

app.controller('EditarServicioCtrl', EditarServicioCtrl);
