var EditarSubservicioCtrl = function($scope, $resource, $location, $routeParams){
    $scope.accion = "Editar Subservicio";
    
    var idServicio = $routeParams.idServicio,
        idSubservicio = $routeParams.idSubservicio,
        Subservicio = $resource('/servicios/subservicios/:idSubservicio', 
            {
                idSubservicio: '@_id'
            }, {
                update: { method: 'PUT' }
            });
    
    Subservicio.get({ idSubservicio: idSubservicio }, function(subservicio){
        $scope.subservicio = subservicio;
        $scope.servicio = subservicio._creator;
    });

    $scope.guardar = function(){
        Subservicio.update($scope.subservicio, function(){
            $location.path('/servicios');
        });
    };
};

app.controller('EditarSubservicioCtrl', EditarSubservicioCtrl);
