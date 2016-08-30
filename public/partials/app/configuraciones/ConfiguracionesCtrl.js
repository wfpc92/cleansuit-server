var ConfiguracionesCtrl = function($scope, 
								RecursosFactory){
	
	$scope.configuraciones = {};

	RecursosFactory
	.get("/configuraciones")
	.then(function(respuesta) {
		console.log("ConfiguracionesCtrl",respuesta)
		if(respuesta){
			$scope.configuraciones.domicilio = respuesta.data.configuraciones.domicilio || 0;
		}
	});

	$scope.actualizar = function() {
		RecursosFactory
		.post("/configuraciones", $scope.configuraciones)
		.then(function(respuesta) {
			$scope.mensaje = respuesta.data.mensaje;
		});		
	}
};

app.controller("ConfiguracionesCtrl", ConfiguracionesCtrl)