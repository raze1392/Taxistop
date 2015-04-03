var mongoose = require('mongoose');

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phone: Number,
    sos: [{
        name: String,
        email: String,
        phone: Number
    }],
    connected_services: [{
        service: String,
        email: Date,
        password: String,
        phone: Number,
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
