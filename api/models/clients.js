var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


// create a schema for ADMIN 
var employeSchema = new Schema({

    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    dateNaissance: {
        type: String,
        required: true
    },
 
    sexe: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    telPerso: {
        type: String,
        required: true
    },
 
 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    statutFamilial: {
        type: String,
        required: true
    },
    nationalite: {
        type: String,
        required: true
    },
    CIN: {
        type: String,
        required: true
    },

    
});

var employe = mongoose.model('employe', employeSchema);
module.exports = employe;