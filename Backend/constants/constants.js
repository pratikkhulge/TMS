require("dotenv").config();
module.exports = {
  allowedOrigins: ["http://localhost:5000","http://localhost:3000"],
  SERVER_PORT: process.env.PORT || 5000,
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
        user: 'ada92@ethereal.email',
        pass: 'WyXJjnxu7n2qYbSNvV'
    }
  },
};

