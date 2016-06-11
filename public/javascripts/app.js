
var app = angular.module('CleanSuit', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: "partials/home.html",
            controller: 'HomeCtrl'
        })

        .when('/servicios', {
            templateUrl: 'partials/servicios/servicios.html',
            controller: 'ServiciosCtrl'
        })
        .when('/servicios/nuevo', {
            templateUrl: 'partials/servicios/form-servicio.html',
            controller: 'NuevoServicioCtrl'
        })
        .when('/servicios/editar/:id', {
            templateUrl: 'partials/servicios/form-servicio.html',
            controller: 'EditarServicioCtrl'
        })
        .when('/servicios/eliminar/:id', {
            templateUrl: 'partials/servicios/eliminar-servicio.html',
            controller: 'EliminarServicioCtrl'
        })

        .when('/servicios/:id/subservicios/nuevo', {
            templateUrl: 'partials/servicios/form-subservicio.html', 
            controller: 'NuevoSubservicioCtrl'
        })



        .when('/productos', {
            templateUrl: 'partials/productos/productos.html',
            controller: 'ProductosCtrl'

        })
        .when('/productos/nuevo', {
            templateUrl: 'partials/productos/form-producto.html',
            controller: 'NuevoProductoCtrl'

        })
        .when('/productos/editar/:id', {
            templateUrl: 'partials/productos/form-producto.html',
            controller: 'EditarProductoCtrl'
        })
        .when('/productos/eliminar/:id', {
            templateUrl: 'partials/productos/eliminar-producto.html',
            controller: 'EliminarProductoCtrl'
        })


        

        /*.when('/servicios/:id/subservicios/nuevo', {
            templateUrl: 'partials/servicios/form-subservicio.html',
            controller: 'EditarServicioCtrl'
        })*/

        .otherwise({
            redirectTo: '/'
        });
}]);




