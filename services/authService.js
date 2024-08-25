const authRepository = require("../repositories/authRepository");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const config = require('../config');

async function loginUser(loginData) {
    const { email, password } = loginData;

    // Obtener el usuario por email
    const user = await authRepository.getUserByEmail(email);
    if (!user) {
        throw boom.unauthorized('Credenciales inválidas');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw boom.unauthorized('Credenciales inválidas');
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user.userID }, config.jwtSecret, { expiresIn: '1h' });

    // Devolver tanto el token como el userId
    return { userId: user.userID, token };
}

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

async function getAllUsers() {
    return await authRepository.getAllUsers();
}

async function deleteUser(userId) {
    return await authRepository.deleteUser(userId);
}



module.exports = {
    registerUser,
    getUserById,
    updateUser,
    loginUser,
    getAllUsers,
    deleteUser
};
