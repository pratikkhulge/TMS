const { verifyToken } = require('../services/JWT');

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

  const { role } = tokenData.data;
  if (role !== 'admin') {
    return { authorized: false, message: 'Only admins can perform this action' };
  }

  return { authorized: true };
};

module.exports = { authorizeAdmin };
