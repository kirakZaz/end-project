const mongoose = require('mongoose');
const user = require('./users');

const tokensSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, ref: user},
    token: String
}, {
    versionKey: false // Unable auto-version after persist database
});

const Tokens = mongoose.model('Tokens', tokensSchema);

module.exports = Tokens;