var NuevoProductoCtrl = function($scope, RecursosFactory, $state){
	
	console.log("NuevoProductoCtrl");

    
    $scope.guardar = function(){
        RecursosFactory
		.post('/productos', $scope.producto)
		.then(function(respuesta) {
			console.log("NuevoProductoCtrl: ", respuesta);
			$state.go('app.productos');
		});
    };
};

app.controller('NuevoProductoCtrl', NuevoProductoCtrl);