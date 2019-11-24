const express = require('express');
const router = express.Router();

const { create, read, update, remove, list, speciesById } = require('../controllers/species');
const { requireLogin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get("/species/:speciesId", read);
router.post("/species/create/:userId", requireLogin, isAuth, isAdmin, create);
router.delete("/species/:speciesId/:userId", requireLogin, isAuth, isAdmin, remove);
router.put("/species/:speciesId/:userId", requireLogin, isAuth, isAdmin, update);
router.get("/species", list);

router.param("userId", userById);
router.param("speciesId", speciesById);

module.exports = router;