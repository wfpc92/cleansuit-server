var EditarProductoCtrl = function($scope, RecursosFactory, $state, $stateParams){
    
    console.log("EditarProductoCtrl");

    RecursosFactory  
    .get("/productos/"+$stateParams.id)
    .then(function(respuesta) {
        console.log("EditarProductoCtrl: ", respuesta)
        $scope.producto = respuesta.data;
    });

    $scope.guardar = function(){
        RecursosFactory 
        .put("/productos/"+$stateParams.id, $scope.producto)
        .then(function(respuesta) {
            console.log("EditarProductoCtrl: guardar(): ", respuesta);
            $scope.servicio = respuesta.data;
            $state.go("app.productos");
        });
    }
};

app.controller('EditarProductoCtrl', EditarProductoCtrl);
