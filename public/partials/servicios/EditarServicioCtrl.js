app.controller('EditarServicioCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){

        var Servicio = $resource('/servicios/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Servicio.get({ id: $routeParams.id }, function(servicio){
            $scope.servicio = servicio;
        });

        $scope.guardar = function(){
            Servicio.update($scope.servicio, function(){
                $location.path('/');
            });
        }
    }]);
