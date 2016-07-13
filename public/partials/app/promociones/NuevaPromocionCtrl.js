var NuevaPromocionCtrl = function($scope,
								RecursosFactory,
								$state){
	
	console.log("NuevaPromocionCtrl");

	$scope.mensaje = "Crear una promoción";

	RecursosFactory 
    .get("/productos")
    .then(function(respuestaProductos) {
    	RecursosFactory  
	    .get("/servicios/subservicios/all")
	    .then(function(respuestaServicios) {
	        console.log("EditarSubservicioCtrl: ", respuestaServicios);
	        $scope.productosYServicios = respuestaProductos.data.productos.concat( respuestaServicios.data.subservicios)
	        console.log($scope.productosYServicios)
	    });
    });
	
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
