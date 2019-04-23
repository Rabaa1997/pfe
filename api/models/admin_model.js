var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
// create a schema for ADMIN 
var adminSchema = new Schema({
    email: {
        type: String,
      //  required: true
    },
    password: {
        type: String,
      // required: true
    }
})

var Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;