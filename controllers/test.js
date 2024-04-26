const { signToken, verifyToken } = require('../services/JWT');

// // Manually generate a JWT token
// const tokenData = { data: { email: 'example@example.com', role: 'admin' } };
// const token = signToken(tokenData);
// console.log('Generated JWT Token:', token);

const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTQxODc0NjYsImRhdGEiOnsiZW1haWwiOiJBQGFhLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE3MTQxMDEwNjZ9.b1n5EYY4_RB_Nsle5qGbREFZlesmDLdldoaI3507MMI";

// Test token verification
const [isTokenValid, message, tokenPayload] = verifyToken(token);
console.log('Is Token Valid?', isTokenValid);
console.log('Message:', message);
console.log('Token Payload:', tokenPayload);
