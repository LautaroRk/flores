const _ = require('lodash');

const Species = require('../models/species');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.speciesById = (req, res, next, id) => {
    Species.findById(id, (err, species) => {
        if ( err || !species ) {
            res.status(400).json({
                error: "No se encontró la especie"
            });
        }
        req.species = species;
        next();
    });
}

exports.create = (req, res) => {
    const species = new Species(req.body);
    species.save((err, data) => {
        if ( err ) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
}

exports.read = (req, res) => {
    return res.json( req.species );
}

exports.update = (req, res) => {
    const species = req.species;
    species.name = req.body.name;
    species.save((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.remove = (req, res) => {
    const species = req.species;
    species.remove( (err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: `Se eliminó la especie: ${species.name}`
        });
    });
}

exports.list = (req, res) => {
    Species.find().exec( (err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}