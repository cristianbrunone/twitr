const express = require("express");
const boom = require("@hapi/boom");
const tweetsService = require("../services/tweetsService.js");
const authenticationToken = require("../utils/middlewares/authMiddleware");
const validation = require("../utils/middlewares/createValidationMiddleware");
const { createTweetSchema, tweetIdSchema, updateTweetSchema } = require("../utils/schemas/tweetSchema");

const router = express.Router();

router.get("/", authenticationToken, getTweets);
router.post("/", authenticationToken, validation({ body: createTweetSchema }), createTweet);
router.get("/:tweetId", authenticationToken, validation({ params: tweetIdSchema }), getTweet);
router.delete("/:tweetId", authenticationToken, validation({ params: tweetIdSchema }), deleteTweet);
router.patch(
    "/:tweetId",
    authenticationToken,
    validation({ params: tweetIdSchema }),
    validation({ body: updateTweetSchema }),
    updateTweet
);

module.exports = router;

async function getTweets(req, res, next) {
    try {
        const tweets = await tweetsService.getTweets();
        res.status(200).json(tweets);
    } catch (error) {
        next(error);
    }
}

async function createTweet(req, res, next) {
    try {
        const tweet = {
            userId: req.user.userId,
            content: req.body.content,
        };
        const result = await tweetsService.createTweet(tweet);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

async function getTweet(req, res, next) {
    try {
        const { tweetId } = req.params;
        const tweet = await tweetsService.getTweet(tweetId);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }
        res.status(200).json(tweet);
    } catch (error) {
        next(error);
    }
}

async function deleteTweet(req, res, next) {
    try {
        const { tweetId } = req.params;
        const userId = req.user.userId;

        // Obtener el tweet para verificar el propietario
        const tweet = await tweetsService.getTweet(tweetId);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }
        if (tweet.userId !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this tweet" });
        }

        const deletedRows = await tweetsService.deleteTweet(tweetId);
        if (deletedRows > 0) {
            res.status(200).json({ message: "Tweet deleted" });
        } else {
            res.status(404).json({ error: "Tweet not found" });
        }
    } catch (error) {
        next(error);
    }
}

async function updateTweet(req, res, next) {
    try {
        const { tweetId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        // Obtener el tweet para verificar el propietario
        const tweet = await tweetsService.getTweet(tweetId);
        if (!tweet) {
            return res.status(404).json({ error: "Tweet not found" });
        }
        if (tweet.userId !== userId) {
            return res.status(403).json({ error: "You are not authorized to update this tweet" });
        }

        const updatedRows = await tweetsService.updateTweet(tweetId, content);
        if (updatedRows > 0) {
            res.status(200).json({ message: "Tweet updated" });
        } else {
            const { output: { statusCode, payload } } = boom.notFound();
            payload.message = "Tweet not found";
            res.status(statusCode).json(payload);
        }
    } catch (error) {
        next(error);
    }
}
