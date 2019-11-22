exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('surname', 'Surname is required').notEmpty();
    req.check('email', 'You must enter a valid email').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters");
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors[0].msg;
        return res.status(400).json({ error: firstError });
    }
    next();
}