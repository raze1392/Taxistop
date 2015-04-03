var mongoose = require('mongoose');

var BookingSchema = new Schema({
    id: String
    service: String,
    date: String,
    status: String,
    source_address: String,
    destination_address: String,
    service_booking: {
        booking_id: String,
    }
    verified: Boolean
});

module.exports = mongoose.model('Booking', BookingSchema);
