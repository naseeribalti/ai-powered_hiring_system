const { validationResult } = require('express-validator');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
    }));

    return res.status(422).json({ errors: formattedErrors });
};

module.exports = validationMiddleware;
