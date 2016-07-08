var PromocionesCtrl = function($scope, RecursosFactory){
    
    console.log("PromocionesCtrl");

    RecursosFactory 
    .get("/promociones")
    .then(function(respuesta) {
    	console.log("PromocionesCtrl: ", respuesta);
    	$scope.promociones = respuesta.data.promociones;
    });
};

app.controller('PromocionesCtrl', PromocionesCtrl);
