//Email/password auth endpoints

const express = require("express");
const router = express.Router();

const { signupController, loginController} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");
const bruteforceMiddleware = require("../middleware/bruteForce.middleware");


//signup
router.post("/signup", signupController);

//login
router.post("/login",bruteforceMiddleware, loginController);

// Get current user
router.get("/me", authMiddleware, (req, res)=> {
    res.status(200).json({
        success: true,
        user: req.user,
    })
});

module.exports = router;