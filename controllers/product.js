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
    let limit = req.query.limit ? req.query.limit : 6;

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