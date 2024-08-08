const tweetsRepository = require("../repositories/tweetsRepository");

module.exports = {
    getTweets,
}

async function getTweets() {
    return await tweetsRepository.getTweets();
}