const connection = require("../lib/connect.js");

// Crear tabla users
const createUsersTable = `
CREATE TABLE users (
    userID INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    bio TEXT,
    location VARCHAR(255),
    PRIMARY KEY (userID)
);
`;

// Crear tabla tweets
const createTweetsTable = `
CREATE TABLE tweets (
    tweetId INT AUTO_INCREMENT,
    userId INT,
    content VARCHAR(280),
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tweetId),
    FOREIGN KEY (userId) REFERENCES users(userID)
);
`;

// Insertar usuarios
const insertUsers = `
INSERT INTO users (username, email, passwordHash, bio, location)
VALUES
('Cristian', 'cristianbrunonecmbc@gmail.com', 'hashedPassword1', 'I love coding', 'New York'),
('Junior', 'junior@example.com', 'hashedPassword2', 'Enjoys hiking', 'San Francisco');
`;

const printError = (msg) => (error) => {
    error && console.log(msg, error)
};

connection.connect(error => {
    error && console.log("Errro connecting to database", error);

    connection.query(createUsersTable)

})

// Ejecutar las consultas
connection.query(createUsersTable, (err, results) => {
    if (err) {
        console.error('Error creating users table:', err);
        return;
    }
    console.log('Users table created successfully');
});

connection.query(createTweetsTable, (err, results) => {
    if (err) {
        console.error('Error creating tweets table:', err);
        return;
    }
    console.log('Tweets table created successfully');
});

connection.query(insertUsers, (err, results) => {
    if (err) {
        console.error('Error inserting users:', err);
        return;
    }
    console.log('Users inserted successfully');
});
