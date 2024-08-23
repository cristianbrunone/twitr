const express = require("express");
const config = require("./config");
const tweetsRouter = require("./routes/tweetsRouter");
const authRouter = require("./routes/authRouter");
const { logErrors, wrapErrors, errorHandler } = require("./utils/middlewares/errorMiddlewares");
const notFound = require("./utils/middlewares/notfoundMiddleware");
const authenticateToken = require('./utils/middlewares/authMiddleware'); // Importa el middleware

const app = express();
const port = config.port;

app.use(express.json());
app.use(express.static('frontend')); // Servir archivos estáticos desde la carpeta frontend

app.use("/api/auth", authRouter); // Rutas de autenticación
app.use("/tweets", authenticateToken, tweetsRouter); // Protege las rutas de tweets

// Catch 404
app.use(notFound);

// Error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
