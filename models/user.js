// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');

// set up a mongoose model and pass it using module.exports
var UserSchema = new mongoose.Schema({ 
    name: String, 
    password: String, 
    admin: Boolean 
});

module.exports = mongoose.model('User', UserSchema);