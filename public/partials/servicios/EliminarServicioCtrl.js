var EliminarServicioCtrl = function($scope, $resource, $location, $routeParams){
    var Servicio = $resource('/servicios/:id'); 

    Servicio.get({ id: $routeParams.id }, function(servicio){
        $scope.servicio = servicio;
    });

    $scope.eliminar = function(){
        Servicio.delete({ id: $routeParams.id }, function(servicio){
            $location.path('/servicios');
            console.log("servicio eliminado: ", servicio);
        });
    }
};

app.controller('EliminarServicioCtrl', EliminarServicioCtrl);
