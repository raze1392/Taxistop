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
            'app_version': '3.3.03',
            'User-Agent': 'OlaConsumerApp/3.3.03 (android/4.4.4)',
            'enable_auto': 'true'
        },
        path: ''
    },
    secureRequest: {
        host: 'apps.olacabs.com',
        port: 443,
        method: 'GET',
        headers: {
            'api-key': '@ndro1d',
            'Host': 'apps.olacabs.com',
            'client': 'android',
            'app_version': '3.3.03',
            'User-Agent': 'OlaConsumerApp/3.3.03 (android/4.4.4)',
            'enable_auto': 'true'
        },
        path: ''
    },
    userId: encodeURIComponent('YjTgq/3vNPAVbf63OC3e/T3AYM8iYAZ5U9MZQ9NvX93UOVB//nkEZ5l2pF8aURmRtfID8TsJisxk6b1MG5WYUw=='),
};

OLA.Taxi_Name_Map = {
    economy_sedan: 'Sedan',
    compact: 'Mini',
    local_auto: 'Auto',
    pink: 'Pink',
    luxury_sedan: 'Prime',
    local_taxi: 'Kaali Peeli',
    food_delivery: 'Cafe',
}

module.exports = OLA;
