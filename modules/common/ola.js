var OLA = {};

OLA.options = {
    host: 'mapi.olacabs.com',
    port: 80,
    method: 'GET',
    headers: {
        'api-key': '@ndro1d',
        'Host': 'mapi.olacabs.com',
        'client': 'android',
        'device_id': '911380450341890',
        'enable_auto': 'true',
        'install_id': '5f48380f-46c8-4df5-a565-2ab650bc19fd'
    },
    path: ''
};

OLA.Taxi_Name_Map = {
    economy_sedan: 'Sedan',
    compact: 'Mini',
    local_auto: 'Auto',
    pink: 'Pink',
    luxury_sedan: 'Prime',
    local_taxi: 'Kaali Peeli'
}

module.exports = OLA;