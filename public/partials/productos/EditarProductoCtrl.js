
app.controller('EditarProductoCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){

        var Producto = $resource('/productos/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Producto.get({ id: $routeParams.id }, function(producto){
            $scope.producto = producto;
        });

        $scope.guardar = function(){
            Producto.update($scope.producto, function(){
                $location.path('/');
            });
        }
    }]);
