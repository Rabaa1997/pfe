const express = require('express');
const router = express.Router();
var Room = require('../models/room');
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
// Register Room 
router.post('/register', function (req, res) {
    var pass = req.body.password
    var hashedPassword = bcrypt.hashSync(pass, 8);
    req.body.password = hashedPassword;
    Room.create(req.body,
        function (err, Room) {
            if (err) return res.status(200).send({
                auth: false,
                message: "cant save this Room"
            });
            // create a token
            var token = jwt.sign({
                id: Room._id
            }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

            res.status(200).send({
                auth: true,
                token: token,
                Roomid: Room._id
            });
        });
});

//login
router.post('/login', function (req, res) {
    Room.findOne({ email: req.body.email }, function (err, Room) {
        if (err) return res.status(500).send('Error on the server.');
        if (!Room) return res.status(200).send({
            auth: false
        });
        var passwordIsValid = bcrypt.compareSync(req.body.password, Room.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: Room._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
            auth: true,
            token: token,
            RoomId: Room._id
        });
    });
});

//Add new Room
router.post('/', (req, res) => {
    Room.create(req.body, function (err, Room) {
        if (err) return next(err);
        res.json(Room);
    });
});
//get all Rooms
router.get('/Roomes', (req, res) => {
    Room.find(function (err, Room) {
        if (err) return next(err);
        res.json(Room);
    });
});

//PUT : get/update/delete Room with _id
router.route('/:Room_id')
    // get   Room by  id
    .get(function (req, res) {
        Room.findById(req.params.Room_id, function (err, Room) {
            if (err) {
                res.status(404).send({
                    res: false
                });
            }
            res.json(Room);
        });
    })
    // update Room id
    .put(function (req, res) {
        Room.findByIdAndUpdate(req.params.Room_id, req.body, function (err, Room) {

            if (err)
                res.send(err);
            Room.save(function (err) {
                if (err)
                    res.status(404).send({
                        res: false
                    });

                res.json({
                    message: 'Room  updated!'
                });
            });

        });
    })
    // delete the Room with this id
    .delete(function (req, res) {
        Room.remove({
            _id: req.params.Room_id
        }, function (err, Room) {
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