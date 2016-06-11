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

router.get('/:id', function(req, res) {
    Servicios.findById(req.params.id, function(err, servicio) {
        if (err) res.send(err);

        res.json(servicio);
    });
});

router.put('/:id', function(req, res){
    Servicios.findById(req.params.id, function(err, servicio) {
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

router.delete('/:id', function(req, res){
    Servicios.findByIdAndRemove(req.params.id, function(err, servicio) {
        if (err) res.send(err);

        res.json(servicio);
    });
});

//subservicios:
router.post('/:id/subservicios', function(req, res) {
    Servicios.findById(req.params.id, function(err, servicio) {
        if (err) res.send(err);

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



module.exports = router;