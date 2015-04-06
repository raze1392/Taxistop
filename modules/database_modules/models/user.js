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
    connected_services: [{
        service: String,
        email: Date,
        password: String,
        phone: String,
        auth_token: String,
        user_id: String
    }],
    bookings: [{
        booking_id: String,
        status: String,
        date: Date
    }],
    verified: Boolean,
    id: String
});

module.exports = mongoose.model('User', UserSchema);
