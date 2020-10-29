var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose')

var User = new Schema({
    firstname : {
        type: String,
        default :''
    },
    lastname : {
        type: String,
        default :''
    },
  /*   username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    }, */
    facebookId: String, ///// will store the facebookId of the user that has passed in the access token.
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);