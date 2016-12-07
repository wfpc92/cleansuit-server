var EliminarUsuarioCtrl = function($scope, RecursosFactory, $state, $stateParams){
    console.log("EliminarUsuarioCtrl");

    RecursosFactory  
    .get("/usuarios/" + $stateParams.id)
    .then(function(respuesta) {
        console.log("EliminarUsuarioCtrl: ", respuesta)
        $scope.usuario = respuesta.data.usuario;
    });

    $scope.eliminar = function(){
        RecursosFactory 
        .delete("/usuarios/" + $stateParams.id, $scope.usuario)
        .then(function(respuesta) {
            console.log("EliminarUsuarioCtrl: eliminar(): ", respuesta);
            $state.go("app.usuarios");
        });
    }
};

app.controller('EliminarUsuarioCtrl', EliminarUsuarioCtrl);