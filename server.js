const { CgLogOff } = require("react-icons/cg");
const { app, db, PORT } = require("./config/config");
const { SERVER_DB_URI } = require("./constants/constants");
const initializeApp = async () => {
  try {
    await db.connect(SERVER_DB_URI);
    app.listen(PORT, async () => {
      console.log("------------------------------------------------------------------------");
      console.log("Running On Port : " , PORT);
      console.log("Connected : " , SERVER_DB_URI);
      console.log("------------------------------------------------------------------------");
    });
  } catch (error) {
    console.log(error);
  }
};
initializeApp();
