var mongoose = require('mongoose'); 
var passportLocalMongoose = require('passport-local-mongoose'); 
var Schema = mongoose. Schema; 
var User = new Schema ({ 
admin: 
{ 
type: Boolean, 
default: false 
} 
}); 
User.plugin (passportLocalMongoose); 
module.exports = mongoose.model('User', User);