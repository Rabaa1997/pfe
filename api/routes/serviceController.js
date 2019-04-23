const express = require('express');
const router = express.Router();
var Service = require('../models/Service');
var bodyParser = require('body-parser');
//pour crypter un password 
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());
//Now you’re ready to add the modules for using JSON Web Tokens and encrypting passwords.
var jwt = require('jsonwebtoken');
var VerifyToken = require('./VerifyToken');

//Add new Service
router.post('/', (req, res) => {
    Service.create(req.body, function (err, Service) {
        if (err) return next(err);
        res.json(Service);
    });
});
//get all Services
router.get('/Services', (req, res) => {
    Service.find(function (err, Service) {
        if (err) return next(err);
        res.json(Service);
    });
});

//PUT : get/update/delete Service with _id
router.route('/:Service_id')
    // get   Service by  id
    .get(function (req, res) {
        Service.findById(req.params.Service_id, function (err, Service) {
            if (err) {
                res.status(404).send({
                    res: false
                });
            }
            res.json(Service);
        });
    })
    // update Service id
    .put(function (req, res) {
        Service.findByIdAndUpdate(req.params.Service_id, req.body, function (err, Service) {

            if (err)
                res.send(err);
            Service.save(function (err) {
                if (err)
                    res.status(404).send({
                        res: false
                    });

                res.json({
                    message: 'Service  updated!'
                });
            });

        });
    })
    // delete the Service with this id
    .delete(function (req, res) {
        Service.remove({
            _id: req.params.Service_id
        }, function (err, Service) {
            if (err)
                res.status(404).send({
                    res: false
                });

            res.json({
                message: 'Successfully deleted'
            });
        });
    });




module.exports = router;