var EliminarSubservicioCtrl =  function($scope, RecursosFactory, $state, $stateParams){
    
    var idServicio = $stateParams.idServicio,
        idSubservicio = $stateParams.idSubservicio;

    RecursosFactory  
    .get("/servicios/subservicios/"+idSubservicio)
    .then(function(respuesta) {
        console.log("EliminarSubservicioCtrl: ", respuesta);
        $scope.subservicio = respuesta.data.subservicio;
        $scope.servicio = $scope.subservicio._creator;
    });

    $scope.eliminar = function(){
        RecursosFactory 
        .delete("/servicios/subservicios/"+idSubservicio, $scope.subservicio)
        .then(function(respuesta) {
            console.log("EliminarSubservicioCtrl: eliminar():", respuesta)
            $state.go("app.servicios");
        });
    };
};

app.controller('EliminarSubservicioCtrl', EliminarSubservicioCtrl);
