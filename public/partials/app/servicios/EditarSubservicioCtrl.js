var EditarSubservicioCtrl = function($scope, RecursosFactory, $state, $stateParams){
    $scope.accion = "Editar Subservicio";
     
    var idServicio = $stateParams.idServicio,
        idSubservicio = $stateParams.idSubservicio;

    RecursosFactory  
    .get("/servicios/subservicios/"+idSubservicio)
    .then(function(respuesta) {
        console.log("EditarSubservicioCtrl: ", respuesta);
        $scope.subservicio = respuesta.data.subservicio;
        $scope.servicio = $scope.subservicio._creator;
    });

    $scope.guardar = function(){
        RecursosFactory 
        .put("/servicios/subservicios/"+idSubservicio, $scope.subservicio)
        .then(function(respuesta) {
            console.log("EditarSubservicioCtrl: guardar():", respuesta)
            $scope.subservicio = respuesta.data;
            $state.go("app.servicios");
        });
    };
};

app.controller('EditarSubservicioCtrl', EditarSubservicioCtrl);
