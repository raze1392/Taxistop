function encryptOLAPassword(password) {
    password += '|';

    var key = CryptoJS.enc.Utf8.parse("PRODKEYPRODKEY12");
    var iv = CryptoJS.enc.Utf8.parse("");
    var encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}
