require("dotenv").config();
module.exports = {
  allowedOrigins: ["http://localhost:3000/"],
  SERVER_PORT: process.env.PORT || 3000,
  SERVER_DB_URI: process.env.DB_URI || "mongodb://127.0.0.1:27017/test",
  JWT_SECRET: "thisIsASimpleTest",
  OTP_LENGTH: 4 ,
  OTP_CONFIG: {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  },
  MAIL_SETTINGS: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lourdes44@ethereal.email',
        pass: '5MmAzPd2u2d3cbEWwW'
    }
  },
};
