const connection = require("../lib/connect.js");

// Crear usuario
async function createUser(userData) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users SET ?';
        connection.query(query, userData, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve({ userID: res.insertId, ...userData });
            }
        });
    });
}

// Obtener usuario por email
async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]); // Asegúrate de que `res[0]` sea correcto
            }
        });
    });
}

// Obtener usuario por ID
async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE userID = ?';
        connection.query(query, [userId], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]); // Asegúrate de que `res[0]` sea correcto
            }
        });
    });
}

// Actualizar usuario
async function updateUser(userId, updateData) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET ? WHERE userID = ?';
        connection.query(query, [updateData, userId], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.affectedRows); // Verifica `affectedRows` para asegurar que la actualización fue exitosa
            }
        });
    });
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
};
