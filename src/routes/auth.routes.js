//Email/password auth endpoints

const express = require("express");
const router = express.Router();

const { signupController, loginController} = require("../controllers/auth.controller");
const { signupSchema, loginSchema } = require("../validators/auth.schema");
const validate = require("../middleware/validate.middleware");


const bruteforceMiddleware = require("../middleware/bruteForce.middleware");


//signup
router.post("/signup",  validate(signupSchema), signupController);

//login
router.post("/login",validate(loginSchema), bruteforceMiddleware, loginController);



module.exports = router;