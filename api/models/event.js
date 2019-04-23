var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
// create a schema for Event 
var EventSchema = new Schema({
    titre: {
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
    idClientsParticiped:{
        type: []
    }
})

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;