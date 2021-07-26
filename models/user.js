const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')


const UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
})
//passport adds username, pass, makes sure username is not duplicated etc 
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema)

module.exports = User