const express = require('express');
const router = express.Router();
var employe = require('../models/employe');
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
// Register employe 
router.post('/register', function (req, res) {
    var pass = req.body.password
    var hashedPassword = bcrypt.hashSync(pass, 8);
    req.body.password = hashedPassword;
    employe.create(req.body,
        function (err, employe) {
            if (err) return res.status(200).send({
                auth: false,
                message: "cant save this employe"
            });
            // create a token
            var token = jwt.sign({
                id: employe._id
            }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

            res.status(200).send({
                auth: true,
                token: token,
                employeid: employe._id
            });
        });
});

//login
router.post('/login', function (req, res) {
    employe.findOne({ email: req.body.email }, function (err, employe) {
        if (err) return res.status(500).send('Error on the server.');
        if (!employe) return res.status(200).send({
            auth: false
        });
        var passwordIsValid = bcrypt.compareSync(req.body.password, employe.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: employe._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
            auth: true,
            token: token,
            employeId: employe._id
        });
    });
});

//Add new employe
router.post('/', (req, res) => {
    employe.create(req.body, function (err, employe) {
        if (err) return next(err);
        res.json(employe);
    });
});
//get all employes
router.get('/employees', (req, res) => {
    employe.find(function (err, employe) {
        if (err) return next(err);
        res.json(employe);
    });
});

//PUT : get/update/delete employe with _id
router.route('/:employe_id')
    // get   employe by  id
    .get(function (req, res) {
        employe.findById(req.params.employe_id, function (err, employe) {
            if (err) {
                res.status(404).send({
                    res: false
                });
            }
            res.json(employe);
        });
    })
    // update employe id
    .put(function (req, res) {
        employe.findByIdAndUpdate(req.params.employe_id, req.body, function (err, employe) {

            if (err)
                res.send(err);
            employe.save(function (err) {
                if (err)
                    res.status(404).send({
                        res: false
                    });

                res.json({
                    message: 'employe  updated!'
                });
            });

        });
    })
    // delete the employe with this id
    .delete(function (req, res) {
        employe.remove({
            _id: req.params.employe_id
        }, function (err, employe) {
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