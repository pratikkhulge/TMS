const cors = require("cors");
const { allowedOrigins } = require("../constants/constants");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`Origin ${origin} has requested and is allowed.`);
      callback(null, true);
    } else {
      console.log(`Origin ${origin} has requested and is not allowed.`);
      callback(new Error("Unauthorized"));
    }
  },
};

module.exports = cors(corsOptions);
