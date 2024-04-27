const { verifyToken } = require('../services/JWT');
// const User = require('../models/User');

const authorizeUser = async (req, res) => {
    const BearerToken = req.headers.authorization;

  
    if (!BearerToken) {
      return { authorized: false, message: 'Unauthorized: Please Login First (Token is missing)' };
    }
  
    const tokenParts = BearerToken.split(' ');
    const token = tokenParts[1];

    console.log(token);
  
    const [isTokenValid, message, tokenData] = verifyToken(token);
    if (!isTokenValid) {
      return { authorized: false, message: 'Unauthorized: Invalid token' };
    }
  
    const { role, organisation , email} = tokenData.data;
    console.log("organisation", organisation);
    console.log("role",role)
    if (role !== 'user') {
      return { authorized: false, message: 'Only users can perform this action' };
    }
    
    // console.log(`Authorizing user ${organisation}` , true);
    return { authorized: true, organisation , email};
  };
  
  module.exports = { authorizeUser };