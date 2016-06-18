var NuevoServicioCtrl = function($scope, RecursosFactory, $state){
	$scope.servicio = null;

	$scope.guardar = function(){
		RecursosFactory
		.post('/servicios', $scope.servicio)
		.then(function(respuesta) {
			console.log("NuevoProductoCtrl: ", respuesta);
			$state.go('app.servicios');
		});
	};
}; 

app.controller('NuevoServicioCtrl', NuevoServicioCtrl);