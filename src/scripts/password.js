const CryptoJS = require('crypto-js');

const { StringDecoder } = require('string_decoder');

function hashPassword(password) {
    let salt = CryptoJS.lib.WordArray.random(128 / 8);
    let data = password + CryptoJS.enc.Utf8.parse(salt);
    let hash = CryptoJS.SHA256(data);

    return [hash.toString(CryptoJS.enc.hex), salt.toString(CryptoJS.enc.hex)];
}

function isPasswordCorrect(password, passwordHash, salt) {
    let data = password + CryptoJS.enc.Utf8.parse(salt);
    let hash = CryptoJS.SHA256(data);

    let hashHex = hash.toString(CryptoJS.enc.hex);

    console.log(passwordHash);
    console.log(hashHex);

    if (hashHex === passwordHash) {
        return true;
    } else {
        return false;
    }
}

module.exports = { hashPassword, isPasswordCorrect };