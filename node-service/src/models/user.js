const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});
var User = null;

mongoose.Promise = global.Promise;

// authenticate input against database documents
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (error, user) {
            if (error) {
                return callback(error);
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (error, result) {
                if (result) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        })
}

// hash password before saving to database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    }.bind(user));
});
User = mongoose.model('User', UserSchema);
module.exports = User;