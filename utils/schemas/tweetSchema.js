const Joi = require('@hapi/joi');

const idSchema = Joi.number();
const tweetContentSchema = Joi.string().max(280);

const tweetIdSchema = Joi.object({
    tweetId: idSchema.required()
});

const createTweetSchema = Joi.object({
    userId: idSchema.required(),
    content: tweetContentSchema.required()
});

const updateTweetSchema = Joi.object({
    content: tweetContentSchema.required()
});

module.exports = {
    tweetIdSchema,
    createTweetSchema,
    updateTweetSchema,
};
