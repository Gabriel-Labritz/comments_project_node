const express = require("express");
const router = express.Router();

// Controllers
const AuthController = require("../controllers/authController");

router.get("/login", AuthController.login);
router.post("/login", AuthController.loginSave);
router.get("/register", AuthController.register);
router.post("/register", AuthController.registerSave);
router.get("/logout", AuthController.logOut);

module.exports = router;
