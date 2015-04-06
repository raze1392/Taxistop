var crypto = require("crypto");
var Buffer = require('buffer').Buffer;

// Constants
var TAXISTOP_SECRET_KEY_AES = "TAXISTOPSTOPTAXI";
var TAXISTOP_HASH_KEY = "#@sHTaX!St0P";


//  ========================== Hashes ===========================
exports.hashIt = function (data) {
    var sha = crypto.createHash('sha512');
    var hashInput = data + TAXISTOP_HASH_KEY;
    sha.update(hashInput);
    var hash = sha.digest('base64');
    return hash;
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

    return password;
}