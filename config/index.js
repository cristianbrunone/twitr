const dotenv = require('dotenv');
dotenv.config();

const config = {
    dev: process.env.NODE_ENV !== 'production', // Verifica si el entorno no es producción
    port: process.env.PORT || 3000, // Puerto del servidor, con 3000 como valor predeterminado
    db: { // Configuración de la base de datos usando las variables desglosadas
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    jwtSecret: process.env.JWT_SECRET // Clave secreta para JWT
};

module.exports = config;
