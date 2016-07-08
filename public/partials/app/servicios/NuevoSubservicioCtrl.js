var NuevoSubservicioCtrl = function($scope, RecursosFactory, $state, $stateParams){
	var subservicio = {};
	
	$scope.accion = "Nuevo Subservicio";
	
	RecursosFactory 
	.get("/servicios/" + $stateParams.idServicio)
	.then(function(respuesta) {
		console.log(respuesta)
		$scope.servicio = respuesta.data.servicio;
	});

	$scope.guardar = function(){
		RecursosFactory
		.post('/servicios/'+$scope.servicio._id+'/subservicios', $scope.subservicio)
		.then(function(subservicio) {
			console.log(subservicio)
			$state.go('app.servicios');
		});       
	};
};

app.controller('NuevoSubservicioCtrl', NuevoSubservicioCtrl);