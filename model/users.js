const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        // required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum: ['User', 'Moderator', 'Admin'],
        default: 'User'
    },
    name: {
        type: String
    }
})

// Saves the user's password hashed (plain text password storage is not good)
userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


userSchema.methods.comparePassword = async function (userPassword, cb) {
    await bcrypt.compare(userPassword, this.password, function (err, isMatch) {

        if (err) return err;
        cb(null, isMatch);
    });

};


module.exports = mongoose.model('users', userSchema);