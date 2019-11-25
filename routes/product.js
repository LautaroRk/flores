const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, list, listRelated, listSpecies, listBySearch, photo } = require('../controllers/product');
const { requireLogin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireLogin, isAuth, isAdmin, create);
router.delete("/product/:productId/:userId", requireLogin, isAuth, isAdmin, remove);
router.put("/product/:productId/:userId", requireLogin, isAuth, isAdmin, update);

// Obtiene todos los productos, pudiendo pasarle orden y limite
router.get("/products", list);
// Obtiene los productos de la misma especie
router.get("/products/related/:productId", listRelated);
// Obtiene la lista de especies utilizadas en productos
router.get("/products/species", listSpecies);
// Obtiene productos filtrados
router.post("/products/by/search", listBySearch);
// Obtiene las imagenes de los productos
router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;