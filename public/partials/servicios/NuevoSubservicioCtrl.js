var NuevoSubservicioCtrl = function($scope, $resource, $location, $routeParams){
    var subservicio = {};
    var Servicio = $resource('/servicios/:id');
    
    Servicio.get({ id: $routeParams.id }, function(servicio){
        $scope.servicio = servicio;
    })
    
    $scope.guardar = function(){
        var Subservicios = $resource('/servicios/:id/subservicios', { id: $scope.servicio._id });
        Subservicios.save($scope.subservicio, function(subservicio){
            $location.path('/');
        });        
    };
};

app.controller('NuevoSubservicioCtrl', NuevoSubservicioCtrl);