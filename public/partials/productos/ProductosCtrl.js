app.controller('ProductosCtrl', ['$scope', '$resource',
    function($scope, $resource){
        var Productos = $resource('/productos');
        Productos.query(function(productos){
            $scope.productos = productos;
        });
    }]
);
