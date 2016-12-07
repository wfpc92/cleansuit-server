var NuevoUsuarioCtrl = function($scope, RecursosFactory, $state){
	
	console.log("NuevoUsuarioCtrl");

	$scope.usuario = {};
	$scope.roles = [];

	RecursosFactory
	.get('/roles')
	.then(function(respuesta) {
		console.log("NuevoUsuarioCtrl.getRoles: ", respuesta);
		if(respuesta.data.roles) {
			$scope.roles = respuesta.data.roles;
			$scope.usuario.rol = $scope.roles[0];
		}
	}, function(err){
		$scope.roles = ['gerente', 'admin_sede', 'recepcionista', 'procesos', 'domiciliario', 'cliente'];
	});

    $scope.guardar = function(){
        RecursosFactory
		.post('/usuarios', $scope.usuario)
		.then(function(respuesta) {
			console.log("NuevoUsuarioCtrl: ", respuesta);
		});
    };
};

app.controller('NuevoUsuarioCtrl', NuevoUsuarioCtrl);