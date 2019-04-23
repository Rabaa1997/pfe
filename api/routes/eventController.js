const express = require('express');
const router = express.Router();
var Event = require('../models/Event');
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

//Add new Event
router.post('/', (req, res) => {
    Event.create(req.body, function (err, Event) {
        if (err) return next(err);
        res.json(Event);
    });
});
//get all Events
router.get('/Events', (req, res) => {
    Event.find(function (err, Event) {
        if (err) return next(err);
        res.json(Event);
    });
});

//PUT : get/update/delete Event with _id
router.route('/:Event_id')
    // get   Event by  id
    .get(function (req, res) {
        Event.findById(req.params.Event_id, function (err, Event) {
            if (err) {
                res.status(404).send({
                    res: false
                });
            }
            res.json(Event);
        });
    })
    // update Event id
    .put(function (req, res) {
        Event.findByIdAndUpdate(req.params.Event_id, req.body, function (err, Event) {

            if (err)
                res.send(err);
            Event.save(function (err) {
                if (err)
                    res.status(404).send({
                        res: false
                    });

                res.json({
                    message: 'Event  updated!'
                });
            });

        });
    })
    // delete the Event with this id
    .delete(function (req, res) {
        Event.remove({
            _id: req.params.Event_id
        }, function (err, Event) {
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