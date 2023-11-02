const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    username: user.username
  };

  const secret = process.env.SCREETKEY;
  const options = { expiresIn: '7d' };

  return jwt.sign(payload, secret, options);
}
function generatePasswordResetToken(user) {
  const payload = {
    id: user.id,
    username: user.username
  };

  const secret = process.env.SCREETKEY;
  const options = { expiresIn: '1d' };

  return jwt.sign(payload, secret, options);
}
  module.exports = {generateRefreshToken, generatePasswordResetToken};