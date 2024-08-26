const express = require("express");
const boom = require("@hapi/boom");
const authService = require("../services/authService.js");

const validation = require("../utils/middlewares/createValidationMiddleware");
const { createUserSchema, userIdSchema, loginSchema } = require("../utils/schemas/authSchema");

const router = express.Router();

router.post("/register", validation({ body: createUserSchema }), registerUser);
router.post("/login", validation({ body: loginSchema }), loginUser);
router.get("/user/:userId", validation({ params: userIdSchema }), getUserById);
router.patch("/user/:userId", validation({ params: userIdSchema }), updateUser);
router.get("/users", getAllUsers); 
router.delete("/user/:userId", validation({ params: userIdSchema }), deleteUser);


module.exports = router;

async function registerUser(req, res, next) {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

async function loginUser(req, res, next) {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
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

async function updateUser(req, res, next) {
    try {
        const { userId } = req.params;
        const result = await authService.updateUser(userId, req.body);
        if (result) {
            res.status(200).json({ message: "User updated successfully" });
        } else {
            const { output: { statusCode, payload } } = boom.notFound("User not found");
            res.status(statusCode).json(payload);
        }
    } catch (error) {
        next(error);
    }
}

// Nueva función para obtener todos los usuarios
async function getAllUsers(req, res, next) {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const { userId } = req.params;
        const result = await authService.deleteUser(userId);
        if (result) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            const { output: { statusCode, payload } } = boom.notFound("User not found");
            res.status(statusCode).json(payload);
        }
    } catch (error) {
        console.error("Error in deleteUser:", error); // Agrega un log para verificar errores
        next(error);
    }
}

