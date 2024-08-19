const boom = require('@hapi/boom');

function notFoundMiddleware(req, res) {
    const { output: { statusCode, payload } } = boom.notFound();  // Corrigido: `payload`

    res.status(statusCode).json(payload);
}

module.exports = notFoundMiddleware;
