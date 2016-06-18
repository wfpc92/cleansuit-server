var UsuariosCtrl = function($scope, RecursosFactory){
    
    console.log("UsuariosCtrl");

    RecursosFactory 
    .get("/users")
    .then(function(respuesta) {
    	console.log("UsuariosCtrl: ", respuesta);
    	$scope.usuarios = respuesta.data;
    });
};

app.controller('UsuariosCtrl', UsuariosCtrl);
