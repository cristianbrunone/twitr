const authRepository = require("../repositories/authRepository");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        throw new Error('El correo electrónico ya está registrado.');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Inserta el nuevo usuario en la base de datos
    return await authRepository.createUser({ username, email, passwordHash });
}

async function loginUser(email, password) {
    // Busca el usuario por su email
    const user = await authRepository.getUserByEmail(email);
    if (!user) {
        throw new Error('Correo electrónico o contraseña incorrectos.');
    }

    // Compara la contraseña
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Correo electrónico o contraseña incorrectos.');
    }

    // Genera el token JWT
    const token = jwt.sign({ userId: user.userID, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, user };
}

async function getUserById(userId) {
    return await authRepository.getUserById(userId);
}

async function updateUser(userId, updateData) {
    return await authRepository.updateUser(userId, updateData);
}
