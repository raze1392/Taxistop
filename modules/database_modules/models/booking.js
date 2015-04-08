var mongoose = require('mongoose');

var BookingSchema = new mongoose.Schema({
    id: String
    service: String,
    date: String,
    status: String,
    source_address: String,
    source_location: {
        lat: Number,
        lng: Number
    },
    destination_address: String,
    destination_location: {
        lat: Number,
        lng: Number
    },
    service_booking: {
        booking_id: String,
    }
    verified: Boolean
});

module.exports = mongoose.model('Booking', BookingSchema);
