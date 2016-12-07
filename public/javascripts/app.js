
var app = angular.module('CleanSuit', ['ui.router', 'daterangepicker']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '/home',
            abstract: true,
            templateUrl: "partials/layout.html",
            controller: 'HomeLayoutCtrl'
        })
        .state('home.inicio', {
            url: '/inicio',
            views: {
                "contenedor": {
                    templateUrl: "partials/inicio.html",
                    controller: 'HomeInicioCtrl'
                }
            }
        })
        .state('home.about', {
            url: '/about',
            views: {
                "contenedor": {
                    templateUrl: "partials/about.html"
                }
            }
        })

        //AUTH
        .state('home.signup', {
            url:'/signup',
            views: {
                "contenedor": {
                    templateUrl: "partials/auth/signup.html",
                    controller: "SignupCtrl"
                }
            }
        })
        .state('home.login', {
            url:'/login',
            views: {
                "contenedor": {
                    templateUrl: "partials/auth/login.html",
                    controller: "LoginCtrl"
                }
            }
        })
        .state('home.profile', {
            url:'/profile',
            views: {
                "contenedor": {
                    templateUrl: "partials/auth/profile.html",
                    controller: "ProfileCtrl"
                }
            }
        })




        //APP
        .state('app',{
            url:'/app',
            abstract: true,
            templateUrl: 'partials/app/layout.html',
            controller: 'AppLayoutCtrl'
        })
        .state('app.inicio',{
            url:'/inicio',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/inicio.html',
                    //controller: 'AppInicioCtrl'
                }
            }
        })
        

        /**
         * PROMOCIONES
         */
        .state('app.promociones', {
            url:'/promociones',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/promociones/promociones.html',
                    controller: 'PromocionesCtrl'
                }
            }

        })
        .state('app.promociones-nueva', {
            url:'/promociones/nueva',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/promociones/form-promocion.html',
                    controller: 'NuevaPromocionCtrl'
                }
            }

        })
        .state('app.promociones-editar', {
            url:'/promociones/editar/:idPromocion',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/promociones/form-promocion.html',
                    controller: 'EditarPromocionCtrl'
                }
            }
        })
        .state('app.promociones-eliminar', {
            url:'/promociones/eliminar/:idPromocion',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/promociones/eliminar-promocion.html',
                    controller: 'EliminarPromocionCtrl'
                }
            }
        })



        /**
         * SERVICIOS
        */
        .state('app.servicios', {
            url:'/servicios',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/servicios/servicios.html',
                    controller: 'ServiciosCtrl'
                }
            }
        })
        .state('app.servicios-nuevo', {
            url:'/servicios/nuevo',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/servicios/form-servicio.html',
                    controller: 'NuevoServicioCtrl'
                }
            }
        })
        .state('app.servicios-editar', {
            url:'/servicios/editar/:idServicio',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/servicios/form-servicio.html',
                    controller: 'EditarServicioCtrl'
                }
            }
        })
        .state('app.servicios-eliminar', {
            url:'/servicios/eliminar/:idServicio',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/servicios/eliminar-servicio.html',
                    controller: 'EliminarServicioCtrl'
                }
            }
        })

        .state('app.servicios-subservicios-nuevo', {
            url:'/servicios/:idServicio/subservicios/nuevo',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/servicios/form-subservicio.html', 
                    controller: 'NuevoSubservicioCtrl'
                }
            }
        })
        .state('app.servicios-subservicios-editar', {
            url:'/servicios/:idServicio/subservicios/editar/:idSubservicio',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/servicios/form-subservicio.html', 
                    controller: 'EditarSubservicioCtrl'
                }
            }
        })
        .state('app.servicios-subservicios-eliminar', {
            url:'/servicios/:idServicio/subservicios/eliminar/:idSubservicio',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/servicios/eliminar-subservicio.html', 
                    controller: 'EliminarSubservicioCtrl'
                }
            }
        })


        /**
         * PRODUCTOS
         */
        .state('app.productos', {
            url:'/productos',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/productos/productos.html',
                    controller: 'ProductosCtrl'
                }
            }

        })
        .state('app.productos-nuevo', {
            url:'/productos/nuevo',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/productos/form-producto.html',
                    controller: 'NuevoProductoCtrl'
                }
            }

        })
        .state('app.productos-editar', {
            url:'/productos/editar/:id',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/productos/form-producto.html',
                    controller: 'EditarProductoCtrl'
                }
            }
        })
        .state('app.productos-eliminar', {
            url:'/productos/eliminar/:id',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/productos/eliminar-producto.html',
                    controller: 'EliminarProductoCtrl'
                }
            }
        })




        /**
         * USUARIOS
         */
        .state('app.usuarios', {
            url:'/usuarios',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/usuarios/usuarios.html',
                    controller: 'UsuariosCtrl'
                }
            }
        })
        .state('app.usuarios-nuevo', {
            url:'/usuarios/nuevo',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/usuarios/form-usuario.html',
                    controller: 'NuevoUsuarioCtrl'
                }
            }
        })
        .state('app.usuarios-editar', {
            url:'/usuarios/editar/:id',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/usuarios/form-usuario.html',
                    controller: 'EditarUsuarioCtrl'
                }
            }
        })
        .state('app.usuarios-eliminar', {
            url:'/usuarios/eliminar/:id',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/usuarios/eliminar-usuario.html',
                    controller: 'EliminarUsuarioCtrl'
                }
            }
        })






        /**
         * ORDENES
         */
        .state('app.ordenes', {
            url:'/ordenes',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/ordenes/ordenes.html',
                    controller: 'OrdenesCtrl'
                }
            }
        })



        /**
         * CONFIGRACIONES
         */
        .state('app.configuraciones', {
            url:'/configuraciones',
            views: {
                "contenedor": {
                    templateUrl: 'partials/app/configuraciones/configuraciones.html',
                    controller: 'ConfiguracionesCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise('/home/inicio');
}]);




