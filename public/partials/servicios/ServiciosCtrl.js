app.controller('ServiciosCtrl', ['$scope', '$resource',
    function($scope, $resource){
        var Servicios = $resource('/servicios');
        Servicios.query(function(servicios){
            $scope.servicios = servicios;
        });
    }]
);
