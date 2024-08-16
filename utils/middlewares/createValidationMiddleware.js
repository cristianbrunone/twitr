const validate = require("../schemas/validate");

// @param {object} validationSchema - {[ K in "body" | "query" | "params"]: JoiSchema}
function createValidationMiddleware(validationSchema) {
    const [[payloadKey, JoiSchema]] = Object.entries(validationSchema);

    if (payloadKey !== "body" &&
        payloadKey !== "query" &&
        payloadKey !== "params"
    ) {
        throw new Error(
            "Invalid payload key must be one of 'body', 'query, or 'params'"
        );
    }

    return function validationMiddleware(req, res, next) {
        const error = validate(req[payloadKey], joiSchema);
        error ? next(error) : next();

    };
}

module.exports = createValidationMiddleware;