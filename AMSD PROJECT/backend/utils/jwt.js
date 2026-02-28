/**
 * JWT Utility Functions
 * Generate and manage JWT tokens
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {String} id - User ID
 * @returns {String} JWT token
 */
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Send token response
 * @param {Object} user - User object
 * @param {Number} statusCode - HTTP status code
 * @param {Object} res - Response object
 */
exports.sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const token = this.generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};
