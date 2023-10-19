const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email
    };
    
    const secret = process.env.SCREETKEY;
    const options = { expiresIn: '1h' };
  
    return jwt.sign(payload, secret, options);
  }
  module.exports = {generateAccessToken};