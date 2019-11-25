const formidable = require('formidable');
const _ =  require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if ( err || !product ) {
            return res.status(400).json({
                error: "No se encontró el producto"
            });
        }
        req.product = product;
        next();
    });
}

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json( req.product );
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Error al subir la imagen"
            });
        }
        let product = new Product(fields);

        // chequeamos que esten completos todos los campos
        const { species, variety, price, quantity, is_available } = fields;
        if ( !species || !variety || !price || !quantity || !is_available ) {
            return res.status(400).json({
                error: "Debes completar todos los campos"
            });
        }

        if (files.photo) {
            // chequeamos el tamaño de la imagen
            // size: 1kb = 1000, 1mb = 1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "La imagen es demasiado grande, su tamaño debe ser inferior a 1MB"
                });
            }

            product.photo.data = fs.readFileSync( files.photo.path );
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler( err )
                });
            }
            res.json( result );
        });
    });
}

exports.remove = (req, res) => {
    let product = req.product;

    product.remove( (err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler( err )
            });
        }
        res.json({
            "message": `Se eliminó el producto: ${deletedProduct.variety}`
        });
    });
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Error al subir la imagen"
            });
        }
        let product = req.product;
        // metodo de lodash para reemplazar los campos de un objeto por los nuevos valores
        product = _.extend(product, fields);

        // chequeamos que esten completos todos los campos
        const { species, variety, price, quantity, is_available } = fields;
        if ( !species || !variety || !price || !quantity || !is_available ) {
            return res.status(400).json({
                error: "Debes completar todos los campos"
            });
        }

        if (files.photo) {
            // chequeamos el tamaño de la imagen
            // size: 1kb = 1000, 1mb = 1000000
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "La imagen es demasiado grande, su tamaño debe ser inferior a 1MB"
                });
            }

            product.photo.data = fs.readFileSync( files.photo.path );
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler( err )
                });
            }
            res.json( result );
        });
    });
}

/**
 * mas vendidos / nuevos
 * mostrar los mas vendidos: /products?sortBy=sold&order=desc&limit=4
 * mostrar los mas nuevos: /products?sortBy=createdAt&order=desc&limit=4
 * si no se reciben parametros, devolvemos todos los productos
 */
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        // le quitamos la propiedad photo
        .select("-photo")
        // le agregamos la especies
        .populate('species')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec( (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No se encontraron productos"
                });
            }
            res.send(products);
        });
}

/**
 * Devuelve los productos que corresponden a la misma especie
 */
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    // $ne = not including
    Product.find({ _id: { $ne: req.product }, species: req.product.species })
        .limit(limit)
        .populate('species', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No se encontraron productos relacionados"
                });
            }
            res.json(products);
        });
}

exports.listSpecies = (req, res) => {
    Product.distinct("species", {}, (err, species) => {
        if (err) {
            return res.status(400).json({
                error: "No se encontraron especies"
            });
        }
        res.json(species);
    })
}

/**
 * Lista productos filtrados por la busqueda
 */ 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("species")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No se encontraron productos"
                });
            }
            res.json({
                size: products.length,
                products
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}