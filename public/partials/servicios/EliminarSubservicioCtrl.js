var EliminarSubservicioCtrl =  function($scope, $resource, $location, $routeParams){
    var Subservicio = $resource('/servicios/subservicios/:idSubservicio');

    var idServicio = $routeParams.idServicio,
        idSubservicio = $routeParams.idSubservicio;

    console.log(idSubservicio)
    Subservicio.get({ idSubservicio: idSubservicio }, function(subservicio){ 
        console.log(subservicio)
        $scope.subservicio = subservicio;
        $scope.servicio = subservicio._creator;
    });

    $scope.eliminar = function(){
        Subservicio.delete({ idSubservicio: idSubservicio }, function(subservicio){
            $location.path('/servicios');
            console.log("subservicio eliminado: ", subservicio);
        });
    };
};

app.controller('EliminarSubservicioCtrl', EliminarSubservicioCtrl);
