var fbConfig = require(__dirname + '/../firebase/config');
var crypto = require("crypto");
var Buffer = require('buffer').Buffer;

var APP_TITLE = 'TaxiStop';
var API_HASH_KEY = "TAXi$top";
var ENV = process.env.NODE_ENV;
var TAXISTOP_SECRET_KEY_AES = "TAXISTOPSTOPTAXI";

var GOOGLE_API_KEYS = [
    "",
    "AIzaSyCoWnRV1a-5GZAwJFRgrQlU0xmDFJRjzVQ",
    "AIzaSyBLRq6bkEP8ZiJ0BBfFQ78Bq2LzVjX3-o8",
    "AIzaSyBbAX5JrFJ8Y6YqLV84-ex52z9tBGJd92o",
    "AIzaSyAVWw8oS6JCdAIwqes8xKC5SFZ5GFzualM",
    "AIzaSyA40uFvZXdxaVkmXiK6Rldo7NBcY-lKLOk"
];
var API_INDEX = 0;

var CAB_SERVICES = ['ola', 'meru', 'uber', 'tfs'];

exports.getCabServices = function() {
    return CAB_SERVICES;
}

exports.getCDNUrlPrefix = function() {
    if (ENV === 'production') {
        return 'http://akush.github.io/taxistop';
    } else {
        return '';
    }
}

// ================ GMaps APIs =================
exports.getGmapsAPI = function() {
    var gMapsAPI = "AIzaSyBbAX5JrFJ8Y6YqLV84-ex52z9tBGJd92o";
    if (ENV === 'production') {
        gMapsAPI = (GOOGLE_API_KEYS[API_INDEX] === "" ? ("&key=" + GOOGLE_API_KEYS[API_INDEX + 1]) : ("&key=" + GOOGLE_API_KEYS[API_INDEX]));
    }
    API_INDEX = (API_INDEX + 1) % (GOOGLE_API_KEYS.length);
    return gMapsAPI;
}

exports.getGmapsAPIKeys = function() {
    return GOOGLE_API_KEYS;
}

// ================ ENV APIs =================
exports.getAppTitle = function() {
    return APP_TITLE;
}

exports.isEnvironmentProduction = function() {
    if (!ENV) return false;
    else return (ENV.toLowerCase() === 'production') ? true : false;
}

exports.getAPIHashKey = function() {
    return API_HASH_KEY;
}

//  ================ Firebase URLs =================
exports.getFirebaseUrls = function() {
    var urls = {
        app: fbConfig.getDb('app').url,
        rates: fbConfig.getDb('rates').url
    }
    return urls;
}

//  ================ Encryption/Decryption URLs =================
exports.encryptTaxistopPassword = function(password) {
    var iv = new Buffer('');
    var key = new Buffer(TAXISTOP_SECRET_KEY_AES, 'utf8');
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    var chunks = [];
    chunks.push(cipher.update(new Buffer(password, 'utf8'), 'buffer', 'base64'));
    chunks.push(cipher.final('base64'));
    encPassword = chunks.join('');

    return encPassword;
}

exports.decryptTaxistopPassword = function(encPassword) {
    var iv = new Buffer('');
    var key = new Buffer(TAXISTOP_SECRET_KEY_AES, 'utf8');
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    var password = decipher.update(new Buffer(encPassword, 'base64'), 'buffer', 'utf8');
    password += decipher.final('utf8');

    return password
}
