var EliminarProductoCtrl = function($scope, RecursosFactory, $state, $stateParams){
    console.log("EliminarProductoCtrl");

    RecursosFactory  
    .get("/productos/"+$stateParams.id)
    .then(function(respuesta) {
        console.log("EliminarProductoCtrl: ", respuesta)
        $scope.producto = respuesta.data.producto;
    });

    $scope.eliminar = function(){
        RecursosFactory 
        .delete("/productos/"+$stateParams.id, $scope.producto)
        .then(function(respuesta) {
            console.log("EliminarProductoCtrl: eliminar(): ", respuesta);
            $state.go("app.productos");
        });
    }
};

app.controller('EliminarProductoCtrl', EliminarProductoCtrl);