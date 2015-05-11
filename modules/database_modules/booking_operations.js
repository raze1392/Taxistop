var mongoose = require('mongoose');
var logger = require(__dirname + '/../helpers/log');
var cryptoTS = require(__dirname + '/../helpers/crypt_auth');
var Booking = require(__dirname + '/models/booking.js');

function copyBooking(sourceBooking, destinationBooking) {
    if (sourceBooking.date) destinationBooking.date = sourceBooking.date;
    if (sourceBooking.source_address) destinationBooking.source_address = sourceBooking.source_address;
    if (sourceBooking.source_location) destinationBooking.source_location = sourceBooking.source_location;
    if (sourceBooking.destination_address) destinationBooking.destination_address = sourceBooking.destination_address;
    if (sourceBooking.source_address) destinationBooking.destination_location = sourceBooking.destination_location;
}

var getBookingTemplate = function(date, source_address, source_location, destination_address, destination_location, service) {
    var booking = {
        id: cryptoTS.getUniqueId(),
        service: service,
        date: date,
        status: "IN_PROGRESS",
        source_address: source_address,
        source_location: {
            lat: source_location.lat,
            lng: source_location.lng
        },
        destination_address: destination_address,
        destination_location: {
            lat: destination_location.lat,
            lng: destination_location.lng
        },
        service_booking: {
            booking_id: null,
            booking_data: null
        },
        verified: false
    };

    return booking;
}

var createBooking = function(booking, callback) {
    var booking = new Booking(booking);
    existsBooking(booking.id, function(data) {
        if (!data) {
            booking.save(function(err) {
                if (!err) {
                    callback(booking.id);
                } else {
                    logger.error("Error creating booking with Id " + user.id);
                    callback(-1);
                }
            });
        } else {
            callback({
                message: "Booking already exists",
                error: -50,
                success: false
            });
        }
    });
}

var getBooking = function(bookingId, callback) {
    Booking.find({
        id: bookingId
    }, function(err, booking) {
        if (!err) {
            if (booking.length == 1) {
                callback(booking);
            } else if (booking.length > 1) {
                logger.error("[Database Inconsistency] Multiple booking exists with this bookingId " + bookingId);
                callback({
                    message: "Error fetching booking details",
                    error: -61,
                    success: false
                });
            } else {
                callback({
                    message: "Booking doesn't exist",
                    error: -62,
                    success: false
                });
            }
        } else {
            logger.error("Error finding booking with Id " + bookingId);
            callback(-1);
        }
    });
}

var updateBookingByCopy = function(bookingId, newBooking, callback) {
    Booking.find({
        id: bookingId
    }, function(err, booking) {
        if (!err) {
            copyBooking(newBooking, booking);
            booking.save(function(err) {
                if (!err) {
                    callback(booking.id);
                } else {
                    logger.error("Error updating booking with Id " + booking.id);
                    callback(-1);
                }
            });
        } else {
            logger.error("Error finding booking for update with Id " + bookingId);
            callback(-1);
        }
    });
}

var existsBooking = function(bookingId, callback) {
    Booking.find({
        id: bookingId
    }, function(err, booking) {
        if (!err) {
            callback(booking.length > 0);
        } else {
            logger.error("Error checking if a booking exists");
            callback(-1);
        }
    });
}

var getAllBookings = function(callback) {
    Booking.find({}, function(err, bookings) {
        if (!err) {
            callback(bookings);
        } else {
            logger.error("Error getting all bookings");
            callback(-1);
        }
    });
}

var updateBooking = function(bookingData, fieldsToCopyArray, callback) {
    Booking.findOne({
        id: bookingData.id
    }, function(err, booking) {
        if (!err) {
            for (var i = fieldsToCopyArray.length - 1; i >= 0; i--) {
                booking[fieldsToCopyArray[i]] = bookingData[fieldsToCopyArray[i]];
            };

            booking.save(function(err) {
                if (!err) {
                    callback(booking);
                } else {
                    logger.error("Error finding booking for update with Id " + bookingId);
                    callback(-1);
                }
            });
        } else {
            logger.error("Error getting all users");
            callback(-1);
        }
    });
}

var UserOps = {
    createBooking: createBooking,
    getBooking: getBooking,
    updateBookingByCopy: updateBookingByCopy,
    updateBooking: updateBooking,
    existsBooking: existsBooking,
    getAllBookings: getAllBookings,
    getBookingTemplate: getBookingTemplate
};

module.exports = UserOps;
