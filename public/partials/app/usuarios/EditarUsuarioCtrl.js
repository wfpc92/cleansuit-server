var EditarUsuarioCtrl = function($scope, RecursosFactory, $state, $stateParams){
	
	console.log("EditarUsuarioCtrl");
	$scope.selected = "";

	RecursosFactory
	.get('/roles')
	.then(function(respuesta) {
		console.log("EditarUsuarioCtrl.getRoles: ", respuesta);
		if(respuesta.data.roles) {
			$scope.roles = respuesta.data.roles;

			RecursosFactory  
		    .get("/usuarios/" + $stateParams.id)
		    .then(function(respuesta) {
		        console.log("EditarUsuarioCtrl: getUSuario", respuesta)
		        $scope.usuario = respuesta.data.usuario;
		    });
		}
	}, function(err){
		$scope.roles = ['gerente', 'admin_sede', 'recepcionista', 'procesos', 'domiciliario', 'cliente'];
	});

    $scope.guardar = function(){
        RecursosFactory 
        .put("/usuarios/" + $stateParams.id, $scope.usuario)
        .then(function(respuesta) {
            console.log("EditarUsuarioCtrl: guardar(): ", respuesta);
            $state.go("app.usuarios");
        });
    };
};

app.controller('EditarUsuarioCtrl', EditarUsuarioCtrl);