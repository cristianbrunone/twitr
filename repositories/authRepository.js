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
                resolve(res.affectedRows); 
            }
        });
    });
}

// Obtener todos los usuarios
async function getAllUsers() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users';
        connection.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res); // Retorna todos los usuarios
            }
        });
    });
}

async function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }

            // Primero, elimina los tweets asociados con el usuario
            const deleteTweetsQuery = 'DELETE FROM tweets WHERE userId = ?';
            connection.query(deleteTweetsQuery, [userId], (err) => {
                if (err) {
                    return connection.rollback(() => reject(err));
                }

                // Luego, elimina el usuario
                const deleteUserQuery = 'DELETE FROM users WHERE userID = ?';
                connection.query(deleteUserQuery, [userId], (err, res) => {
                    if (err) {
                        return connection.rollback(() => reject(err));
                    }

                    // Comete la transacción
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => reject(err));
                        }

                        resolve(res.affectedRows > 0); // Retorna true si se eliminó al menos un registro
                    });
                });
            });
        });
    });
}


module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
    getAllUsers,
    deleteUser,
};
