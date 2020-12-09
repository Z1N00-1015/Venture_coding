const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    keys: [String],
});

module.exports = {
    User,
};


//signup


//signin