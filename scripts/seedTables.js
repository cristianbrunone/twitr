const connection = require("../lib/connect.js");

// Crear tabla users
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    userID INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
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
CREATE TABLE IF NOT EXISTS tweets (
    tweetId INT AUTO_INCREMENT,
    userId INT,
    content VARCHAR(280),
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tweetId),
    FOREIGN KEY (userId) REFERENCES users(userID) ON DELETE CASCADE
);
`;

// Insertar usuarios
const insertUsers = `
INSERT IGNORE INTO users (username, email, passwordHash, bio, location)
VALUES
('Cristian', 'cristianbrunonecmbc@gmail.com', 'hashedPassword1', 'I love coding', 'New York'),
('Junior', 'junior@example.com', 'hashedPassword2', 'Enjoys hiking', 'San Francisco');
`;

// Manejo de errores
const printError = (msg) => (error) => {
    if (error) {
        console.error(msg, error);
    }
};

// Conectar a la base de datos
connection.connect((error) => {
    if (error) {
        console.error("Error connecting to the database:", error);
        return;
    }

    // Crear tablas
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

    // Insertar datos
    connection.query(insertUsers, (err, results) => {
        if (err) {
            console.error('Error inserting users:', err);
            return;
        }
        console.log('Users inserted successfully');
    });

    // Cerrar la conexión
    connection.end((err) => {
        if (err) {
            console.error('Error closing the connection:', err);
        } else {
            console.log('Connection closed successfully');
        }
    });
});
