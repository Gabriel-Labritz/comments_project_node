const express = require("express");
const router = express.Router();

// Controller
const CommentsController = require("../controllers/commentsController");

// Middleware
const checkAuth = require("../middlewares/auth").checkAuth;

router.get("/add", checkAuth, CommentsController.createComments);
router.post("/add", checkAuth, CommentsController.createCommentsSave);
router.get("/", CommentsController.showComments);
router.get("/dashboard", checkAuth, CommentsController.dashboard);
router.get("/edit/:id", checkAuth, CommentsController.editComment);
router.post("/edit", checkAuth, CommentsController.editCommentSave);
router.post("/remove", checkAuth, CommentsController.removeComment);

module.exports = router;
