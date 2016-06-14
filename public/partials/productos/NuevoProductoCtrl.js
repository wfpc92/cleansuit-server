var NuevoProductoCtrl = function($scope, $resource, $location){
	$scope.producto = null;

    $scope.guardar = function(){
        var Productos = $resource('/productos');
        Productos.save($scope.producto, function(){
            $location.path('/');
        });
    };
};

app.controller('NuevoProductoCtrl', NuevoProductoCtrl);