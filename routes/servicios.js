var express = require('express');
var router = express.Router();

var Servicios = require('../models/servicios');
var Subservicios = require('../models/subservicios');

router.get('/', function(req, res) {
    Servicios
        .find()
        .populate('subservicios')
        .exec(function(err, servicios) {
            if (err) res.send(err);
            
            res.json(servicios);
        });
});

router.post('/', function(req, res){
	var servicio = new Servicios();
    servicio.nombre = req.body.nombre,
    servicio.descripcion = req.body.descripcion,
    
    servicio.save(function(err) {
        if (err) res.send(err);

        res.json({
            mensaje: 'servicio agregado',
            datos: servicio
        });
    });
});

router.get('/:idServicio', function(req, res) {
    Servicios.findById(req.params.idServicio, function(err, servicio) {
        if (err) res.send(err);

        res.json(servicio);
    });
});

router.put('/:idServicio', function(req, res){
    Servicios.findById(req.params.idServicio, function(err, servicio) {
        if (err) res.send(err);

        //modificar atributos del servicio
        servicio.nombre = req.body.nombre || servicio.nombre;
        servicio.descripcion = req.body.descripcion || servicio.descripcion;

        // Save the beer and check for errors
        servicio.save(function(err) {
            if (err) res.send(err);

            res.json(servicio);
        });
    });
});

router.delete('/:idServicio', function(req, res){
    Servicios.findByIdAndRemove(req.params.idServicio, function(err, servicio) {
        if (err) res.send(err);

        res.json(servicio);
    });
});

//subservicios:
router.get('/:idServicio/subservicios', function(req, res) {
    Subservicios
        .find()
        .populate('_creator')
        .exec(function(err, subservicios) {
            if (err) res.send(err);
            
            res.json(subservicios);
        });
});

router.post('/:idServicio/subservicios', function(req, res) {
    Servicios.findById(req.params.idServicio, function(err, servicio) {
        if (err) res.send(err);

        if(!servicio) throw err;
        
        var subservicio = new Subservicios();
        subservicio._creator = servicio._id;
        subservicio.nombre = req.body.nombre;
        subservicio.descripcion = req.body.descripcion;
        subservicio.precio = req.body.precio;
        subservicio.detalles = req.body.detalles;

        subservicio.save(function(err) {
            if(err) res.send(err);

            servicio.subservicios.push(subservicio);
            servicio.save(function(err) {
                if(err) res.send(err);

                res.json(servicio);
            });
        });        
    });
});

router.get('/subservicios/:idSubservicio', function(req, res){
     Subservicios
        .findById(req.params.idSubservicio)
        .populate('_creator')
        .exec(function(err, subservicio) {
            if (err) res.send(err);
            
            res.json(subservicio);
        });
});

router.put('/subservicios/:idSubservicio', function(req, res){
    Subservicios.findById(req.params.idSubservicio, function(err, subservicio) {
        if (err) res.send(err);

        //modificar atributos del subservicio
        subservicio.nombre = req.body.nombre || subservicio.nombre;
        subservicio.descripcion = req.body.descripcion || subservicio.descripcion;
        subservicio.precio = req.body.precio || subservicio.precio;
        subservicio.detalles = req.body.detalles || subservicio.detalles;

        // Save the beer and check for errors
        subservicio.save(function(err) {
            if (err) res.send(err);

            res.json(subservicio);
        });
    });
});

router.delete('/subservicios/:idSubservicio', function(req, res){
    Subservicios.findByIdAndRemove(req.params.idSubservicio, function(err, subservicio) {
        if (err) res.send(err);

        if(subservicio) {
            Servicios.findById(subservicio._creator, function(err, servicio) {
                if(err) res.send(err);

                servicio.subservicios.pull({ _id: subservicio._id }); // removed
                servicio.save(function(err) {
                    res.json(subservicio);
                });
            });
        } else {
            res.json({mensaje: "No se encontro el subservicio."});
        }
    });
});

module.exports = router;