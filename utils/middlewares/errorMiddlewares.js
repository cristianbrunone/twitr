const boom = require("@hapi/boom");
const config = require('../../config');


function withErrorStack(error, stack) {
    if (config.dev) {
        return { ...error, stack };
    }
    return error;
}

function logErrors(err, req, res, next) {
    console.error(err);
    next(err);
}

function wrapErrors(err, req, res, next) {
    if (!err.isBoom) {
        next(boom.badImplementation(err));
    }

    next(err);
}

function errorHandler(err, req, res, next) {
    const { stack, output } = err;
    res.status(output.statusCode);
    res.json(withErrorStack(output.payload, err.stack));
}


module.exports = {
    logErrors,
    wrapErrors,
    errorHandler,
};