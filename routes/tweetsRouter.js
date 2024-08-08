const express = require("express");
const tweetsService = require("../services/tweetsService.js")

const router = express.Router();

router.get("/", getTweets);

module.exports = router;
async function getTweets(req, res) {
    try {
        const tweets = await tweetsService.getTweets();
        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}