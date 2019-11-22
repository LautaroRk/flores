const User = require('../models/user');
const jwt = require('jsonwebtoken'); // para generar el token
const expressJwt = require('express-jwt'); // para checkear la autorizacion
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    //console.log("req.body", req.body);
    const user = new User(req.body);
    user.save( (err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    })
};

exports.login = (req, res) => {
    // buscar el usuario por el email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if ( err || !user ) {
            return res.status(400).json({
                error: "No existe ningún usuario con esa dirección de email"
            });
        }
        // si el usuario existe chequear la password
        // crear metodo de autenticacion en user model
        if ( !user.authenticate(password) ) {
            return res.status(401).json({
                error: "Credenciales incorrectas"
            })
        }

        // generar token firmado con id de usuario y secret jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // persistir el token como 't' en cookie con fecha de vencimiento
        res.cookie('t', token, { expire: new Date() + 9999 });

        // enviar la response con usuario y token al front
        const { _id, name, surname, email, role } = user;
        return res.json({ token, user: { _id, email, name, surname, role } });

    });
}

exports.logout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: "Se cerró la sesión" });
}

exports.requireLogin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    console.log(req.profile, req.auth)
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if ( !user ) {
        return res.status(403).json({
            error: "Acceso denegado"
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if ( req.profile.role !== 1 ) { // role admin = 1
        return res.status(403).json({
            error: "Se requieren permisos de administrador"
        });
    }
    next();
}