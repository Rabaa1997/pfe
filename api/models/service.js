var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
// create a schema for Service 
var ServiceSchema = new Schema({
    service: {
        type: String,
        required: true
    },
    prix: {
        type: String,
         required: true
    } ,
    desc: {
        type: String,
         required: true
    } , 
    type: {
        type: String,
         required: true
    } ,
    idClientsParticiped:{
        type: []
    }
})

var Service = mongoose.model('Service', ServiceSchema);
module.exports = Service;