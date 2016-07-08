var ServiciosCtrl = function ($scope, RecursosFactory){
    
    console.log("ServiciosCtrl");

    RecursosFactory 
    .get("/servicios")
    .then(function(respuesta) {
    	console.log("ServiciosCtrl: ", respuesta);
    	$scope.servicios = respuesta.data.servicios;
    });
};

app.controller('ServiciosCtrl', ServiciosCtrl);
