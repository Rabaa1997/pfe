var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var async = require("async");
const crypto = require('crypto');

//Now you’re ready to add the modules for using JSON Web Tokens and encrypting passwords.
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');
//model
var Admin = require('../models/admin_model');

//REGISTER 
router.post('/register', function (req, res) {
    console.log(req.body)
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
   req.body.password = hashedPassword;

   console.log(req.body);
    Admin.create(req.body,
        function (err, Admin) {
            if (err) return res.status(500).send("There was a problem registering the Admin.")

            // create a token
            var token = jwt.sign({ id: Admin._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).send({ auth: true, token: token });
        });
});


//ME
router.get('/me', VerifyToken, function (req, res) {
    var token = req.headers['x-access-token'];
    //token vide 
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    // token non vide  
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        //res.status(200).send(decoded);
        Admin.findById(decoded.id, // projection
            function (err, Admin) {
                if (err) return res.status(500).send("There was a problem finding the Admin.");
                if (!Admin) return res.status(404).send("No Admin found.");
                res.status(200).send(Admin);

            });

    });
});



//LOGIN 
router.post('/login', function (req, res) {
    console.log("here");
    Admin.findOne({ email: req.body.email }, function (err, Admin) {
        if (err) return res.status(500).send('Error on the server.');
        if (!Admin) {
            return res.status(200).send({
                auth: false,
                token: null,
                AdminId: null
            });
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, Admin.password);
        if (!passwordIsValid) {
            return res.status(200).send({ auth: false, token: null });
            res.end()}
        var token = jwt.sign({ id: Admin._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
            auth: true,
            token: token,
            AdminId: Admin._id
        });
    });
});



// LOGOUT
router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null, AdminId: null });
});



router.route('/:Admin_id')
    // get the Admin with that id
    .get(function (req, res) {
        Admin.findById(req.params.Admin_id, function (err, Admin) {
            if (err) {
                res.status(404).send({
                    res: false
                });
            }
            res.json(Admin);
        });
    })
    
    // update the Admin with this id
    .put(function (req, res) {
        Admin.findById(req.params.Admin_id, function (err, Admin) {
            if (err)
                res.send(err);
            console.log(Admin.password);
            var passwordIsValid = bcrypt.compareSync(req.body.passwordAcien, Admin.password);
            console.log(req.body.passwordAcien);
            if (!passwordIsValid) return res.status(401).send({ msg: "l'ancien mot de passe est incorecte !" });
            Admin.password = bcrypt.hashSync(req.body.passwordNv, 8);

            Admin.save(function (err) {
                if (err)
                    res.send(err);
                res.json({
                    message: 'Password updated!'
                });
            });
        });
    });

module.exports = router;
