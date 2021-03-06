const express = require('express');
const router = express.Router();

const { requireLogin, isAuth, isAdmin } = require('../controllers/auth');
const { userById, read, update } = require('../controllers/user');

router.get('/secret/:userId', requireLogin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.get("/user/:userId", requireLogin, isAuth, read);
router.put("/user/:userId", requireLogin, isAuth, update);

router.param("userId", userById);

module.exports = router;