var OrdenesCtrl = function($scope, RecursosFactory) {
	console.log("OrdenesCtrl");     

	$scope.asignarDomiciliariosEnabled = false;

	var enlazarDomiciliarios = function() {
		for (var i = 0; i < $scope.ordenes.length; i++) {
			for (var j = 0; j < $scope.domiciliarios.length; j++) {
				if ($scope.ordenes[i].domiciliario_recoleccion_id == $scope.domiciliarios[j]._id) {
					$scope.ordenes[i].domiciliario_recoleccion_id = $scope.domiciliarios[j];
				}
				if ($scope.ordenes[i].domiciliario_entrega_id == $scope.domiciliarios[j]._id) {
					$scope.ordenes[i].domiciliario_entrega_id = $scope.domiciliarios[j];
				}
			}
		}
	};

	RecursosFactory 
	.get("/ordenes")
	.then(function(respuesta) {
		console.log("OrdenesCtrl.getOrdenes(): ", respuesta);
		$scope.ordenes = respuesta.data.ordenes;
		
		RecursosFactory 
		.get("/domiciliarios")
		.then(function(respuesta) {
			console.log("OrdenesCtrl.getDomiciliarios(): ", respuesta);
			$scope.domiciliarios = respuesta.data.domiciliarios;
			//enlazar <select> de domiciliarios de las ordenes.
			enlazarDomiciliarios();
			$scope.asignarDomiciliariosEnabled = true;
		});
	});

	$scope.asignarDomiciliarioRecoleccion = function(orden, index) {
		$scope.asignarDomiciliariosEnabled = false;
		
		RecursosFactory 
		.put("/ordenes/" + orden._id, orden)
		.then(function(respuesta) {
			console.log("OrdenesCtrl.asignarDomiciliarioRecoleccion(): ", respuesta);
			$scope.ordenes[index] = respuesta.data.orden;
			enlazarDomiciliarios();
		})
		.finally(function(){
			$scope.asignarDomiciliariosEnabled = true;
		});
	};

	$scope.asignarDomiciliarioEntrega = function(orden, index) {
		$scope.asignarDomiciliariosEnabled = false;
		
		RecursosFactory 
		.put("/ordenes/" + orden._id, orden)
		.then(function(respuesta) {
			console.log("OrdenesCtrl.asignarDomiciliarioEntrega(): ", respuesta);
			$scope.ordenes[index] = respuesta.data.orden;
			enlazarDomiciliarios();
		})
		.finally(function(){
			$scope.asignarDomiciliariosEnabled = true;
		});
	};
};

app.controller('OrdenesCtrl', OrdenesCtrl);
