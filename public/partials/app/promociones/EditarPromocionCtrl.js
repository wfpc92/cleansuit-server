var EditarPromocionCtrl = function($scope,
                                RecursosFactory,
                                $state,
                                $stateParams){
    
    console.log("EditarPromocionCtrl");

    $scope.mensaje = "Editar una promoción";

    RecursosFactory  
    .get("/promociones/"+$stateParams.idPromocion)
    .then(function(respuesta) {
        console.log("EditarPromocionCtrl: ", respuesta)
        $scope.promocion = respuesta.data.promocion;
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
