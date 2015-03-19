var OLA = {};

OLA.options = {
    request: {
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
    },
    primaryHost: 'mapi.olacabs.com',
    secondaryHost: 'apps.olacabs.com',
    userId: encodeURIComponent('YjTgq/3vNPAVbf63OC3e/T3AYM8iYAZ5U9MZQ9NvX93UOVB//nkEZ5l2pF8aURmRtfID8TsJisxk6b1MG5WYUw=='),
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
