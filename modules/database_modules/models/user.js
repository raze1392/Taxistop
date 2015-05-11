var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    sos: [{
        name: String,
        email: String,
        phone: String
    }],
    connected_services: {},
    bookings: [{
        booking_id: String,
        status: String,
        date: Date
    }],
    verified: Boolean,
    id: String
}, {
    minimize: false
});

module.exports = mongoose.model('User', UserSchema);
