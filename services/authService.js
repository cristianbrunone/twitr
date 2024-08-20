const authRepository = require("../repositories/authRepository");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');


module.exports = {
    registerUser,
    getUserById,
    updateUser,
};

async function registerUser(userData) {
    const { username, email, password } = userData;

    // Verifica si el usuario ya existe por su email
    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) {
        throw boom.badRequest('El correo electrónico ya está registrado.');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Inserta el nuevo usuario en la base de datos
    return await authRepository.createUser({ username, email, passwordHash });
}



async function getUserById(userId) {
    return await authRepository.getUserById(userId);
}

async function updateUser(userId, updateData) {
    return await authRepository.updateUser(userId, updateData);
}
