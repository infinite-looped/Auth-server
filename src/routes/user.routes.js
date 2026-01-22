const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  getCurrentUserController,
} = require("../controllers/user.controller");

// GET /auth/me
router.get("/me", authMiddleware, getCurrentUserController);

module.exports = router;
