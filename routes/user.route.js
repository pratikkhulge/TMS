const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const loginController = require("../controllers/login.controller");
const ticketController = require("../controllers/ticket.controller");
// const ticketController = require("../controllers/ticket.controller");


router.post("/", authController.signUpUser);
router.post("/verify", authController.verifyUserEmail);
router.post("/resendotp", authController.generateNewUserOTP);
router.post('/login', loginController.userLogin);
router.get('/tickets', ticketController.showTicketsInOrganization);
router.post('/tickets/create', ticketController.createTicket);
router.put('/tickets/update/:key', ticketController.updateTicket);
module.exports = router;
