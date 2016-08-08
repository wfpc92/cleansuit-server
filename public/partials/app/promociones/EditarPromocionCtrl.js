var EditarPromocionCtrl = function($scope,
                                RecursosFactory,
                                $state,
                                $stateParams){
    
    console.log("EditarPromocionCtrl");

    $scope.mensaje = "Editar una promoción";
    $scope.inputRangoFechaHora = typeof $ !== 'undefined' ? $('input[name="daterange"]') : {};

    RecursosFactory  
    .get("/promociones/"+$stateParams.idPromocion)
    .then(function(respuesta) {
        console.log("EditarPromocionCtrl: ", respuesta)
        $scope.promocion = respuesta.data.promocion;
        
        var optDRP = {
            startDate: Date.now(),
            endDate: Date.now(),
            timePicker: true,
            timePickerIncrement: 5,
            locale: {
                format: 'DD/MM/YYYY h:mm A'
            }
        };

        if($scope.promocion.fecha_inicio 
            && $scope.promocion.fecha_fin) {
            $scope.promocion.fecha_inicio = new Date($scope.promocion.fecha_inicio);
            $scope.promocion.fecha_fin = new Date($scope.promocion.fecha_fin);
            optDRP.startDate =  $scope.promocion.fecha_inicio;
            optDRP.endDate = $scope.promocion.fecha_fin;
        }

        if(typeof $ !== 'undefined') { 

            //DateRangePicker colocar los valores por defecto o para editar de la promocion. fuente: http://www.daterangepicker.com/
            $scope.inputRangoFechaHora
            .daterangepicker(optDRP, function(start, end, label) {
                $scope.promocion.fecha_inicio = start.utc().format();
                $scope.promocion.fecha_fin = end.utc().format();
            });
        }
    });

    RecursosFactory 
    .get("/productos")
    .then(function(respuestaProductos) {
        RecursosFactory  
        .get("/servicios/subservicios/all")
        .then(function(respuestaServicios) {
            $scope.productosYServicios = respuestaProductos.data.productos.concat( respuestaServicios.data.subservicios)
        });
    });

    $scope.guardar = function(){
        $scope.error = "";
        
        RecursosFactory 
        .put("/promociones/"+$stateParams.idPromocion, $scope.promocion)
        .then(function(respuesta) {
            console.log("EditarPromocionCtrl: guardar(): ", respuesta);
                
            if(respuesta.data.success){
                $state.go("app.promociones");
            } else {
                console.log("EditarPromocionCtrl.guardar(), err", respuesta.data.error)
                $scope.error = respuesta.data.mensaje;
            }
        }, function(err){
            console.log("EditarPromocionCtrl.guardar(), err", err)
            $scope.error = err.errmsg
        });
    }
};

app.controller('EditarPromocionCtrl', EditarPromocionCtrl);
