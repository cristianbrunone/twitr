/*dotenv: Este módulo se utiliza para cargar variables de entorno
 desde un archivo .env a process.env. Esto es 
 útil para mantener información sensible, como 
 credenciales de base de datos, fuera del código fuente.*/

const dotenv = require('dotenv');
dotenv.config();

/*mysql2: Este módulo proporciona una API para conectarse y interactuar 
con bases de datos MySQL desde Node.js*/
const config = require('../config');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection;
