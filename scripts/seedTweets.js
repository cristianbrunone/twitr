const connection = require("../lib/connect");

const insertTweets = `INSERT INTO tweets (userId, content)
VALUES
(1, 'Enviando mi primer tweet'),
(1, 'Enviando mi segundo tweet'),
(1, 'Enviando mi tercero tweet'),
(2, 'Enviando mi cuarto tweet'),
(2, 'Enviando mi quinto tweet'),
(2, 'Enviando mi sexto tweet');`;

const printError = (msg) => (error) => {
    error && console.log(msg, error);
};

connection.connect((error) => {
    if (error) {
        console.log("Error connecting to database", error);
        return;
    }

    connection.query(insertTweets, printError("Error inserting tweets"));

    console.log("Inserting tweets done!");

    connection.end();
});
