var NuevaPromocionCtrl = function($scope,
								RecursosFactory,
								$state){
	
	console.log("NuevaPromocionCtrl");

	$scope.mensaje = "Crear una promoción";
	$scope.promocion = {};


	RecursosFactory 
    .get("/productos")
    .then(function(respuestaProductos) {
    	RecursosFactory  
	    .get("/servicios/subservicios/all")
	    .then(function(respuestaServicios) {
	        $scope.productosYServicios = respuestaProductos.data.productos.concat( respuestaServicios.data.subservicios);
	    });
    });
	
    $scope.guardar = function(){
		$scope.error = "";
    	
        RecursosFactory
		.post('/promociones', $scope.promocion)
		.then(function(respuesta) {
			if(respuesta.data.success){
			console.log("NuevaPromocionCtrl.guardar()", respuesta);
			$state.go('app.promociones');
			} else {
				console.log("NuevaPromocionCtrl.guardar(), err", respuesta.data.error)
				$scope.error = respuesta.data.mensaje;
			}
		}, function(err){
			console.log("NuevaPromocionCtrl.guardar(), err", err)
			$scope.error = err.errmsg
		});
    };
};

app.controller('NuevaPromocionCtrl', NuevaPromocionCtrl);
