var TFS = {};

TFS.options = {
    request: {
        host: 'iospush.taxiforsure.com',
        port: 80,
        method: 'GET',
        path: ''
    }
};

TFS.Taxi_Name_Map = {
    hatchback: 'Hatchback',
    sedan: 'Sedan',
    auto: 'Auto',
    nano: 'Nano'
}

module.exports = TFS;
