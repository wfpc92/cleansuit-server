var NuevaPromocionCtrl = function($scope,
								RecursosFactory,
								$state){
	
	console.log("NuevaPromocionCtrl");

	$scope.mensaje = "Crear una promoción";
	$scope.promocion = {
		fecha_inicio: new Date('2016/08/01'),
		fecha_fin: new Date('2016/08/30')
	};
	
	console.log($scope.promocion.fecha_fin)
	$scope.inputRangoFechaHora = typeof $ !== 'undefined' ? $('input[name="daterange"]') : {};
	
	var optDRP = {
        startDate: Date.now(),
        endDate: Date.now(),
        timePicker: true,
        timePickerIncrement: 5,
        locale: {
            format: 'DD/MM/YYYY h:mm A'
        }
    };

    if(typeof $ !== 'undefined') {
	    //DateRangePicker fuente: http://www.daterangepicker.com/
	    $scope.inputRangoFechaHora
	    .daterangepicker(optDRP, function(start, end, label) {
	        $scope.promocion.fecha_inicio = start.utc().format();
	        $scope.promocion.fecha_fin = end.utc().format();
	    });
	}

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

		console.log($scope.promocion);

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
