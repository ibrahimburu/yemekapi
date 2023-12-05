const CryptoJS = require('crypto-js/md5');
require('dotenv').config();


function encrypt (password){
    try {
        return ciphertext = CryptoJS(password).toString();
    } catch (error) {
        return error;
    }
    
}

function decrypt (hashpassword){
    try {
        const bytes = CryptoJS.AES.decrypt(hashpassword,process.env.SCREETKEY).toString();
        return originalText = bytes;
    } catch (error) {
        return error;
    }
    
}
module.exports = {encrypt,decrypt};