var NuevoSubservicioCtrl = function($scope, RecursosFactory, $state, $stateParams){
	var subservicio = {};
	$scope.accion = "Nuevo Subservicio";
	
	console.log($stateParams.id)
	RecursosFactory 
	.get("/servicios/" + $stateParams.id)
	.then(function(respuesta) {
		console.log(respuesta)
		$scope.servicio = respuesta.data;
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