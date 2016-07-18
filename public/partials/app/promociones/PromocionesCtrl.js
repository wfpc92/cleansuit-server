var PromocionesCtrl = function($scope, RecursosFactory){
    
    console.log("PromocionesCtrl");

    RecursosFactory 
    .get("/promociones")
    .then(function(respuesta) {
    	console.log("PromocionesCtrl: ", respuesta);
    	$scope.promociones = respuesta.data.promociones;
    });

    RecursosFactory 
    .get("/productos")
    .then(function(respuestaProductos) {
    	RecursosFactory  
	    .get("/servicios/subservicios/all")
	    .then(function(respuestaServicios) {
	        $scope.productosYServicios = respuestaProductos.data.productos.concat( respuestaServicios.data.subservicios);
	    });
    });

    $scope.getItemById = function(id){
    	for (var i in $scope.productosYServicios) {
    		if($scope.productosYServicios[i]._id == id){
    			return $scope.productosYServicios[i];
    		}
    	}
    	return {};
    }
};

app.controller('PromocionesCtrl', PromocionesCtrl);
