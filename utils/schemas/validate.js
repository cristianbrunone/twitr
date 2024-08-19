const Joi = require('@hapi/joi');


function validate(data, schema) {
    const { error } = schema.validate(data);
    return error;
}

module.exports = validate;
