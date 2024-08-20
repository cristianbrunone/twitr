const express = require("express");
const boom = require("@hapi/boom");
const authService = require("../services/authService.js");

const validation = require("../utils/middlewares/createValidationMiddleware");
const { createUserSchema, userIdSchema } = require("../utils/schemas/authSchema");

const router = express.Router();

router.post("/register", validation({ body: createUserSchema }), registerUser);
router.get("/user/:userId", validation({ params: userIdSchema }), getUserById);
router.patch("/user/:userId", validation({ params: userIdSchema }), updateUser);

module.exports = router;

async function registerUser(req, res, next) {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}



async function getUserById(req, res, next) {
    try {
        const { userId } = req.params;
        const user = await authService.getUserById(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            const { output: { statusCode, payload } } = boom.notFound("User not found");
            res.status(statusCode).json(payload);
        }
    } catch (error) {
        next(error);
    }
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
