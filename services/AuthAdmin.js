const { verifyToken } = require('../services/JWT');
const User = require('../models/User');

const authorizeAdmin = async (req, res) => {
  const BearerToken = req.headers.authorization;

  if (!BearerToken) {
    return { authorized: false, message: 'Unauthorized: Please Login First (Token is missing)' };
  }

  const tokenParts = BearerToken.split(' ');
  const token = tokenParts[1];

  const [isTokenValid, message, tokenData] = verifyToken(token);
  if (!isTokenValid) {
    return { authorized: false, message: 'Unauthorized: Invalid token' };
  }

  const { email, role } = tokenData.data;

  // Check if the user with the email exists in the database
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { authorized: false, message: 'Unauthorized: User does not exist' };
    }

    if (role !== 'admin') {
      return { authorized: false, message: 'Only admins can perform this action' };
    }

    return { authorized: true };
  } catch (error) {
    console.error('Error checking user existence:', error);
    return { authorized: false, message: 'Internal server error' };
  }
};

module.exports = { authorizeAdmin };
