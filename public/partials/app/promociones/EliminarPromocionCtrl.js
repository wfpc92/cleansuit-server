var EliminarPromocionCtrl = function($scope, 
                                    RecursosFactory,
                                    $state,
                                    $stateParams){

    console.log("EliminarPromocionCtrl");

    RecursosFactory  
    .get("/promociones/"+$stateParams.idPromocion)
    .then(function(respuesta) {
        console.log("EliminarPromocionCtrl: ", respuesta)
        $scope.promocion = respuesta.data.promocion;
    });

    $scope.eliminar = function(){
        RecursosFactory 
        .delete("/promociones/"+$stateParams.idPromocion, $scope.promocion)
        .then(function(respuesta) {
            console.log("EliminarPromocionCtrl: eliminar(): ", respuesta);
            $state.go("app.promociones");
        });
    }
};

app.controller('EliminarPromocionCtrl', EliminarPromocionCtrl);
