const express = require('express');
const router = express.Router();
var Client = require('../models/clients');
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
// Register Client 
router.post('/register', function (req, res) {
    var pass = req.body.password
    var hashedPassword = bcrypt.hashSync(pass, 8);
    req.body.password = hashedPassword;
    Client.create(req.body,
        function (err, Client) {
            if (err) return res.status(200).send({
                auth: false,
                message: "cant save this Client"
            });
            // create a token
            var token = jwt.sign({
                id: Client._id
            }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

            res.status(200).send({
                auth: true,
                token: token,
                Clientid: Client._id
            });
        });
});

//login
router.post('/login', function (req, res) {
    Client.findOne({ email: req.body.email }, function (err, Client) {
        if (err) return res.status(500).send('Error on the server.');
        if (!Client) return res.status(200).send({
            auth: false
        });
        var passwordIsValid = bcrypt.compareSync(req.body.password, Client.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: Client._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
            auth: true,
            token: token,
            ClientId: Client._id
        });
    });
});

//Add new Client
router.post('/', (req, res) => {
    Client.create(req.body, function (err, Client) {
        if (err) return next(err);
        res.json(Client);
    });
});
//get all Clients
router.get('/Clientes', (req, res) => {
    Client.find(function (err, Client) {
        if (err) return next(err);
        res.json(Client);
    });
});

//PUT : get/update/delete Client with _id
router.route('/:Client_id')
    // get   Client by  id
    .get(function (req, res) {
        Client.findById(req.params.Client_id, function (err, Client) {
            if (err) {
                res.status(404).send({
                    res: false
                });
            }
            res.json(Client);
        });
    })
    // update Client id
    .put(function (req, res) {
        Client.findByIdAndUpdate(req.params.Client_id, req.body, function (err, Client) {

            if (err)
                res.send(err);
            Client.save(function (err) {
                if (err)
                    res.status(404).send({
                        res: false
                    });

                res.json({
                    message: 'Client  updated!'
                });
            });

        });
    })
    // delete the Client with this id
    .delete(function (req, res) {
        Client.remove({
            _id: req.params.Client_id
        }, function (err, Client) {
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