exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Campo obligatorio').notEmpty();
    req.check('surname', 'Campo obligatorio').notEmpty();
    req.check('email', 'Debes ingresar una dirección de email válida').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    req.check('password', 'Campo obligatorio').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres");
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors[0].msg;
        return res.status(400).json({ error: firstError });
    }
    next();
}