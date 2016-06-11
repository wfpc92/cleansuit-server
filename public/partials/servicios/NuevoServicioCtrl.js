app.controller('NuevoServicioCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
    	$scope.servicio = null;

        $scope.guardar = function(){
            var Servicios = $resource('/servicios');
            Servicios.save($scope.servicio, function(){
                $location.path('/');
            });
        };
    }]);