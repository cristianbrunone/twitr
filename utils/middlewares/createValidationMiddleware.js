const boom = require("@hapi/boom");
const validate = require("../schemas/validate");

// @param {object} validationSchema - {[ K in "body" | "query" | "params"]: JoiSchema}
function createValidationMiddleware(validationSchema) {
    const [payloadKey, joiSchema] = Object.entries(validationSchema)[0];

    if (payloadKey !== 'body' && payloadKey !== 'query' && payloadKey !== 'params') {
        throw new Error("Invalid payload key must be one of 'body', 'query', or 'params'");
    }

    return function validationMiddleware(req, res, next) {
        const error = validate(req[payloadKey], joiSchema);
        error ? next(boom.badRequest(error)) : next();
    };
}

module.exports = createValidationMiddleware;
