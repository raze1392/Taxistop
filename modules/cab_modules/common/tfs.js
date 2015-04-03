var TFS = {};

TFS.options = {
    requestGet: {
        host: 'iospush.taxiforsure.com',
        port: 80,
        method: 'GET',
        path: ''
    },
    requestPost: {
        host: 'iospush.taxiforsure.com',
        port: 80,
        method: 'POST',
        path: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0,
            'Host': 'iospush.taxiforsure.com',
        }
    },
    requestPostAppApi: {
        host: 'api.taxiforsure.com',
        port: 80,
        method: 'POST',
        path: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0,
            'Host': 'api.taxiforsure.com',
            'Connection': 'Keep-Alive'
        }
    }
};

TFS.Taxi_Name_Map = {
    hatchback: 'Hatchback',
    sedan: 'Sedan',
    auto: 'Auto',
    nano: 'Nano'
}

module.exports = TFS;
