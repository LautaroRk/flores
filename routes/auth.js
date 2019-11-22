const express = require('express');
const router = express.Router();

const { signup, login, logout, requireLogin } = require('../controllers/auth');
const { userSignupValidator } = require('../validator');

router.post("/signup", userSignupValidator, signup);
router.post("/login", login);
router.get("/logout", logout);

router.get('/hello', requireLogin, (req, res) => {
    res.send("holi")
})

module.exports = router;