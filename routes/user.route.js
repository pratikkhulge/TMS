const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const loginController = require("../controllers/login.controller");

router.post("/", authController.signUpUser);
router.post("/verify", authController.verifyUserEmail);
router.post("/resendotp", authController.generateNewUserOTP);
router.post('/login', loginController.userLogin);


module.exports = router;
