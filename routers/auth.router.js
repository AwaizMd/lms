const router = require("express").Router();
const authController = require("../controllers/Users/Auth.controller")

//signup route
router.post("/register",authController.register);
//login route
router.post("/login",authController.login);
//verify otp
router.post("/verify-otp",authController.verifyOTP); // 1)"step" : "updateDetails" 2)"step" : "sendOtp" 3)"step" : "updatePassword"   

module.exports = router;