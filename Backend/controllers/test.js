const { signToken, verifyToken } = require('../services/JWT');

// // Manually generate a JWT token
// const tokenData = { data: { email: 'example@example.com', role: 'admin' } };
// const token = signToken(tokenData);
// console.log('Generated JWT Token:', token);

const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTQyMDcxNTksImRhdGEiOnsiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwib3JnYW5pemF0aW9uIjpbIm9yZzAwMSIsIm9yZzAwMiJdfSwiaWF0IjoxNzE0MTIwNzU5fQ.pcqxOyjvQR55CugXGnBTbK6ULZFYaNx69R3hWD2A5fc";

// Test token verification
const [isTokenValid, message, tokenPayload] = verifyToken(token);
// console.log('Is Token Valid?', isTokenValid);
// console.log('Message:', message);
// console.log('Token Payload:', tokenPayload);
