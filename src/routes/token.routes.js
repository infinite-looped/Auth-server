//Refresh and logout related routes

const express = require("express");
const router = express.Router();

const { refreshController, logoutController, logoutAllController} = require("../controllers/token.controller");

const authMiddleware = require("../middleware/auth.middleware");

//refresh access token
router.post("/refresh", refreshController);

//logout current session
router.post("/logout", logoutController);

//logout all the session
router.post("/logout-all", authMiddleware, logoutAllController);

module .exports = router;