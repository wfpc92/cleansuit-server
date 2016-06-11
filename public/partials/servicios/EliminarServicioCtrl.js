app.controller('EliminarServicioCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Servicio = $resource('/servicios/:id');

        Servicio.get({ id: $routeParams.id }, function(servicio){
            $scope.servicio = servicio;
        })

        $scope.eliminar = function(){
            Servicio.delete({ id: $routeParams.id }, function(servicio){
                $location.path('/');
                console.log("eliminado: ", servicio);
            });
        }
    }]);
