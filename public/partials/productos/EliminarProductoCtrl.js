app.controller('EliminarProductoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Producto = $resource('/productos/:id');

        Producto.get({ id: $routeParams.id }, function(producto){
            $scope.producto = producto;
        })

        $scope.eliminar = function(){
            Producto.delete({ id: $routeParams.id }, function(producto){
                $location.path('/');
                console.log("eliminado: ", producto)
            });
        }
    }]);
