const express = require('express');
const router = express.Router();

const { create, read, update, remove, list, categoryById } = require('../controllers/category');
const { requireLogin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get("/category/:categoryId", read);
router.post("/category/create/:userId", requireLogin, isAuth, isAdmin, create);
router.delete("/category/:categoryId/:userId", requireLogin, isAuth, isAdmin, remove);
router.put("/category/:categoryId/:userId", requireLogin, isAuth, isAdmin, update);
router.get("/categories", list);

router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;