const Joi = require('@hapi/joi');

// Definición de esquemas para autenticación y usuario
const idSchema = Joi.number().integer();
const usernameSchema = Joi.string().min(3).max(30);
const emailSchema = Joi.string().email();
const passwordSchema = Joi.string().min(6);

const userIdSchema = Joi.object({
    userId: idSchema.required()
});

const createUserSchema = Joi.object({
    username: usernameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required()
});

const loginSchema = Joi.object({
    email: emailSchema.required(),
    password: passwordSchema.required()
});

module.exports = {
    userIdSchema,
    createUserSchema,
    loginSchema
};
