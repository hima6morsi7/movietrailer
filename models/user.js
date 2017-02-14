var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var ratingSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    moviename: {
         type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
var User = new Schema({
    username: String,
    password: String,
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    movierate : [ratingSchema]
});

User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);