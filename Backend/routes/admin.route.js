const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const deptController = require("../controllers/department.controller");
const loginController = require("../controllers/login.controller");
const ticketController = require("../controllers/ticket.controller");

router.post("/", authController.signUpAdmin);
router.post("/verify", authController.verifyAdminEmail);
router.post("/resendotp", authController.generateNewAdminOTP);
router.post('/login', loginController.adminLogin);

router.post('/department', deptController.addDepartment); 
router.get('/department', deptController.showAllDepartments)
router.put('/department/:organizationName', deptController.updateDepartment); 
router.delete('/department/:organizationName', deptController.deleteDepartment); 
router.get('/tickets/all', ticketController.showAllTickets); 


module.exports = router;
