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

    $scope.guardar = function(){
        RecursosFactory 
        .put("/promociones/"+$stateParams.idPromocion, $scope.promocion)
        .then(function(respuesta) {
            console.log("EditarPromocionCtrl: guardar(): ", respuesta);
            $state.go("app.promociones");
        });
    }
};

app.controller('EditarPromocionCtrl', EditarPromocionCtrl);
