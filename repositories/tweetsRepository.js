const connection = require("../lib/connect");

module.exports = {
    getTweets,
}

async function getTweets() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tweets';
        connection.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}