const express = require("express");
const config = require("./config");
const tweetsRouter = require("./routes/tweetsRouter");
const authRouter = require("./routes/authRouter"); // Asegúrate de importar authRouter
const { logErrors, wrapErrors, errorHandler } = require("./utils/middlewares/errorMiddlewares");
const notFound = require("./utils/middlewares/notfoundMiddleware");

const app = express();
const port = config.port;

app.use(express.json());
app.use(express.static('frontend')); // Servir archivos estáticos desde la carpeta frontend

app.use("/api/auth", authRouter); // Agrega esta línea para manejar las rutas de autenticación
app.use("/tweets", tweetsRouter);

// Catch 404
app.use(notFound);

// Error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
