var MERU = {};

MERU.options = {
    requestGet: {
        host: 'mobileapp.merucabs.com',
        port: 80,
        method: 'GET',
        path: ''
    },
    requestPost: {
        host: 'merucabapp.com',
        port: 80,
        method: 'POST',
        path: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0,
            'Host': 'merucabapp.com',
        }
    }
};

MERU.Taxi_Name_Map = {
    genie: 'Genie',
    meru: 'Meru',
}

module.exports = MERU;
