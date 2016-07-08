var ProductosCtrl = function($scope, RecursosFactory){
    
    console.log("ProductosCtrl");

    RecursosFactory 
    .get("/productos")
    .then(function(respuesta) {
    	console.log("ProductosCtrl: ", respuesta);
    	$scope.productos = respuesta.data.productos;
    });
};

app.controller('ProductosCtrl', ProductosCtrl);
